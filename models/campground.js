const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');

const imageSchema = new Schema ({
    path: String,
    filename: String,
})

imageSchema.virtual('thumbnail').get(function() {
    return this.path.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
});

campgroundSchema.post('findOneAndDelete', async campground => {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;