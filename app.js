const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const reviewsRouter=require('./routes/review');
const listingsRouter=require('./routes/listing');
const userRouter=require('./routes/user');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const sessionOptions={
    secret:"grace",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs",ejsMate);

main().then(()=>console.log(`WANDERLUST`)).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.listen(8085,(req,res)=>{
    console.log(`Server started at 8085`);
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demo",async (req,res)=>{
//     let fakeUser=new User({
//         email:"ahmed@",
//         username:"Rafia",
//     });
//     let registerdUser=await User.register(fakeUser,"ahmedlove");
//     res.send(registerdUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

//ERROR HANDLERS
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found !!!"));
// });
app.use((err,req,res,next)=>{
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs",{message});
});