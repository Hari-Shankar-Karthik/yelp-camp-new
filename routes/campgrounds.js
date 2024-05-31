const express = require('express');
const router = express.Router();
const {isLoggedIn, isCampgroundAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', campgrounds.index);
router.get('/new', isLoggedIn, campgrounds.newForm);
router.post('/', isLoggedIn, campgrounds.create);
router.get('/:id', campgrounds.show);
router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, campgrounds.editForm);
router.put('/:id', isLoggedIn, isCampgroundAuthor, campgrounds.update);
router.delete('/:id', isLoggedIn, isCampgroundAuthor, campgrounds.delete);

module.exports = router;