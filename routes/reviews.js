const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Review = require("../models/review");

const AppError = require("../errors/AppError");
const wrapAsync = require("../errors/wrapAsync");

const {reviewSchema} = require('../schemas'); // JOI schema for reviews


// handle form submission to leave a review
router.post('/', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        throw new AppError("Campground not found", 404);
    }
    await reviewSchema.validateAsync(req.body);
    const newReview = new Review(req.body);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// handle form submission to delete a review
router.delete('/:reviewID', wrapAsync(async (req, res) => {
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;