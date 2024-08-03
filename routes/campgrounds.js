const express = require ('express');
const router = express.Router();
const catchAsync = require("../utensils/catchAsync");
const ExpressError = require("../utensils/ExpressError")
const methodOveride = require("method-override");
const campground = require("../models/campground");
const Review = require ("../models/review");
const { campgroundSchema } = require('../schema');
const {isloggedIn } = require('../middleware');


const validateCamp = (req,res,next) =>{
  const {error} =campgroundSchema.validate(req.body);
  if(error){
   const msg = error.details.map(el => el.message).join(',')
   throw new ExpressError(msg,400)
  }
  else {
   next();
  }
}


router.get("/", async (req, res) => {
    const campgrounds = await campground.find({});
    res.render("./campgrounds/index", { campgrounds });
  });
  
 router.get("/new", isloggedIn ,(req, res) => {
    res.render("./campgrounds/new");
  });
  
 router.post("/",isloggedIn,validateCamp, catchAsync( async (req, res,next) => {
    // if(!req.body.Campground)throw new ExpressError("invalid data", 400)
      const Campground = new campground(req.body.campground);
    Campground.author = req.user._id;
    await Campground.save();
    req.flash('success','Successfully made a new Campground');
    res.redirect(`/campgrounds/${Campground._id}`);
  }));
  
 router.get("/:id",isloggedIn,catchAsync( async (req, res) => {
    const Campground = await campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(Campground);
    if(!Campground){
      req.flash('error',"Cannot find Campground!");
      return res.redirect('/campgrounds')
    }
    res.render("./campgrounds/show", { Campground });
  }));
  
 router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
 const {id, reviewId} = req.params;
 await campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
 await Review.findByIdAndDelete(reviewId);
 res.redirect(`/campgrounds/${id}`);
}))


 router.get("/:id/edit", catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("./campgrounds/edit", { Campground });
  }));
 router.put("/:id/",isloggedIn, validateCamp,catchAsync(async (req, res) => {
    const {id} = req.params;
    console.log(id);
    const Campground = await campground.findById(id);
    if(!Campground.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that!');
    return  res.redirect(`/campgrounds/${campground._id}`)
    }
    const Camp = await campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully made a update Campground');
    res.redirect(`/campgrounds/${Campground._id}`);
  }));
  
  
 router.delete("/:id",catchAsync(async (req,res)=>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }));

  
  module.exports= router
