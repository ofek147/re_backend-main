import { Router } from "express";
import {
  createLead,
  deleteLead,
  getAllLeads,
  updateLead,
} from "../controllers/leads";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/leads", requireAuth, getAllLeads);
router.post("/leads", requireAuth, createLead);
router.put("/leads/:id", requireAuth, updateLead);
router.delete("/leads/:id", requireAuth, deleteLead);

export default router;
