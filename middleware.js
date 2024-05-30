const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectInfo = {
            method: req.method,
            targetURL: req.originalUrl,
        };
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.postLoginRedirect = (req, res) => {
    if(!req.session.redirectInfo || req.session.redirectInfo.method !== 'GET') {
        return res.redirect('/campgrounds');
    }
    const {targetURL} = req.session.redirectInfo;
    req.session.redirectInfo = null;
    res.redirect(targetURL);
}

module.exports.isCampgroundAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(!review) {
        req.flash('error', 'Review not found');
        return res.redirect('/campgrounds');
    }
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}