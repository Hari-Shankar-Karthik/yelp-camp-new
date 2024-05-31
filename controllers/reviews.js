const Campground = require('../models/campground');
const Review = require('../models/review');
const AppError = require('../errors/AppError');
const wrapAsync = require('../errors/wrapAsync');
const {reviewSchema} = require('../schemas'); // JOI schema for reviews

module.exports.create = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        throw new AppError('Campground not found', 404);
    }
    await reviewSchema.validateAsync(req.body);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review created successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.delete = wrapAsync(async (req, res) => {
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/campgrounds/${id}`);
})