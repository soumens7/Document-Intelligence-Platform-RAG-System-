import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { userId: string };
}

export const authMiddleware = (
  req: AuthenticatedRequest, // Use the extended type here
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: header ? "Invalid token format" : "No token provided" 
      });
    }

    const token = header.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Token missing from header" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("FATAL: JWT_SECRET missing from environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      const decoded = jwt.verify(token, secret);

      // Validate payload structure
      if (typeof decoded !== "object" || !("userId" in decoded)) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      req.user = decoded as JwtPayload & { userId: string };
      return next(); // Explicit return is good practice
      

    } catch (err) {
      console.error("JWT verify failed:", err instanceof Error ? err.message : err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("Auth middleware crash:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};