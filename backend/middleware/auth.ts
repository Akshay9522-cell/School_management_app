import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Check token in cookies
    let token = req.cookies?.token;

    // 2️⃣ If not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ If still no token → unauthorized
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 4️⃣ Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 5️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    // 6️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;
    