const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const  {reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const Review = require('../models/review');
const {validateReview, isLoggedIn}=require('../middleware');
const ReviewController=require('../controllers/review');
//Reviews 
//Post route for creating a new review for a listing
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.CreateReview));




//delete route for deleting a review
router.delete("/:reviewId",isLoggedIn,wrapAsync(ReviewController.DestoryReview));


module.exports=router;