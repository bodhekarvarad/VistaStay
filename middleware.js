const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");   
module.exports.isLoggedIn=(req,res,next)=>{
   
    if(!req.isAuthenticated()){
        //redirect to login page and flash an error message
        req.session.redirectUrl=req.originalUrl;
     req.flash("error","You must be logged in to create a listing");
     res.redirect('/login');
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
        if(!listing.owner.equals(req.user._id)){
            req.flash("error", "You are not owner");
            return res.redirect(`/listings/${id}`);
        }   
    next();
};

module.exports.validateListing=async(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
      
      console.log(error);
      if(error){
        let msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
      }else{
        next();
      }
    };
module.exports.validateReview = (req, res, next) => {
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

    module.exports.isReviewAuthor=async(req,res,next)=>{l
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currentUser._id)){
            req.flash("error", "You are not the authorof this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    };