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

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      const admin = await Admin.findById(decoded.id);

      if (admin) {
        req.user = admin;
        return next();
      }
    } catch (error) {
      console.error("JWT authentication failed in requireAuth:", error);
    }
  }

  if (req.path === "/leads" && req.method === "POST") {
    return next();
  }

  if (
    req.path.startsWith("/projects") &&
    req.method === "GET" &&
    apiKey === SECRET_API_TOKEN
  ) {
    return next();
  }

  if (req.path.startsWith("/leads")) {
    return res.status(401).json({
      message: "Authentication required for leads (admin access only)",
    });
  }

  if (
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.path.startsWith("/projects")
  ) {
    return res.status(401).json({
      message:
        "Authentication required for modifying projects (admin access only)",
    });
  }

  return res
    .status(401)
    .json({ message: "Authentication required or invalid access" });
};
