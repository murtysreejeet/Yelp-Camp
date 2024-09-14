const express = require ('express');
const router = express.Router();
const catchAsync = require("../utensils/catchAsync");
const campgrounds= require("../controllers/campgrounds")
const {isloggedIn,isAuthor,validateCamp} = require('../middleware');
const multer = require('multer');
const{storage}= require('../cloudinary');
const upload = multer({storage});

 router.route('/')
 .get(catchAsync(campgrounds.index))
 .post(isloggedIn, upload.array('image') ,validateCamp,catchAsync( campgrounds.createCampground));

 router.get("/new", isloggedIn ,campgrounds.renderNewForm);
 
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isloggedIn, isAuthor,upload.array('image') , validateCamp,catchAsync(campgrounds.updateCampground))
.delete(isloggedIn,isAuthor,catchAsync(campgrounds.delCampground))
  
 router.get("/:id/edit",isloggedIn,isAuthor, catchAsync(campgrounds.editCampground));

  module.exports= router

 