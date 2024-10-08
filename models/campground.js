const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { required } = require('joi');
const { coordinates } = require('@maptiler/client');

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})


const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,

    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
          }
    },
    coordinates: {
        type: [Number],
        required: true
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);

