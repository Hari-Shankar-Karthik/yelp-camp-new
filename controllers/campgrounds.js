const Campground = require('../models/campground');
const AppError = require('../errors/AppError');
const wrapAsync = require('../errors/wrapAsync');
const {campgroundSchema} = require('../schemas');

module.exports.index = wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    if(!campgrounds) {
        throw new AppError('Unable to find campgrounds', 404);
    }
    res.render('campgrounds/index', {campgrounds});
})

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.create = wrapAsync(async (req, res) => {
    await campgroundSchema.validateAsync(req.body);
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.show = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('author').populate({
        path: 'reviews',
        populate: 'author',
    });
    if(!campground) {
        throw new AppError('Campground not found', 404);
    }
    res.render('campgrounds/show', {campground});
})

module.exports.editForm = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
})

module.exports.update = wrapAsync(async (req, res) => {
    await campgroundSchema.validateAsync(req.body);
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {runValidators: true});
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
})

module.exports.delete = wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect('/campgrounds');
})