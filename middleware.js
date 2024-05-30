module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectInfo = {
            method: req.method,
            targetURL: req.originalUrl,
        };
        console.log(`redirecting to login page. target url: ${req.originalUrl}`);
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

module.exports.isAuthor = async (req, res, next) => {
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