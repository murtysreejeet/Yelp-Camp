const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        require:true,
        unique:true
    }
});

UserSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User',UserSchema)