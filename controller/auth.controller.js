const authRepository = require('../repository/AuthRepository')

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({ success: false, payload: 'Email y contraseña son requeridos' })
        }

        const result = await authRepository.login(email, password)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { userId, currentPassword, newPassword } = req.body
        if (!userId || !currentPassword || !newPassword) {
            return res.json({ success: false, payload: 'Todos los campos son requeridos' })
        }

        const result = await authRepository.changePassword(userId, currentPassword, newPassword)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.selectCompany = async (req, res, next) => {
    try {
        const { companyId } = req.body
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            return res.json({ success: false, payload: 'Token no proporcionado' })
        }

        // Verify the temp token
        const decoded = authRepository.verifyToken(token)
        if (!decoded.userId) {
            return res.json({ success: false, payload: 'Token invalido' })
        }

        if (!companyId) {
            return res.json({ success: false, payload: 'companyId es requerido' })
        }

        const result = await authRepository.selectCompany(decoded.userId, companyId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            return res.json({ success: false, payload: 'Token no proporcionado' })
        }

        const decoded = authRepository.verifyToken(token)
        res.json({ success: true, payload: decoded })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
