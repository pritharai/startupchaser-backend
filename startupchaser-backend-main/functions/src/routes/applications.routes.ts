import {Router} from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({message: "Applications endpoint"});
});

export default router;
