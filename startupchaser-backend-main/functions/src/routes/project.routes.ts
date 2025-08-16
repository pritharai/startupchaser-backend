import {Router, Request, Response} from "express";

const router = Router();

// Example route
router.get("/", (req: Request, res: Response) => {
  res.json({message: "Project routes working!"});
});

// Add more routes like POST, PUT, DELETE etc.
router.post("/", (req: Request, res: Response) => {
  const {title, description} = req.body;
  res.json({message: "Project created", data: {title, description}});
});

export default router;
