import { Router } from "express";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
} from "../controllers/projects";
import { requireAuth } from "../middleware/auth";

console.log("קובץ routes/projects.ts נטען");

const router = Router();

router.get("/projects", requireAuth, getAllProjects);
router.get("/projects/:slug", requireAuth, getProjectBySlug);
router.post("/projects", requireAuth, createProject);
router.put("/projects/:slug", requireAuth, updateProject);
router.delete("/projects/:slug", requireAuth, deleteProject);

export default router;
