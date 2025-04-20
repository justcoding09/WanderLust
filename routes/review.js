const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const Review=require('../models/review');
const Listing=require('../models/listing');
const {validateReview,isLoggedIn,isAuthor}=require('../middleware');
const reviewController=require('../controllers/review');

//POST REVIEW
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.create));

//DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.delete));

module.exports=router;