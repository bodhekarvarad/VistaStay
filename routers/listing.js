const express = require('express');
const router = express.Router();
const wrapAsync=require('../utils/wrapAsync');
const  {listingSchema,reviewSchema}  = require('../schema');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const{isLoggedIn,isOwner,validateListing}=require('../middleware');

// Get all listings
//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// NEW ROUTE
router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new");
});

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(req.params.id)
    .populate({
        path:"reviews", 
        populate:{ path: "author" },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error","Cannot find that listing");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
   
}));



//create route
router.post("/",isLoggedIn,validateListing, wrapAsync (async(req, res,next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Successfully created a new listing");
    res.redirect("/listings");
})
);


    

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing");
       return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
 const { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }

    

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Successfully updated the listing");

    res.redirect(`/listings/${id}`);
}));
 
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}=req.params;
let deletedlisting=await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
req.flash("success","Successfully deleted the listing");
res.redirect("/listings");
})); 


module.exports=router;