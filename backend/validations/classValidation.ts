import Joi from "joi";

// ✅ For creating a class
export const createClassValidation = Joi.object({
  name: Joi.string().required(),
  section: Joi.string().optional(),
  classTeacher: Joi.string().required(),
  students: Joi.array().items(Joi.string()).optional(),
});

// ✅ For updating a class
export const updateClassValidation = Joi.object({
  name: Joi.string().optional(),
  section: Joi.string().optional(),
  classTeacher: Joi.string().optional(),
  students: Joi.array().items(Joi.string()).optional(),
});
