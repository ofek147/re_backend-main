import { Router } from "express";
import {
  getAllLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leads";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/leads", requireAuth, getAllLeads);
router.post("/leads", requireAuth, createLead);
router.put("/leads/:id", requireAuth, updateLead);
router.delete("/leads/:id", requireAuth, deleteLead);

export default router;
