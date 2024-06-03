const express = require('express');
const router = express.Router();
const { isLoggedIn, isCampgroundAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('images'), campgrounds.create)

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, isCampgroundAuthor, upload.array('images'), campgrounds.update)
    .delete(isLoggedIn, isCampgroundAuthor, campgrounds.delete)

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, campgrounds.editForm)


module.exports = router;