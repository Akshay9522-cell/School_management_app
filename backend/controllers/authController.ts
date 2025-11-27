import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Teacher from "../models/Teacher";

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

  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // 3️⃣ Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // 4️⃣ If teacher → fetch teacher profile
    let teacher = null;
    if (user.role === "teacher") {
      teacher = await Teacher.findOne({ userId: user._id })
        .populate("classIds");

      // 🔥 If teacher profile does NOT exist → create empty one automatically
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
