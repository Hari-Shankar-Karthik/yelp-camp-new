const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
})

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
})