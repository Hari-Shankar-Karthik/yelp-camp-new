const express = require('express');
const router = express.Router({mergeParams: true});
const {isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, reviews.create);
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, reviews.delete);

module.exports = router;