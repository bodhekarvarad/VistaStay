const Listing = require("../models/listing");
const mbxTilesets=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken: mapBoxToken });
// INDEX
module.exports.index = async (req, res) => {
const allListings = await Listing.find({});
return res.render("listings/index", { allListings });
};

// NEW
module.exports.newRoute = (req, res) => {
return res.render("listings/new");
};

// SHOW
module.exports.showListing = async (req, res) => {
const { id } = req.params;


const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" },
    })
    .populate("owner");

if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
}

return res.render("listings/show", { listing });


};

// CREATE
module.exports.createListing = async (req, res) => {
 let response=  await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
}).send();

if (!req.file) {
    req.flash("error", "Image is required");
    return res.redirect("/listings/new");
}

const url = req.file.path;
const filename = req.file.filename;

const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
newListing.image = { url, filename };
newListing.geomatry=response.body.features[0].geometry;
let savedListing = await newListing.save();
console.log(savedListing);
req.flash("success", "Successfully created a new listing");
return res.redirect("/listings");

};

// EDIT
module.exports.editRoute = async (req, res) => {
const { id } = req.params;

const listing = await Listing.findById(id);

if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
}

let originalImageURL = listing.image.url;
originalImageURL = originalImageURL.replace("/upload","/upload/w_250");
return res.render("listings/edit", { listing, originalImageURL });

};

// UPDATE
module.exports.updateListing = async (req, res) => {
const { id } = req.params;
let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });



if (!req.body.listing) {
    req.flash("error", "Invalid listing data");
    return res.redirect("/listings");
}

if(typeof req.file !== "undefined"){
    let  url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
}
req.flash("success", "Successfully updated the listing");
return res.redirect(`/listings/${id}`);


};

// DELETE
module.exports.deleteListing = async (req, res) => {
const { id } = req.params;


await Listing.findByIdAndDelete(id);

req.flash("success", "Successfully deleted the listing");
return res.redirect("/listings");

};
