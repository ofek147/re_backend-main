import { Router } from "express";
import {
  createLead,
  deleteLead,
  getAllLeads,
  updateLead,
} from "../controllers/leads";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/leads", getAllLeads);
router.post("/leads", createLead);
router.put("/leads/:id", requireAuth, updateLead);
router.delete("/leads/:id", requireAuth, deleteLead);

export default router;
