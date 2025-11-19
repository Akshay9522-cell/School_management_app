// validations/student.validation.ts
import Joi from "joi";

export const createStudentValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  
  rollNo: Joi.number().optional(),
  address: Joi.string().required(),
  parentName: Joi.string().required(),
  parentPhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  admissionNo: Joi.string().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  classId: Joi.string().optional().allow("", null),
  profileImage: Joi.string().optional().allow(""),
});

export const updateStudentValidation = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({ "string.pattern.base": "Phone must be 10 digits" }),
   
    rollNo: Joi.number().optional(),
    address: Joi.string().optional(),
    parentName: Joi.string().optional(),
    parentPhone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({ "string.pattern.base": "Parent phone must be 10 digits" }),
    admissionNo: Joi.string().optional(),
    dob: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    classId: Joi.string().optional().allow("", null),
    profileImage: Joi.string().optional().allow(""),
    status: Joi.string().valid("Active", "Inactive").optional(),
  }),
});
