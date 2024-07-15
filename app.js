const express = require("express");
const app = express();
const path = require("path");

const catchAsync = require("./utensils/catchAsync");
const ExpressError = require("./utensils/ExpressError")

const joi = require("joi");

const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const methodOveride = require("method-override");


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');



const { title } = require("process");
const { error } = require("console");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Yeah Mongosh Connected!");
  })
  .catch((e) => {
    console.log(e);
    console.log("Error While Connection!");
  });
app.engine('ejs',ejsMate)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname,('public'))))





app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get("/", (req, res) => {
  res.render("home");
});




app.all('*',(req,res,next)=>{
  next(new ExpressError("Page Not Found",404))
})

app.use((err,req,res,next)=>{
 const {statusCode = 500 }= err;
 if(!err.message) err.message = 'oh No,Something Went Wrong'
  res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
