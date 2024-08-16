const campground = require("../models/campground");



module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render("./campgrounds/index", { campgrounds });
  }     


  module.exports.renderNewForm=(req, res) => {
    res.render("./campgrounds/new");
  };

  module.exports.createCampground = async (req, res,next) => {
    // if(!req.body.Campground)throw new ExpressError("invalid data", 400)
      const Campground = new campground(req.body.campground);
    Campground.author = req.user._id;
    await Campground.save();
    req.flash('success','Successfully made a new Campground');
    res.redirect(`/campgrounds/${Campground._id}`);
  }

  module.exports.showCampground = async (req, res) => {
    const Campground = await campground.findById(req.params.id).populate({
      path:'reviews',
      populate:{
        path:'author'
      }
    }).populate('author');
    if(!Campground){
      req.flash('error',"Cannot find Campground!");
      return res.redirect('/campgrounds')
    }
    res.render("./campgrounds/show", { Campground });
  }
  module.exports.editCampground = async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    if(!Campground){
      req.flash('error','Cannot find that campground');
      return res.redirect('./campgrounds');
    }
    res.render("./campgrounds/edit", { Campground });
  }
  module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const Campground = await campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully made a update Campground');
    res.redirect(`/campgrounds/${Campground._id}`);
  }
  module.exports.delCampground = async (req,res)=>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }

