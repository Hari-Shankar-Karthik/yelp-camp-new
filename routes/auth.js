const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const wrapAsync = require("../errors/wrapAsync");

const { userSchema } = require("../schemas");

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        await userSchema.validateAsync(req.body);
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'User registered successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        console.log(err);
        if(err.code === 11000) {
            req.flash('error', 'A user with the given email is already registered');
        } else {
            req.flash('error', err.message);
        }
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), (req, res) => {
    req.flash('success', 'Logged in successfully!');
    res.redirect('/campgrounds');
})

module.exports = router;