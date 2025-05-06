exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // User is logged in
    }
    return res.status(401).json({ error: "Not logged in" });
};

exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.userType === 'admin') {
        return next(); // User is admin
    }
    return res.status(403).json({ error: "Admin access required" });
};