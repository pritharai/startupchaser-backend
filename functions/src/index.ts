
// import * as functions from "firebase-functions";
import express, { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
import studentRoutes from "./routes/student.routes";
import projectRoutes from "./routes/project.routes";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Firebase + Express!");
});
app.use("/projects", projectRoutes);
app.use("/students", studentRoutes);

export const api = onRequest(app);

