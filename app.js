const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const reviews=require('./routes/listing');
const listings=require('./routes/listing');
const session=require('express-session');
const flash=require('connect-flash');

const sessionOptions={
    secret:"grace",
    resave:false,
    saveUninitialised:true,
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

app.engine("ejs",ejsMate);

main().then(()=>console.log(`WANDERLUST`)).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.listen(8085,(req,res)=>{
    console.log(`Sever started at 8085`);
});

app.use((req,res,next)=>{
    res.locals.succ=req.flash("success");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);

//ERROR HANDLERS
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found !!!"));
// });
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("error.ejs",{message});
});

