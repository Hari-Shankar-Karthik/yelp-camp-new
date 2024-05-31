const express = require('express');
const router = express.Router();
const passport = require('passport');
const {postLoginRedirect} = require('../middleware');
const auth = require('../controllers/auth');

router.route('/register')
    .get(auth.registerForm)
    .post(auth.register, postLoginRedirect)

router.route('/login')
    .get(auth.loginForm)
    .post(passport.authenticate('local', {failureRedirect: '/login', failureFlash: true, keepSessionInfo: true}), auth.login, postLoginRedirect)

router.get('/logout', auth.logout)

module.exports = router;