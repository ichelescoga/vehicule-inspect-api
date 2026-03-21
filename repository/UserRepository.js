const sequelize = require('../components/conn_sqlz');
const bcrypt = require('bcryptjs');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let UserRepository = function(){

    // ─── ACCOUNT REQUESTS ───

    let requestAccount = async(params) => {
        // Check if email already exists in User table
        const existing = await models.User.findOne({ where: { email: params.email } })
        if (existing) throw new Error('Ya existe un usuario con ese correo')

        // Check if there's already a pending request
        const pendingReq = await models.Account_Request.findOne({
            where: { email: params.email, status: 1 }
        })
        if (pendingReq) throw new Error('Ya existe una solicitud pendiente con ese correo')

        return await models.Account_Request.create({
            name: params.name,
            email: params.email,
            status: 1,
            created_at: new Date()
        })
    }

    let getPendingAccountRequests = async() => {
        return await models.Account_Request.findAll({
            where: { status: 1 },
            order: [['created_at', 'ASC']]
        })
    }

    let approveAccount = async(id, password, rolId) => {
        const request = await models.Account_Request.findByPk(id)
        if (!request) throw new Error('Solicitud no encontrada')
        if (request.status !== 1) throw new Error('La solicitud ya fue procesada')

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await models.User.create({
            username: request.name,
            email: request.email,
            password: hashedPassword,
            status: 1,
            created_at: new Date()
        })

        // Assign role selected by admin
        if (rolId) {
            await models.User_Rol_Assign.create({
                user_id: user.id,
                rol_id: rolId,
                status: 1
            })
        }

        // Update request status
        await models.Account_Request.update(
            { status: 2, updated_at: new Date() },
            { where: { id } }
        )

        return user
    }

    let rejectAccount = async(id) => {
        const request = await models.Account_Request.findByPk(id)
        if (!request) throw new Error('Solicitud no encontrada')

        return await models.Account_Request.update(
            { status: 3, updated_at: new Date() },
            { where: { id } }
        )
    }

    // ─── PASSWORD RESET REQUESTS ───

    let requestPasswordReset = async(email) => {
        const user = await models.User.findOne({ where: { email, status: 1 } })
        if (!user) throw new Error('No se encontro un usuario con ese correo')

        // Check if there's already a pending request
        const pendingReq = await models.Password_Reset_Request.findOne({
            where: { user_id: user.id, status: 1 }
        })
        if (pendingReq) throw new Error('Ya existe una solicitud de reset pendiente')

        return await models.Password_Reset_Request.create({
            user_id: user.id,
            status: 1,
            created_at: new Date()
        })
    }

    let getPendingPasswordResetRequests = async() => {
        return await models.Password_Reset_Request.findAll({
            where: { status: 1 },
            include: [{
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email']
            }],
            order: [['created_at', 'ASC']]
        })
    }

    let approvePasswordReset = async(id, newPassword) => {
        const request = await models.Password_Reset_Request.findByPk(id)
        if (!request) throw new Error('Solicitud no encontrada')
        if (request.status !== 1) throw new Error('La solicitud ya fue procesada')

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await models.User.update(
            { password: hashedPassword, updated_at: new Date() },
            { where: { id: request.user_id } }
        )

        return await models.Password_Reset_Request.update(
            { status: 2, updated_at: new Date() },
            { where: { id } }
        )
    }

    let rejectPasswordReset = async(id) => {
        return await models.Password_Reset_Request.update(
            { status: 3, updated_at: new Date() },
            { where: { id } }
        )
    }

    // ─── PENDING COUNTS ───

    let getPendingRequestsCount = async() => {
        const accountCount = await models.Account_Request.count({ where: { status: 1 } })
        const resetCount = await models.Password_Reset_Request.count({ where: { status: 1 } })
        return { accountRequests: accountCount, passwordResets: resetCount }
    }

    // ─── USER MANAGEMENT ───

    let getAllUsers = async() => {
        return await models.User.findAll({
            attributes: ['id', 'username', 'email', 'status', 'last_login', 'created_at'],
            include: [{
                model: models.User_Rol_Assign,
                as: 'User_Rol_Assigns',
                where: { status: 1 },
                required: false,
                include: [{
                    model: models.User_Rol,
                    as: 'rol'
                }]
            }],
            order: [['id', 'ASC']]
        })
    }

    let updateUser = async(id, params) => {
        return await models.User.update({
            username: params.username,
            email: params.email,
            status: params.status,
            updated_at: new Date()
        }, { where: { id } })
    }

    // ─── ROLE MANAGEMENT ───

    let getAllRoles = async() => {
        return await models.User_Rol.findAll({
            where: { status: 1 },
            order: [['id', 'ASC']]
        })
    }

    let createRole = async(params) => {
        const existing = await models.User_Rol.findOne({ where: { name: params.name, status: 1 } })
        if (existing) throw new Error('Ya existe un rol con ese nombre')

        return await models.User_Rol.create({
            name: params.name,
            status: 1
        })
    }

    let updateRole = async(id, params) => {
        const existing = await models.User_Rol.findOne({
            where: { name: params.name, status: 1, id: { [require('sequelize').Op.ne]: id } }
        })
        if (existing) throw new Error('Ya existe otro rol con ese nombre')

        return await models.User_Rol.update({
            name: params.name
        }, { where: { id } })
    }

    let deleteRole = async(id) => {
        // Check if role is assigned to any user
        const assignments = await models.User_Rol_Assign.count({ where: { rol_id: id, status: 1 } })
        if (assignments > 0) throw new Error('No se puede eliminar un rol que tiene usuarios asignados')

        return await models.User_Rol.update({ status: 0 }, { where: { id } })
    }

    let assignRole = async(userId, rolId) => {
        // Check if already assigned
        const existing = await models.User_Rol_Assign.findOne({
            where: { user_id: userId, rol_id: rolId, status: 1 }
        })
        if (existing) throw new Error('El usuario ya tiene este rol asignado')

        return await models.User_Rol_Assign.create({
            user_id: userId,
            rol_id: rolId,
            status: 1
        })
    }

    let removeRole = async(userId, rolId) => {
        return await models.User_Rol_Assign.update(
            { status: 0 },
            { where: { user_id: userId, rol_id: rolId } }
        )
    }

    // ─── ROLE PERMISSIONS ───

    let getPermissionsByRole = async(rolId) => {
        return await models.Role_Permission.findAll({
            where: { rol_id: rolId, status: 1 },
            attributes: ['id', 'menu_key']
        })
    }

    let updateRolePermissions = async(rolId, menuKeys) => {
        // Deactivate all current permissions
        await models.Role_Permission.update(
            { status: 0 },
            { where: { rol_id: rolId } }
        )

        // Create new permissions
        if (menuKeys && menuKeys.length > 0) {
            const records = menuKeys.map(key => ({
                rol_id: rolId,
                menu_key: key,
                status: 1
            }))
            await models.Role_Permission.bulkCreate(records)
        }

        return await getPermissionsByRole(rolId)
    }

    let getPermissionsByUser = async(userId) => {
        // Get all active role assignments for the user
        const assignments = await models.User_Rol_Assign.findAll({
            where: { user_id: userId, status: 1 },
            include: [{
                model: models.User_Rol,
                as: 'rol',
                include: [{
                    model: models.Role_Permission,
                    as: 'Role_Permissions',
                    where: { status: 1 },
                    required: false
                }]
            }]
        })

        // Collect unique menu_keys from all roles
        const menuKeys = new Set()
        assignments.forEach(a => {
            if (a.rol && a.rol.Role_Permissions) {
                a.rol.Role_Permissions.forEach(p => menuKeys.add(p.menu_key))
            }
        })

        return Array.from(menuKeys)
    }

    return {
        requestAccount,
        getPendingAccountRequests,
        approveAccount,
        rejectAccount,
        requestPasswordReset,
        getPendingPasswordResetRequests,
        approvePasswordReset,
        rejectPasswordReset,
        getPendingRequestsCount,
        getAllUsers,
        updateUser,
        getAllRoles,
        createRole,
        updateRole,
        deleteRole,
        assignRole,
        removeRole,
        getPermissionsByRole,
        updateRolePermissions,
        getPermissionsByUser
    }
}

module.exports = UserRepository();
