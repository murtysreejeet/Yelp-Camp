const{campgroundSchema,reviewSchema}= require('./schema')
const ExpressError = require('./utensils/ExpressError');
const campground = require('./models/campground');
const review = require('./models/review');
 
 
 
 
 module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You Must Be Signed IN');
        return res.redirect('/login');
      }
      next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCamp = (req,res,next) =>{
    const {error} =campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg,400)
    }
    else {
     next();
    }
  }
  
module.exports. isAuthor = async (req,res,next) => {
    const {id}= req.params;
    const Campground = await campground.findById(id);
    if(!Campground.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that!');
      return res.redirect (`/campgrounds/${id}`);
    }
    next();
  
  
  }

  module.exports. isReviewAuthor = async (req,res,next) => {
    const { id, reviewId}= req.params;
    const Review = await review.findById(reviewId);
    if(!Review.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that!');
      return res.redirect (`/campgrounds/${id}`);
    }
    next();
  
  
  }



  module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg,400)
    }
    else{
     next();
    }
    }
    

   