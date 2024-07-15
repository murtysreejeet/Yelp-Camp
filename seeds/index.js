const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Yeah Mongosh Connected!");
  })
  .catch((e) => {
    console.log(e);
    console.log("Error While Connection!");
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const randomnum = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1000) + 10;
    const camp = new campground({
      location: `${cities[randomnum].city},${cities[randomnum].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: String,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab eos illum odio.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
