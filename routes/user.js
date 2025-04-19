const express=require('express');
const router=express.Router();
const User=require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');
const { saveRedirect } = require('../middleware');

router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);}
            else{
                req.flash("success","Welcome to WanderLust!");
                res.redirect("/listings");
            }
        })   
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}));

router.get('/login',(req,res)=>{
    res.render("users/login");
});

router.post('/login',saveRedirect,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),(req,res)=>{
    req.flash("success","Welcome Back to WanderLust!!!You are logged in.");
    let redirect=res.locals.redirecturl || '/listings';
    res.redirect(redirect);
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){next(err)}
        else{
            req.flash("success","You are logged out!");
        }
    })
})

module.exports=router;