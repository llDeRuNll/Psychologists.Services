import Joi from 'joi';

export const createPsychologistSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}',
  }),
  avatar_url: Joi.string().uri().optional().allow(''),
  experience: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Experience cannot be empty',
    'string.min': 'Experience should have a minimum length of {#limit}',
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least {#limit}',
    'number.max': 'Rating cannot exceed {#limit}',
  }),
  price_per_hour: Joi.number().min(0).required().messages({
    'number.base': 'Price per hour must be a number',
    'number.min': 'Price per hour cannot be negative',
  }),
  license: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'License cannot be empty',
    'string.min': 'License should have a minimum length of {#limit}',
  }),
  specialization: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Specialization cannot be empty',
    'string.min': 'Specialization should have a minimum length of {#limit}',
  }),
  initial_consultation: Joi.string().max(500).optional().allow(''),
  about: Joi.string().max(8000).required().messages({
    'string.empty': 'About cannot be empty',
    'string.max': 'About should have a maximum length of {#limit}',
  }),
});

const dataToValidate = {
  name: 'Dr. Jane Smith',
  avatar_url: 'https://example.com/avatar.jpg',
  experience: '5 years',
  price_per_hour: 100,
  rating: 4.5,
  license: 'Licensed Psychologist',
  specialization: 'Cognitive Behavioral Therapy',
  initial_consultation: 'Free 15-minute consultation',
  about:
    'Dr. Jane Smith is a licensed psychologist with over 5 years of experience in cognitive behavioral therapy.',
};

const validationResult = createPsychologistSchema.validate(dataToValidate, {
  abortEarly: false,
});
if (validationResult.error) {
  console.error('Validation Error:', validationResult.error.details);
} else {
  console.log('Validation Successful:', validationResult.value);
}

export const upsertPsychologistSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}',
  }),
  rating: Joi.number().min(1).max(5).messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least {#limit}',
    'number.max': 'Rating cannot exceed {#limit}',
  }),
  avatar_url: Joi.string().uri().optional().allow(''),
  experience: Joi.string().min(1).max(100).messages({
    'string.empty': 'Experience cannot be empty',
    'string.min': 'Experience should have a minimum length of {#limit}',
  }),
  price_per_hour: Joi.number().min(0).messages({
    'number.base': 'Price per hour must be a number',
    'number.min': 'Price per hour cannot be negative',
  }),
  license: Joi.string().min(1).max(100).messages({
    'string.empty': 'License cannot be empty',
    'string.min': 'License should have a minimum length of {#limit}',
  }),
  specialization: Joi.string().min(1).max(100).messages({
    'string.empty': 'Specialization cannot be empty',
    'string.min': 'Specialization should have a minimum length of {#limit}',
  }),
  initial_consultation: Joi.string().max(500).optional().allow(''),
  about: Joi.string().max(8000).messages({
    'string.empty': 'About cannot be empty',
    'string.max': 'About should have a maximum length of {#limit}',
  }),
});
