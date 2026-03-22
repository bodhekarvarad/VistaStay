const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const  {reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const Review = require('../models/review');
const validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Invalid review data");
    }

    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};
//Reviews 
//Post route for creating a new review for a listing
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  
  let listing=await Listing.findById(req.params.id);
  if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }  
  let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
   await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a new review");
    res.redirect(`/listings/${listing._id}`);
}));




//delete route for deleting a review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Successfully deleted the review"); 
   res.redirect(`/listings/${id}`);
}));


module.exports=router;