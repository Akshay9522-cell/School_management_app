import { Request, Response, NextFunction } from "express";
import { Schema } from "joi"; // 👈 use Schema instead of ObjectSchema

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
};
