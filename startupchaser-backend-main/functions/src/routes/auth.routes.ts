import {Router} from "express";
import {login, signup, logout} from "../controller/auth.controller";
import {authGuard} from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route (requires JWT)
router.post("/logout", authGuard, logout);

export default router;
