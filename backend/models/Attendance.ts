// import mongoose, { Schema, Document } from "mongoose";

// export interface IAttendance extends Document {
//   student: mongoose.Types.ObjectId; // Ref Student
//   class: mongoose.Types.ObjectId;   // Ref Class
//   date: Date;                       // Attendance date
//   status: "present" | "absent" | "leave"; // Attendance status
//   createdAt: Date;
//   updatedAt: Date;
// }

// const AttendanceSchema = new Schema<IAttendance>(
//   {
//     student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
//     class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
//     date: { type: Date, required: true },
//     status: {
//       type: String,
//       enum: ["present", "absent", "leave"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);

