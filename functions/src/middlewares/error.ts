import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || "Internal Server Error" });
}