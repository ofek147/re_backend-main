import { Router } from "express";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
} from "../controllers/projects";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/projects", getAllProjects);
router.get("/projects/:slug", getProjectBySlug);

// Protected routes
router.post("/projects", requireAuth, createProject);
router.put("/projects/:slug", requireAuth, updateProject);
router.delete("/projects/:slug", requireAuth, deleteProject);

export default router;
