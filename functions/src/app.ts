import express from "express";
import cors from "cors";
import { authGuard } from "./middlewares/auth";
import { errorHandler } from "./middlewares/error";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import startupsRoutes from "./routes/startups.routes";
import projectsRoutes from "./routes/projects.routes";
import applicationsRoutes from "./routes/applications.routes";
import tasksRoutes from "./routes/tasks.routes";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/users", authGuard, usersRoutes);
app.use("/startups", authGuard, startupsRoutes);
app.use("/projects", authGuard, projectsRoutes);
app.use("/applications", authGuard, applicationsRoutes);
app.use("/tasks", authGuard, tasksRoutes);

app.use(errorHandler);
export default app;