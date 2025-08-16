import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({message: "Unauthorized: No token provided"});
    }

    const secret = process.env.JWT_SECRET || "default-secret";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded; // attach decoded payload to req

    return next(); // ✅ ensure we explicitly return
  } catch (error) {
    return res.status(401).json({message: "Unauthorized: Invalid token"});
  }
}
