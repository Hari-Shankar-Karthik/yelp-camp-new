module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectInfo = {
            method: req.method,
            targetURL: req.originalUrl,
        };
        console.log(`redirecting to login page. target url: ${req.originalUrl}`);
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}