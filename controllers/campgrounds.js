const Campground = require('../models/campground');
const AppError = require('../errors/AppError');
const wrapAsync = require('../errors/wrapAsync');
const { campgroundSchema } = require('../schemas');
const { cloudinary } = require('../cloudinary');

module.exports.index = wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    if (!campgrounds) {
        throw new AppError('Unable to find campgrounds', 404);
    }
    res.render('campgrounds/index', { campgrounds });
})

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.create = wrapAsync(async (req, res) => {
    // await campgroundSchema.validateAsync(req.body);
    const campground = new Campground(req.body);
    for (const file of req.files) {
        campground.images.push({
            path: file.path,
            filename: file.filename,
        })
    }
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.show = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author').populate({
        path: 'reviews',
        populate: 'author',
    });
    if (!campground) {
        throw new AppError('Campground not found', 404);
    }
    res.render('campgrounds/show', { campground });
})

module.exports.editForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
})

module.exports.update = wrapAsync(async (req, res) => {
    // await campgroundSchema.validateAsync(req.body);
    const { id } = req.params;
    const { body } = req;
    // console.log(body);
    const newImages = req.files.map(file => ({ path: file.path, filename: file.filename }));
    const updates = {
        $push: { images: { $each: newImages } },
        ...body,
    };
    await Campground.findByIdAndUpdate(id, updates, { runValidators: true });
    if (body.toDelete && body.toDelete.length) {
        await Campground.findByIdAndUpdate(id, {
            $pull: { images: { filename: { $in: body.toDelete } } },
        }, { runValidators: true });
        for (const filename of body.toDelete) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
})

module.exports.delete = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect('/campgrounds');
})