const express = require('express');
const router = express.Router();
const {isLoggedIn, isCampgroundAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, campgrounds.create)

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, isCampgroundAuthor, campgrounds.update)
    .delete(isLoggedIn, isCampgroundAuthor, campgrounds.delete)

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, campgrounds.editForm)


module.exports = router;