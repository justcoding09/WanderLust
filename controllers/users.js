module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup");
};

module.exports.signUp=(async(req,res)=>{
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
});

module.exports.loginForm=(req,res)=>{
    res.render("users/login");
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome Back to WanderLust!!!You are logged in.");
    let redirect=res.locals.redirecturl || '/listings';
    res.redirect(redirect);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)}
        else{
            req.flash("success","You are logged out!");
        }
    });
    res.redirect('/listings');
};