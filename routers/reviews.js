const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const  {reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listings=require('../models/listing');
const Review = require('../models/review');
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
      
      console.log(error);
      if(error){
        let msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
      }else{
        next();
      }
    }
//Reviews 
//Post route for creating a new review for a listing
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  console.log(req.params.id); 
  let listing=await Listings.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
   await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));




//delete route for deleting a review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports=router;