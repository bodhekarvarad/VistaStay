const express=require('express');
const app=express();
const port=3000;
const Listings=require('./models/listing');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require("method-override");
const Listing = require('./models/listing');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const  listingSchema  = require('./schema');
const Review=require('./models/review');


app.listen(port,()=>{console.log(`Server running on port ${port}`);});

app.get('/',(req,res)=>{
    res.send('I am route');
});
//database connection
const MONGO_URI='mongodb://127.0.0.1:27017/wanderlustdb';
main().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});
async function main() {
    await mongoose.connect(MONGO_URI);
    
}
// app.get("/testlistings",async(req,res)=>{
//    // res.send("Listing route is working fine");
//    let sampleListings=new Listings({
//     title:"MY New Villa",
//     description:"A beautiful villa located in the heart of the city",
//     price:500000,
//     location:"New York",   
//     country:"USA"
//     });


// await sampleListings.save();
//   console.log("Sample listing saved successfully");
//     res.send("Sample listing saved successfully");
// });
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index", { allListings });
}));

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validateAsync(req.body);
      
      console.log(error);
      if(error){
        let msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
      }else{
        next();
      }
    }

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});


// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show", { listing });
}));


//create route
app.post("/listings",validateListing, wrapAsync (async(req, res,next) => {
//   try {
      let result=listingSchema.validateAsync(req.body);
      
      console.log(result);
      if(result.error){
        throw new ExpressError(400,result.error);
      }
      const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");

//   } catch (err) {
//     next(err);
//          //  redirect like lecture
//   }
})
);
    

//edit route
app.get("/listings/:id/edit", 
    wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));
//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
let {id}=req.params;
 console.log(req.body.listing); 
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/listings");
}));
 
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
let {id}=req.params;
let deletedlisting=await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect("/listings");
}));    

//Reviews 
//Post route for creating a new review for a listing
app.post("/listings/:id/reviews",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
   await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));


app.all("*",(req,res,next)=>{ 
    next(new ExpressError(404,"Page Not Found"));
 });

//generic error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode)
        .render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
