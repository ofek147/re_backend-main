import { Router } from "express";
import {
  getAllLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leads";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/leads", getAllLeads);
router.post("/leads", createLead);
router.put("/leads/:id", updateLead);
router.delete("/leads/:id", deleteLead);

export default router;
