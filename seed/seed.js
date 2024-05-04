const mongoose = require("mongoose");
const Campground = require("../models/campground");
const seedHelper = require("./seedHelper");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp-new")
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(err => {
        console.log("Mongo Connection Error");
        console.log(err);
    });

const seedDB = async sampleSize => {
    // delete all existing campgrounds
    await Campground.deleteMany({});
    console.log("Existing campgrounds deleted");
    // create new campgrounds
    for(let i = 0; i < sampleSize; i++) {
        const camp = new Campground({
            title: await seedHelper.getName(),
            price: seedHelper.getPrice(),
            description: await seedHelper.getDescription(),
            location: seedHelper.getLocation(),
        });
        await camp.validate();
        await camp.save();
    }
    console.log("New campgrounds created");
}

seedDB(50)
    .then(() => {
        console.log("Database seeded successfully");
        mongoose.connection.close();
        console.log("Mongo Connection Closed");
    })
    .catch(err => {
        console.log("Error seeding database");
        console.log(err);
    });