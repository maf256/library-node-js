const Joi = require("joi");

// Schema for validating Genre data
const genreSchema = Joi.object({
  id: Joi.number().integer().min(-1).optional(),
  name: Joi.string().min(2).max(255).required(), // Genre name must be between 2 and 255 characters
});

// Middleware to validate request data
const validateGenre = (schema) => (req, res, next) => {
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
  validateGenre,
  genreSchema,
};
