const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const wrapAsync = require("../errors/wrapAsync");

const {userSchema} = require("../schemas");

const redirectToTargetURL = (req, res) => {
    const redirectURL = req.session.targetURL || '/campgrounds';
    req.session.targetURL = null;
    res.redirect(redirectURL);
}

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', async (req, res, next) => {
    try {
        await userSchema.validateAsync(req.body);
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                return next(err);
            }
            req.flash('success', 'User registered successfully!');
            next();
        })
    } catch(err) {
        console.log(err);
        if(err.code === 11000) {
            req.flash('error', 'A user with the given email is already registered');
        } else {
            req.flash('error', err.message);
        }
        res.redirect('/register');
    }
}, redirectToTargetURL)

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: true, 
    keepSessionInfo: true,
}), (req, res, next) => {
    req.flash('success', 'Logged in successfully!');
    next();
}, redirectToTargetURL)

router.get('/logout', (req, res) => {
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
})

module.exports = router;