const User = require('../models/user');


module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.register = async(req ,res,next)=>{
    try{ 
        const { email, username, password } = req.body;
      const user = new User({ username , email});
      const registerUser = await User.register(user,password);
     req.login(registerUser,err =>{
       if(err) return next(err);
       req.flash('success','Welcome to YelpCamp')
      res.redirect('/campgrounds');
     })
      
   } catch (e){
       req.flash('error',e.message);
       res.redirect('register');
   }
   }

   module.exports.renderLogin = (req, res) => {
        res.render('users/login');
    }

    module.exports.login = (req, res) => {
          req.flash('success', 'welcome back!');
          const redirectUrl = req.session.returnTo || '/campgrounds';
          delete req.session.returnTo;
          res.redirect(redirectUrl);
      }




