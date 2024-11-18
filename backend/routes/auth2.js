const checkAuth2 = (req, res, next) => {
    if (req.body.login) {
        // User is logged in, proceed to the next middleware or route handler
    return res.redirect('/dashboard');
    } else {
        // User is not logged in, redirect to the login page or send a 401 Unauthorized response
        return res.status(200).json({ message: 'authorized access.' });
        next();
    }
};



module.exports =checkAuth2;