// types/express.d.ts
import { IUser } from "../models/User"; // adjust path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        teacherId?: string;
        role?: string;
        // add other properties you set in auth middleware
      };
    }
  }
}
