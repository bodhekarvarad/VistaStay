const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const  {reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const Review = require('../models/review');
const {validateReview, isLoggedIn}=require('../middleware');
//Reviews 
//Post route for creating a new review for a listing
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
  
  let listing=await Listing.findById(req.params.id);
  if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }  
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  console.log(newReview); 
  listing.reviews.push(newReview);
   await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a new review");
    res.redirect(`/listings/${listing._id}`);
}));




//delete route for deleting a review
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Successfully deleted the review"); 
   res.redirect(`/listings/${id}`);
}));


module.exports=router;