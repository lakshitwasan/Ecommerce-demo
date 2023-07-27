const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { registerForm, registerNewUser, loginForm, loginUser,logoutUser } = require('../controllers/auth');




router.route('/register')
    .get(registerForm)
    .post(registerNewUser)



router.route('/login')
    .get(loginForm)
    .post(passport.authenticate('local', { 
            failureRedirect: '/login',
            failureFlash: true
    }), loginUser);
        
    

router.get('/logout', logoutUser);

module.exports = router;