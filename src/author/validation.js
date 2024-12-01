const Joi = require('joi');

// Schema for adding/updating an author
const authorSchema = Joi.object({
  id: Joi.number().integer().min(1).optional(),
  name: Joi.string().min(2).max(100).required(),
  biography: Joi.string().max(1000).required(),
  birthday: Joi.date().iso().required()
});

// Middleware to validate data
const validateAuthor = (schema) => (req, res, next) => {
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
  validateAuthor,
  authorSchema,
};
