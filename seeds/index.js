const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
require('dotenv').config();

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
      author: "66a46fbc177d68cd4167f660",
      location: `${cities[randomnum].city},${cities[randomnum].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab eos illum odio.",
      price,
      geometry:{
        type:"Point",
        coordinates:[-133.1331,47.0202]
      },
      images: [{
        url: 'https://res.cloudinary.com/drapyptrd/image/upload/v1724731602/Yelp_Camp/lwtvgdpmsz2fmidok71i.png',
        filename: 'Yelp_Camp/lwtvgdpmsz2fmidok71i',

      },
      {
        url: 'https://res.cloudinary.com/drapyptrd/image/upload/v1724731603/Yelp_Camp/vqr3nyo4jdad4ipusgds.png',
        filename: 'Yelp_Camp/vqr3nyo4jdad4ipusgds',

      },
      {
        url: 'https://res.cloudinary.com/drapyptrd/image/upload/v1724731605/Yelp_Camp/ziwbntxo7lcah1ojcwcj.png',
        filename: 'Yelp_Camp/ziwbntxo7lcah1ojcwcj',

      }]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
