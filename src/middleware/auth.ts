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
  const apiKey = req.headers["x-api-key"];
  const authHeader = req.headers.authorization;
  const isProtectedRoute =
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.path.startsWith("/projects");

  // אפשר גישה עם API Key רק עבור GET
  if (!isProtectedRoute && apiKey === SECRET_API_TOKEN) {
    return next();
  }

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
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }

  return res.status(401).json({ message: "Authentication required" });
};
