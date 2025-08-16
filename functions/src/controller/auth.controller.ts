import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserSchema from "../models/user.model"; // adjust path if needed

export async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSchema.create({ email, password: hashedPassword });

    return res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
}

export async function logout(req: Request, res: Response) {
  // Since JWT is stateless, "logout" is usually handled on client side
  // Optionally: maintain a blacklist of tokens if you want server-side logout
  return res.status(200).json({ message: "Logged out successfully" });
}
