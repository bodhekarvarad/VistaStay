const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {savedRedirectUrl} = require('../middleware');
const usersController = require('../controllers/users');
const user = require('../models/user');

router.get('/signup',(usersController.userSignup));
router.post('/signup', wrapAsync((usersController.signup)));

router.get('/login', usersController.userlogin);

router.post('/login',savedRedirectUrl,passport.authenticate('local', 
        {failureRedirect: '/login', failureFlash: 
            true}),usersController.login );


router.get('/logout',usersController.logout);
module.exports=router;