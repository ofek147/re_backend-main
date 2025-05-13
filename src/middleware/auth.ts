import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // בדיקה עבור /leads - כל הפעולות דורשות אימות אדמין
  if (req.path.startsWith("/leads")) {
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
          id: string;
        };
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

  // בדיקה עבור /projects
  if (req.path.startsWith("/projects")) {
    // אפשר גישת GET ללא אימות מיוחד
    if (req.method === "GET") {
      return next();
    }

    // כל שאר הפעולות (/projects עם POST, PUT, DELETE) דורשות אימות אדמין
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
          id: string;
        };
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

  return next();
};
