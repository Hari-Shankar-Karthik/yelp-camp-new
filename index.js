const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp-new")
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(err => {
        console.log("Mongo Connection Error");
        console.log(err);
    });

// EJS setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'makethismoresecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 3600 * 24 * 7,
        maxAge: 1000 * 3600 * 24 * 7,
    }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Route handlers
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

// Error handling middleware
app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
    }
    if(!err.message) {
        err.message = 'Something went wrong';
    }
    res.status(err.status).render('error', {err});
})