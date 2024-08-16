const express = require ('express');
const router = express.Router();
const catchAsync = require("../utensils/catchAsync");
const campgrounds= require("../controllers/campgrounds")
const {isloggedIn,isAuthor,validateCamp} = require('../middleware');

 router.route('/')
 .get(catchAsync(campgrounds.index))
 .post(isloggedIn,validateCamp, catchAsync( campgrounds.createCampground));

 router.get("/new", isloggedIn ,campgrounds.renderNewForm);
 
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isloggedIn, isAuthor, validateCamp,catchAsync(campgrounds.updateCampground))
.delete(isloggedIn,isAuthor,catchAsync(campgrounds.delCampground))
  
 router.get("/:id/edit",isloggedIn,isAuthor, catchAsync(campgrounds.editCampground));

  module.exports= router

  /*const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;*/