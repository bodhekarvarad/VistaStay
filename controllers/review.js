
const Listing=require('../models/listing');
const Review = require('../models/review');

module.exports.CreateReview=async(req,res)=>{
  
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
};

module.exports.DestoryReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    // await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Successfully deleted the review"); 
   res.redirect(`/listings/${id}`);
};