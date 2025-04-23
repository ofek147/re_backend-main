import { Router } from "express";
import { login, verifyToken } from "../controllers/admin";
const router = Router();

router.post("/admin", login);
router.get("/admin/verify", verifyToken);

export default router;
