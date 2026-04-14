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