const express = require('express');
const router = express.Router();
const passport = require('passport');
const {postLoginRedirect} = require('../middleware');
const auth = require('../controllers/auth');

router.get('/register', auth.registerForm);
router.post('/register', auth.register, postLoginRedirect);
router.get('/login', auth.loginForm);
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true, keepSessionInfo: true}), auth.login, postLoginRedirect);
router.get('/logout', auth.logout);

module.exports = router;