const checkAuth = (req, res, next) => {
    if (req.session.username) {
        // User is logged in, proceed to the next middleware or route handler
        next();
    } else {
        // User is not logged in, redirect to the login page or send a 401 Unauthorized response
        return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
    }
};

module.exports = checkAuth;
