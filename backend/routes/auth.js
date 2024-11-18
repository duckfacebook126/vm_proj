const checkAuth = (req, res, next) => {
    if (!req.session.uId) {
        // User is not logged in, redirect to the login page or send a 401 Unauthorized response
        return res.redirect('/login');
    } else {
        // User is logged in, proceed to the next middleware or route handler
        next();
    }
};

module.exports = checkAuth;
