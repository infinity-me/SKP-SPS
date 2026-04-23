/**
 * Role-Based Authorization Middleware
 * Usage: requireRole('admin') or requireRole('admin', 'teacher')
 *
 * MUST be used AFTER the `auth` middleware so that req.user is already set.
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required." });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires role: [${roles.join(', ')}]. Your role: ${req.user.role}.`
            });
        }

        next();
    };
};

module.exports = { requireRole };
