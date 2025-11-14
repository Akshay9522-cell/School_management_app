import Joi from "joi";

export const createStudentValidation = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must have at least 2 characters",
    }),
    rollNo: Joi.number().integer().min(1).required().messages({
      "number.base": "Roll number must be a valid number",
      "any.required": "Roll number is required",
    }),
    class: Joi.string().required().messages({
      "string.empty": "Class ID is required",
    }),
    section: Joi.string().allow("", null), // optional field
    age: Joi.number().min(3).max(100).optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    parentName: Joi.string().optional(),
    address: Joi.string().optional(),
    contactNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Contact number must be 10 digits",
      }),
  }),
});

export const updateStudentValidation = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    rollNo: Joi.number().integer().min(1).optional(),
    class: Joi.string().optional(),
    section: Joi.string().allow("", null),
    age: Joi.number().min(3).max(100).optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    parentName: Joi.string().optional(),
    address: Joi.string().optional(),
    contactNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Contact number must be 10 digits",
      }),
  }),
});
