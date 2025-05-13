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

const SECRET_API_TOKEN = process.env.SECRET_API_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
console.log("SECRET_API_TOKEN:", SECRET_API_TOKEN);
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  console.log("API Key Received:", apiKey);
  if (apiKey === SECRET_API_TOKEN) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      if (!JWT_SECRET) {
        console.error("JWT_SECRET לא מוגדר!");
        return res.status(500).json({ message: "Server configuration error" });
      }
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        req.user = admin;
        return next();
      }
    } catch (error) {
      console.error("שגיאה בפענוח טוקן:", error);
    }
  }

  return res.status(401).json({ message: "Authentication required" });
};
