const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp-new")
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(err => {
        console.log("Mongo Connection Error");
        console.log(err);
    });

// Middleware to parse the request body (for form submission)
app.use(express.urlencoded({ extended: true }));

// Set up EJS. 'views' directory contains all rendered views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up the public directory
app.use(express.static(path.join(__dirname, "public")));

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

// Define the home route
app.get("/", (req, res) => {
    res.render("home");
})