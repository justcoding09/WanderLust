const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const {listingSchema,reviewSchema}=require('./schema');
const Review=require('./models/review');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.engine("ejs",ejsMate);

main().then(()=>console.log(`WANDERLUST`)).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.listen(8085,(req,res)=>{
    console.log(`Sever started at 8085`);
})

// app.get("/",async (req,res)=>{
//     let sample=new Listing({
//         title:"H",
//         description:"BEST SPOT",
//         price:4500,
//         location:"Paris",
//         country:"France"
//     });
//     await sample.save();
//     res.send("d");
// })

//VALIDATE FUNCTION
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    let errmsg=error.details.map((err)=>err.message).join(',');
        if(error)
            throw new ExpressError(400,result.error);
        else
        next(error);
}

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    let errmsg=error.details.map((err)=>err.message).join(',');
        if(error)
            throw new ExpressError(400,result.error);
        else
        next(error);
}
//HOME
app.get("/listings",async (req,res)=>{
    let listing=await Listing.find({});
    res.render("listings/index",{listing})
})

//CREATE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
        const list=new Listing(req.body.listing);
        // if(!req.body.listing)
        //     throw new ExpressError("Send valid data for Listing.");
        await list.save();
        res.redirect("/listings"); 
}));

//READ
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("review");
    if(!listing)
        next(new ExpressError(403,"Id not found"));
    res.render("listings/show",{listing});
}));

//EDIT
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

app.patch("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//REVIEW SECTION
//POST REVIEW
app.post("/listings/:id/reviews",wrapAsync(async (req,res)=>{//validateReview,
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`)
}));

//DELETE REVIEW
app.delete("/listings/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

//ERROR HANDLERS
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found !!!"));
// });
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("error.ejs",{message});
})
