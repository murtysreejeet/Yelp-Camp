const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utensils/catchAsync");
const reviews = require("../controllers/reviews")
const {validateReview,isloggedIn,isReviewAuthor} = require('../middleware');

router.post('/',isloggedIn, validateReview, catchAsync(reviews.createReview))

   router.delete('/:reviewId',isloggedIn,isReviewAuthor, catchAsync(reviews.delReview))
   
   module.exports = router;