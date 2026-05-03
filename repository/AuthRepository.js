const sequelize = require('../components/conn_sqlz');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

const JWT_SECRET = process.env.SECRET || 'korea-inspect-secret-key';
const JWT_EXPIRES_IN = '24h';

let AuthRepository = function(){

    let login = async(email, password) => {
        const user = await models.User.findOne({
            where: { email, status: 1 },
            include: [{
                model: models.User_Rol_Assign,
                as: 'User_Rol_Assigns',
                where: { status: 1 },
                required: false,
                include: [
                    { model: models.User_Rol, as: 'rol' },
                    { model: models.Company, as: 'company' }
                ]
            }]
        })

        if (!user) throw new Error('Usuario no encontrado o inactivo')
        if (!user.password) throw new Error('Usuario sin contraseña asignada')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('Contraseña incorrecta')

        // Update last_login
        await models.User.update(
            { last_login: new Date() },
            { where: { id: user.id } }
        )

        // Build companies with roles
        const assignments = (user.User_Rol_Assigns || [])
        const companiesMap = {}
        assignments.forEach(a => {
            const compId = a.company_id
            if (!companiesMap[compId]) {
                companiesMap[compId] = {
                    id: compId,
                    name: a.company?.name,
                    roles: []
                }
            }
            companiesMap[compId].roles.push({
                id: a.rol?.id,
                name: a.rol?.name
            })
        })
        const companies = Object.values(companiesMap)

        // If user has exactly one company, generate JWT directly
        if (companies.length === 1) {
            const company = companies[0]
            await models.User.update(
                { company_id: company.id },
                { where: { id: user.id } }
            )

            const token = jwt.sign(
                { userId: user.id, email: user.email, companyId: company.id, roles: company.roles },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            )

            return {
                token,
                requireCompanySelection: false,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    company,
                    roles: company.roles
                }
            }
        }

        // If user has multiple companies, return list for selector (no JWT yet)
        // Generate a short-lived temp token just for the selectCompany step
        const tempToken = jwt.sign(
            { userId: user.id, email: user.email, temp: true },
            JWT_SECRET,
            { expiresIn: '5m' }
        )

        return {
            token: tempToken,
            requireCompanySelection: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                companies
            }
        }
    }

    let selectCompany = async(userId, companyId) => {
        // Verify user has access to this company
        const assignment = await models.User_Rol_Assign.findAll({
            where: { user_id: userId, company_id: companyId, status: 1 },
            include: [
                { model: models.User_Rol, as: 'rol' },
                { model: models.Company, as: 'company' }
            ]
        })

        if (!assignment || assignment.length === 0) {
            throw new Error('No tienes acceso a esta empresa')
        }

        const user = await models.User.findByPk(userId)
        if (!user) throw new Error('Usuario no encontrado')

        // Update active company
        await models.User.update(
            { company_id: companyId },
            { where: { id: userId } }
        )

        const roles = assignment.map(a => ({
            id: a.rol?.id,
            name: a.rol?.name
        }))

        const company = {
            id: companyId,
            name: assignment[0].company?.name,
            roles
        }

        // Generate full JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, companyId, roles },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                company,
                roles
            }
        }
    }

    let changePassword = async(userId, currentPassword, newPassword) => {
        const user = await models.User.findByPk(userId)
        if (!user) throw new Error('Usuario no encontrado')

        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) throw new Error('Contraseña actual incorrecta')

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await models.User.update(
            { password: hashedPassword, updated_at: new Date() },
            { where: { id: userId } }
        )

        return true
    }

    let verifyToken = (token) => {
        try {
            return jwt.verify(token, JWT_SECRET)
        } catch(e) {
            throw new Error('Token invalido o expirado')
        }
    }

    return {
        login,
        selectCompany,
        changePassword,
        verifyToken
    }
}

module.exports = AuthRepository();
