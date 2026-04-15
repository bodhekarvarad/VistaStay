const Listing = require("../models/listing");



module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.newRoute=(req, res) => {
    
    res.render("listings/new");
};

module.exports.showListing=async (req, res) => {
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
   
};

module.exports.createListing=async(req, res,next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Successfully created a new listing");
    res.redirect("/listings");
};

module.exports.editRoute= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing");
       return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
};

module.exports.updateListing=async(req,res)=>{
 const { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }

    

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Successfully updated the listing");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
let {id}=req.params;
let deletedlisting=await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
req.flash("success","Successfully deleted the listing");
res.redirect("/listings");
};