const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync');
const  {listingSchema,reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const{isLoggedIn,isOwner,validateListing}=require('../middleware');
const listingController=require('../controllers/listings');
// Get all listings

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
   validateListing, 
   wrapAsync (listingController.createListing)
);
// NEW ROUTE
router.get("/new",isLoggedIn, listingController.newRoute);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));









//edit route
router.get("/:id/edit",isLoggedIn,isOwner,(listingController.editRoute)
   );



module.exports=router;