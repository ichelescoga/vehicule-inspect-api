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
                include: [{
                    model: models.User_Rol,
                    as: 'rol'
                }]
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

        // Build roles array
        const roles = (user.User_Rol_Assigns || []).map(a => ({
            id: a.rol?.id,
            name: a.rol?.name
        }))

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, roles },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
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
        changePassword,
        verifyToken
    }
}

module.exports = AuthRepository();
