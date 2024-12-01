const Joi = require('joi');

// Schema for validating book data
const bookSchema = Joi.object({
  id: Joi.number().integer().min(1).optional(),
  title: Joi.string().min(2).max(255).required(),
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  copies_available: Joi.number().integer().min(0).required(),
  total_copies: Joi.number().integer().min(1).required(),
  authorIds: Joi.array().items(Joi.number().integer().min(1)).required(),
  genreIds: Joi.array().items(Joi.number().integer().min(1)).required()
});

// Middleware to validate request data
const validateBook = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateBook,
  bookSchema,
};
