import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Teacher from "../models/Teacher";
import mongoose from "mongoose";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hash, role });
    await user.save();
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body)
  
  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(400).json({ msg: "User not found" });

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // 3️⃣ If teacher → fetch teacher profile (UNCHANGED)
    let teacher = null;
    if (user.role === "teacher") {
      teacher = await Teacher.findOne({ userId: user._id })
        .populate("classIds");

      // 🔥 If teacher profile does NOT exist → create empty one automatically (UNCHANGED)
      if (!teacher) {
        teacher = await Teacher.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          subject: "Not Assigned",
          classIds: [],
        });
      }
    }

    // 🔥 FIXED JWT: Teacher ID in 'id' field, User ID in 'userId'
    const tokenPayload: any = { 
      id: (user as any)._id.toString(),        // Default: User ID
      role: user.role 
    };

    // ✅ ONLY for teachers: Put Teacher ID in 'id' field
    if (user.role === "teacher" && teacher) {
      tokenPayload.id =(teacher as any)._id.toString();  // Teacher ID
      tokenPayload.userId = (user as any)._id.toString(); // Keep User ID too
    } else {
      tokenPayload.userId = (user as any)._id.toString(); // Admin keeps User ID
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    console.log("🔥 JWT payload:", tokenPayload);

    res.json({
      success: true,
      token,
      user,
      teacher,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// controllers/auth.controller.ts - FIXED
// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
  
//   try {
//     // 1️⃣ Find USER (existing)
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     // 2️⃣ Check password (existing)
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

//     // 3️⃣ Find/Create TEACHER profile (FIXED)
//     let teacher = await Teacher.findOne({ userId: user._id });
    
//     // 🔥 AUTO-CREATE Teacher if missing (first login)
//     if (!teacher && user.role === "teacher") {
//       teacher = new Teacher({
//         userId: user._id,           // Link to User
//         name: user.name,
//         email: user.email,
//         subject: "Not Assigned",
//         classIds: [],
//         _id: new mongoose.Types.ObjectId(),  // Generate Teacher ID
//       });
//       await teacher.save();
//       console.log("✅ Auto-created Teacher:", teacher._id);
//     }

//     // 4️⃣ Generate JWT with TEACHER ID (CRITICAL FIX)
//     const token = jwt.sign(
//       { 
//         id: teacher?._id || user._id,  // ✅ TEACHER ID first
//         userId: user._id,              // Fallback user ID
//         role: user.role 
//       }, 
//       process.env.JWT_SECRET!, 
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,                           // Now has teacher._id
//       user,
//       teacher: teacher || null,        // Full teacher profile
//       teacherId: teacher?._id,         // ✅ EXPLICIT teacherId
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };


