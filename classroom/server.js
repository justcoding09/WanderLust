const express=require('express');
const app=express();
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');

app.use(session({secret:"mysecret",resave:false,saveUninitialized:true}));
app.use(flash());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.listen(8085,(req,res)=>{
    console.log(`port started`);
});

app.use((req,res,next)=>{
    res.locals.succ=req.flash("success");//succ naam se access ho jaega ye ab
    res.locals.fail=req.flash("failure");
    next();
});

app.get("/test",(req,res)=>{
    console.log(`test successful`);
    res.send(`hit`);
});

app.get("/register",(req,res)=>{
    let {name}=req.query;
    req.session.name=name;
    if(name==='anonymous')
        req.flash("failure","could not register");
    else
        req.flash("success","registered successfully");
    
    res.redirect(`/hello`);
})

app.get("/hello",(req,res)=>{
    res.render("page",{name:req.session.name});
})