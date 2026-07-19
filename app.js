if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
 }



const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const  {listingSchema,reviewSchema}  = require('./schema');
const listingRoutes=require('./routers/listing');
const reviewRoutes=require('./routers/reviews');
const session=require('express-session');
const flash=require('connect-flash');
const Listing = require('./models/listing');
const Review = require('./models/review');
const router= express.Router({mergeParams:true});
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const userRoutes=require('./routers/user');

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
const sessionOptions={  
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());                                                           


// app.get('/',(req,res)=>{
//     res.send('I am route');
// });
//database connection
const MONGO_URI=process.env.ATLASDB_URL;
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
app.use(express.json());
app.use(methodOverride("_method"));


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
// app.get('/demouser',async(req,res)=>{
//   let fakerUser=new User({
//     username:"demoUser",
//     email:"student@gmail.com"
//   });
// let registeredUser=  await User.register(fakerUser,"password");
// res.send(registeredUser);


// }); 
app.use('/',userRoutes);
   app.use('/listings',listingRoutes);
   app.use('/listings/:id/reviews',reviewRoutes);
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
