const express=require('express');
const router=express.Router();
const User=require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');
const { saveRedirect } = require('../middleware');
const userController=require('../controllers/users');

router.get("/signup",userController.renderSignUp);

router.post("/signup",wrapAsync(userController.signUp));

router.get('/login',userController.loginForm);

router.post('/login',saveRedirect,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),userController.login);

router.get("/logout",userController.logout);

module.exports=router;