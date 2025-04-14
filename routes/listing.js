const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {listingSchema,reviewSchema}=require('../schema');
const Listing=require('../models/listing');

//VALIDATE FUNCTION
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errmsg=error.details.map((err)=>err.message).join(',');
            throw new ExpressError(400,result.error);
        }
        else
        next(error);
}

//HOME
router.get("/",async (req,res)=>{
    let listing=await Listing.find({});
    res.render("listings/index",{listing})
})

//CREATE
router.get("/new",(req,res)=>{
    res.render("listings/new");
})

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
        const list=new Listing(req.body.listing);
        // if(!req.body.listing)
        //     throw new ExpressError("Send valid data for Listing.");
        
        await list.save();
        req.flash("success","New Listing Created!!!");
        res.redirect("/listings"); 
}));

//READ
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("review");
    if(!listing)
        next(new ExpressError(403,"Id not found"));
    res.render("listings/show",{listing});
}));

//EDIT
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

router.patch("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!!");
    res.redirect("/listings");
}));

module.exports=router;