const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require('method-override'); // for PUT and DELETE requests
const ejsMate = require('ejs-mate'); // ejs engine for layouts
const {campgroundSchema} = require('./schemas'); // for validating the request body

const AppError = require("./errors/AppError");
const wrapAsync = require("./errors/wrapAsync");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp-new")
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(err => {
        console.log("Mongo Connection Error");
        console.log(err);
    });

// Set up EJS. 'views' directory contains all rendered views
app.engine("ejs", ejsMate); // use ejsMate as the engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Middleware to parse the request body (for form submission)
app.use(express.urlencoded({ extended: true }));

// Set up the public directory
app.use(express.static(path.join(__dirname, "public")));

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.get("/", (req, res) => {
    res.send("Hello from Yelp Camp");
})

// display the index page (all campgrounds)
app.get("/campgrounds", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    if(!campgrounds) {
        throw new AppError("Unable to find campgrounds", 404);
    }
    res.render("campgrounds/index", {campgrounds});
}))

// display the form to create a new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

// Handle form submission to create a new campground
app.post("/campgrounds", wrapAsync(async (req, res) => {
    try {
        await campgroundSchema.validateAsync(req.body);
    } catch (err) {
        throw new AppError(err, 400);
    }
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// display a specific campground
app.get("/campgrounds/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        throw new AppError("Campground not found", 404);
    }
    res.render("campgrounds/show", {campground});
}))

// display the form to edit a specific campground
app.get("/campgrounds/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        throw new AppError("Campground not found", 404);
    }
    res.render("campgrounds/edit", {campground});
}))

// Handle form submission to edit a specific campground
app.put("/campgrounds/:id", wrapAsync(async (req, res) => {
    try {
        await campgroundSchema.validateAsync(req.body);
    } catch (err) {
        throw new AppError(err, 400);
    }
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Handle request to delete a specific campground
app.delete("/campgrounds/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if(!err.message) {
        err.message = 'Something went wrong';
    }
    res.status(status).render('error', {err});
})