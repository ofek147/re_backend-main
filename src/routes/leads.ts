import { Router } from "express";
import { createLead, getAllLeads } from "../controllers/leads";

const router = Router();

router.post("/leads", createLead);
router.get("/leads", getAllLeads);

export default router;
