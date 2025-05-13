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

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("--- התחלת בדיקת requireAuth ---");

  const apiKey = req.headers["x-api-key"];
  console.log("ערך של x-api-key:", apiKey);
  console.log("ערך מצופה של SECRET_API_KEY:", SECRET_API_TOKEN);
  if (apiKey === SECRET_API_TOKEN) {
    return next();
  }

  const authHeader = req.headers.authorization;
  console.log("ערך של Authorization header:", authHeader);
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log("טוקן שנמצא:", token);
    try {
      if (!JWT_SECRET) {
        console.error("JWT_SECRET לא מוגדר!");
        return res.status(500).json({ message: "Server configuration error" });
      }
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      console.log("פענוח טוקן:", decoded);
      const admin = await Admin.findById(decoded.id);
      console.log("מנהל שנמצא:", admin);
      if (admin) {
        req.user = admin;
        console.log("מנהל מאומת:", req.user);
        return next();
      } else {
        console.log("מנהל מערכת לא נמצא לפי הטוקן");
      }
    } catch (error) {
      console.error("שגיאה בפענוח טוקן:", error);
    }
  }

  console.log("לא נמצא טוקן תקין או מנהל מערכת");
  return res.status(401).json({ message: "Authentication required" });
};
