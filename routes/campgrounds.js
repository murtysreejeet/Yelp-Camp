const express = require ('express');
const router = express.Router();
const catchAsync = require("../utensils/catchAsync");
const ExpressError = require("../utensils/ExpressError")
const methodOveride = require("method-override");
const campground = require("../models/campground");
const Review = require ("../models/review");
const { campgroundSchema } = require('../schema');


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
  
 router.get("/new", (req, res) => {
    res.render("./campgrounds/new");
  });
  
 router.post("/",validateCamp, catchAsync( async (req, res,next) => {
    // if(!req.body.Campground)throw new ExpressError("invalid data", 69)
      const Campground = new campground(req.body.campground);
    await Campground.save();
    res.redirect(`/campgrounds/${Campground._id}`);
  }));
  
 router.get("/:id",catchAsync( async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("./campgrounds/show", { Campground });
  }));
  
 router.get("/:id/edit", catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("./campgrounds/edit", { Campground });
  }));
 router.put("/:id/", validateCamp,catchAsync(async (req, res) => {
    const {id} = req.params;
    const Campground = await campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${Campground._id}`);
  }));
  
  
 router.delete("/:id",catchAsync(async (req,res)=>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }));

  module.exports= router;