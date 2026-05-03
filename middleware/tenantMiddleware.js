const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET || 'korea-inspect-secret-key';

function tenantMiddleware(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).json({ success: false, payload: 'Token no proporcionado' });
    }

    const token = bearerHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded.companyId) {
            return res.status(403).json({ success: false, payload: 'Token sin empresa asignada' });
        }

        req.userId = decoded.userId;
        req.companyId = decoded.companyId;
        req.userEmail = decoded.email;
        req.userRoles = decoded.roles;

        next();
    } catch (e) {
        return res.status(401).json({ success: false, payload: 'Token invalido o expirado' });
    }
}

module.exports = tenantMiddleware;
