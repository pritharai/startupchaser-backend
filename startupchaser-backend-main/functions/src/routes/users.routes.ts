import {Router} from "express";

const router = Router();

router.get("/profile", (req, res) => {
  res.json({message: "User profile endpoint"});
});

export default router;
