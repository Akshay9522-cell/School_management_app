import Joi from "joi";

export const createTeacherValidation = Joi.object({
  userId:Joi.string().required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(2).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  qualification: Joi.string().max(100).optional(),
  joiningDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
});

export const updateTeacherValidation = Joi.object({
   userId:Joi.string().required(),
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  subject: Joi.string().min(2).optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  qualification: Joi.string().max(100).optional(),
  joiningDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
});
