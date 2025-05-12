import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

interface TokenPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const SECRET_API_KEY = process.env.SECRET_API_KEY;

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === SECRET_API_KEY) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        req.user = admin;
        return next();
      }
    } catch (error) {
      // טוקן לא תקין
    }
  }

  return res.status(401).json({ message: "Authentication required" });
};
