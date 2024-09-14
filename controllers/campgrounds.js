const campground = require("../models/campground");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const {cloudinary} = require('../cloudinary');




module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("./campgrounds/index", { campgrounds });
}


module.exports.renderNewForm = (req, res) => {
  res.render("./campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location)
  
 
  const Campground = new campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;
  Campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  Campground.author = req.user._id;
  await Campground.save();
  console.log(Campground);
  req.flash('success', 'Successfully made a new Campground');
  res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.showCampground = async (req, res) => {
  const Campground = await campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!Campground) {
    req.flash('error', "Cannot find Campground!");
    return res.redirect('/campgrounds')
  }
  res.render("./campgrounds/show", { Campground });
}
module.exports.editCampground = async (req, res) => {
  const Campground = await campground.findById(req.params.id);
  if (!Campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('./campgrounds');
  }
  res.render("./campgrounds/edit", { Campground });
}
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const Campground = await campground.findByIdAndUpdate(id, { ...req.body.campground })
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location)
  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  Campground.images.push(...imgs);
  await Campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
   await  Campground.updateOne({ $pull:{images:{filename:{$in:req.body.deleteImages}}}})
   console.log(Campground);
  }

  req.flash('success', 'Successfully made a update Campground');
  res.redirect(`/campgrounds/${Campground._id}`);
}
module.exports.delCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}

