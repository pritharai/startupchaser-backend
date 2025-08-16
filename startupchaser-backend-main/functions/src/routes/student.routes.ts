import {Router, Request, Response} from "express";

const router = Router();

// Example route
router.get("/", (req: Request, res: Response) => {
  res.json({message: "Student routes working!"});
});

// Add more routes
router.post("/", (req: Request, res: Response) => {
  const {name, email} = req.body;
  res.json({message: "Student created", data: {name, email}});
});

export default router;
