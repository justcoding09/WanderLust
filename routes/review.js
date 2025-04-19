const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {listingSchema,reviewSchema}=require('../schema');
const Review=require('../models/review');
const Listing=require('../models/listing');

const validateReview=(req,res,next)=>{
    console.log(req.body);
    let {error}=reviewSchema.validate(req.body);
        if(error){
            let errmsg=error.map((err)=>err.message).join(',');
            throw new ExpressError(400,errmsg);}
        else
        next(error);
};

//REVIEW SECTION
//POST REVIEW
router.post("/",validateReview,wrapAsync(async (req,res)=>{//
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!!!");
    res.redirect(`/listings/${id}`)
}));

//DELETE REVIEW
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;