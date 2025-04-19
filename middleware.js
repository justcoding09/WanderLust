module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirect=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirectUrl=req.session.redirecturl;
    }
    next();
};