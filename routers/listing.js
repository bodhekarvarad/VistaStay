const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync');
const  {listingSchema,reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const{isLoggedIn,isOwner,validateListing}=require('../middleware');
const listingController=require('../controllers/listings');
// Get all listings
//index route
router.get("/", wrapAsync(listingController.index));

// NEW ROUTE
router.get("/new",isLoggedIn, listingController.newRoute);

// SHOW ROUTE
router.get("/:id", wrapAsync((listingController.showListing)   ));



//create route
router.post("/",isLoggedIn,validateListing, wrapAsync (listingController.createListing)
);


    

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,(listingController.editRoute)
   );
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
 
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)); 


module.exports=router;