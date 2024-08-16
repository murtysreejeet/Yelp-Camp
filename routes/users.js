const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utensils/catchAsync');
const users = require("../controllers/users");
// const { storeReturnTo } = require('../middleware');




router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;