const userRepository = require('../repository/UserRepository')

exports.requestAccount = async (req, res, next) => {
    try {
        const result = await userRepository.requestAccount({
            name: req.body.name,
            email: req.body.email
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.requestPasswordReset = async (req, res, next) => {
    try {
        const result = await userRepository.requestPasswordReset(req.body.email)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getPendingRequests = async (req, res, next) => {
    try {
        const accountRequests = await userRepository.getPendingAccountRequests()
        const passwordResets = await userRepository.getPendingPasswordResetRequests()
        res.json({ success: true, payload: { accountRequests, passwordResets } })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getPendingRequestsCount = async (req, res, next) => {
    try {
        const result = await userRepository.getPendingRequestsCount()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.approveAccount = async (req, res, next) => {
    try {
        const result = await userRepository.approveAccount(req.params.id, req.body.password, req.body.rolId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.rejectAccount = async (req, res, next) => {
    try {
        const result = await userRepository.rejectAccount(req.params.id)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.approvePasswordReset = async (req, res, next) => {
    try {
        const result = await userRepository.approvePasswordReset(req.params.id, req.body.newPassword)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.rejectPasswordReset = async (req, res, next) => {
    try {
        const result = await userRepository.rejectPasswordReset(req.params.id)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await userRepository.getAllUsers()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const result = await userRepository.updateUser(req.params.id, req.body)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── ROLE MANAGEMENT ───

exports.getAllRoles = async (req, res, next) => {
    try {
        const result = await userRepository.getAllRoles()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createRole = async (req, res, next) => {
    try {
        const result = await userRepository.createRole({ name: req.body.name })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateRole = async (req, res, next) => {
    try {
        const result = await userRepository.updateRole(req.params.id, { name: req.body.name })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.deleteRole = async (req, res, next) => {
    try {
        const result = await userRepository.deleteRole(req.params.id)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.assignRole = async (req, res, next) => {
    try {
        const result = await userRepository.assignRole(req.body.userId, req.body.rolId, req.companyId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.removeRole = async (req, res, next) => {
    try {
        const result = await userRepository.removeRole(req.params.userId, req.params.rolId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── ROLE PERMISSIONS ───

exports.getPermissionsByRole = async (req, res, next) => {
    try {
        const result = await userRepository.getPermissionsByRole(req.params.rolId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateRolePermissions = async (req, res, next) => {
    try {
        const result = await userRepository.updateRolePermissions(req.params.rolId, req.body.menuKeys)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getPermissionsByUser = async (req, res, next) => {
    try {
        const result = await userRepository.getPermissionsByUser(req.params.userId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── COMPANY MANAGEMENT ───

exports.getAllCompanies = async (req, res, next) => {
    try {
        const result = await userRepository.getAllCompanies()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createCompany = async (req, res, next) => {
    try {
        const result = await userRepository.createCompany({ name: req.body.name, logo: req.body.logo, config: req.body.config })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateCompany = async (req, res, next) => {
    try {
        const result = await userRepository.updateCompany(req.params.id, req.body)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getCompanyUsers = async (req, res, next) => {
    try {
        const result = await userRepository.getCompanyUsers(req.params.companyId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.assignUserCompanyRole = async (req, res, next) => {
    try {
        const result = await userRepository.assignUserCompanyRole(req.body.userId, req.body.companyId, req.body.rolId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.removeUserCompanyRole = async (req, res, next) => {
    try {
        const result = await userRepository.removeUserCompanyRole(
            parseInt(req.params.userId), parseInt(req.params.companyId), parseInt(req.params.rolId)
        )
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getUserCompanies = async (req, res, next) => {
    try {
        const result = await userRepository.getUserCompanies(req.params.userId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
