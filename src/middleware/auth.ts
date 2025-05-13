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
  const isProtectedRouteForProjects =
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.path.startsWith("/projects");

  // אפשר גישה עם API Key רק עבור GET ל-/projects
  if (
    req.path.startsWith("/projects") &&
    req.method === "GET" &&
    apiKey === SECRET_API_TOKEN
  ) {
    return next();
  }

  // כל הפעולות על /leads דורשות אימות אדמין (טוקן)
  if (req.path.startsWith("/leads")) {
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          JWT_SECRET
        ) as TokenPayload;
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          req.user = admin;
          return next();
        }
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
    }
    return res.status(401).json({ message: "Authentication required" });
  }

  // כל שאר הבקשות לנתיבים מוגנים (/projects עם POST, PUT, DELETE) דורשות טוקן אדמין
  if (isProtectedRouteForProjects) {
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          JWT_SECRET
        ) as TokenPayload;
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          req.user = admin;
          return next();
        }
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
    }
    return res.status(401).json({ message: "Authentication required" });
  }

  // אם הבקשה לא תואמת לאף אחד מהתנאים לעיל, דרוש אימות
  return res.status(401).json({ message: "Authentication required" });
};
