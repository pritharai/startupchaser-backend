import {Request, Response} from "express";
import jwt from "jsonwebtoken";

export async function signup(req: Request, res: Response) {
  try {
    const {email} = req.body;

    // For demo purposes, just return success
    return res.status(201).json({message: "User registered", user: {email}});
  } catch (error) {
    return res.status(500).json({message: "Signup failed", error});
  }
}

export async function login(req: Request, res: Response) {
  try {
    const {email} = req.body;

    // For demo purposes, accept any login
    const token = jwt.sign(
      {email: email},
      process.env.JWT_SECRET || "default-secret",
      {expiresIn: "1h"}
    );

    return res.status(200).json({message: "Login successful", token});
  } catch (error) {
    return res.status(500).json({message: "Login failed", error});
  }
}

export async function logout(req: Request, res: Response) {
  // Since JWT is stateless, "logout" is usually handled on client side
  // Optionally: maintain a blacklist of tokens if you want server-side logout
  return res.status(200).json({message: "Logged out successfully"});
}
