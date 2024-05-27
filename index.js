const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");

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
});
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route handlers
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', authRoutes);

// // test route to check if user model is working
// app.get('/make-user', wrapAsync(async (req, res) => {
//     const {username, email} = req.query;
//     const user = new User({username, email});
//     const registeredUser = await User.register(user, 'superrandompassword')
//     res.send(registeredUser);
// }))

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