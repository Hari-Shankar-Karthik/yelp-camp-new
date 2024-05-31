const User = require('../models/user');
const {userSchema} = require('../schemas');

module.exports.registerForm = (req, res) => {
    res.render('auth/register');
}

module.exports.register = async (req, res, next) => {
    try {
        await userSchema.validateAsync(req.body);
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        const {redirectInfo} = req.session;
        req.login(registeredUser, err => {
            if(err) {
                return next(err);
            }
            req.session.redirectInfo = redirectInfo;
            req.flash('success', 'User registered successfully!');
            next();
        })
    } catch(err) {
        if(err.code === 11000) {
            req.flash('error', 'A user with the given email is already registered');
        } else {
            req.flash('error', err.message);
        }
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('auth/login');
}

module.exports.login = (req, res, next) => {
    req.flash('success', 'Logged in successfully!');
    next();
}

module.exports.logout = (req, res) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You are not logged in');
        return res.redirect('/campgrounds');
    }
    req.logout(err => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/campgrounds');
    });
}