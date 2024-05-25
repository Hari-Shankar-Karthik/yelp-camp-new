const express = require('express');
const router = express.Router();

const Campground = require("../models/campground");

const AppError = require("../errors/AppError");
const wrapAsync = require("../errors/wrapAsync");

const {campgroundSchema} = require('../schemas'); // JOI schema for campgrounds



// display the index page (all campgrounds)
router.get("/", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    if(!campgrounds) {
        throw new AppError("Unable to find campgrounds", 404);
    }
    res.render("campgrounds/index", {campgrounds});
}))

// display the form to create a new campground
router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

// Handle form submission to create a new campground
router.post("/", wrapAsync(async (req, res) => {
    await campgroundSchema.validateAsync(req.body);
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// display a specific campground
router.get("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground) {
        throw new AppError("Campground not found", 404);
    }
    res.render("campgrounds/show", {campground});
}))

// display the form to edit a specific campground
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        throw new AppError("Campground not found", 404);
    }
    res.render("campgrounds/edit", {campground});
}))

// Handle form submission to edit a specific campground
router.put("/:id", wrapAsync(async (req, res) => {
    await campgroundSchema.validateAsync(req.body);
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Handle request to delete a specific campground
router.delete("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

module.exports = router;