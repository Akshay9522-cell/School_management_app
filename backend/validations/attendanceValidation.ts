import Joi from "joi";

// ✅ For adding attendance
export const createAttendanceValidation = Joi.object({
  student: Joi.string().required(),        // Student ID
  class: Joi.string().required(),          // Class ID
  date: Joi.date().required(),             // Attendance date
  status: Joi.string().valid("present", "absent", "leave").required(), // Status
  remarks: Joi.string().optional(),        // Optional remarks
});

// ✅ For updating attendance
export const updateAttendanceValidation = Joi.object({
  student: Joi.string().optional(),
  class: Joi.string().optional(),
  date: Joi.date().optional(),
  status: Joi.string().valid("present", "absent", "leave").optional(),
  remarks: Joi.string().optional(),
});


// ✅ For bulk attendance
export const bulkAttendanceValidation = Joi.object({
  classId: Joi.string().required(),       // Class ID
  date: Joi.date().required(),            // Attendance date
  records: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().required(), 
        status: Joi.string().valid("present", "absent", "leave").required(),
        remarks: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
});

