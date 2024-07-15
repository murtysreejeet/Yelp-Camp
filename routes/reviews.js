const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require("../utensils/catchAsync");
const ExpressError = require("../utensils/ExpressError")



const campground = require("../models/campground");
const Review = require ("../models/review")

const{campgroundSchema,reviewSchema}= require('../schema')


const validateCamp = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg,400)
    }
    else {
     next();
    }
}

const validateReview = (req,res,next)=>{
const {error} = reviewSchema.validate(req.body);
if(error){
 const msg = error.details.map(el => el.message).join(',')
 throw new ExpressError(msg,400)
}
else{
 next();
}
}


router.post('/',validateReview, catchAsync(async(req,res)=>{
    const Campground = await campground.findById(req.params.id);
    const review = new Review (req.params.id);
    
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
   console.log(review);
   console.log(Campground);
   
    res.redirect(`/campgrounds/${Campground._id}`);
   
   
   }))

   module.exports = router;