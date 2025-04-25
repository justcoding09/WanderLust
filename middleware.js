const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require('./utils/ExpressError');
const {listingSchema,reviewSchema}=require('./schema');

module.exports.isLoggedIn=(req,res,next)=>{
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

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner)){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
//VALIDATE FUNCTION
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errmsg=error.details.map((err)=>err.message).join(',');
            throw new ExpressError(400,errmsg);
        }
        else
        next();
};
//REVIEW SECTION
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }
        else
        next();
};

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author)){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listing/${id}`);
    }
    next();
};