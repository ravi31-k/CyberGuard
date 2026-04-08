import express from "express";
import { AuditLog } from "../models/AuditLog.ts";
import { authenticate, authorize } from "../middleware/auth.ts";
import { UserRole } from "../models/User.ts";

const router = express.Router();

// Get all audit logs (Admin/Auditor only)
router.get("/", authenticate, authorize([UserRole.ADMIN, UserRole.AUDITOR]), async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("userId", "name email").sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

// Create audit log entry
router.post("/", authenticate, async (req, res) => {
  try {
    const log = new AuditLog({
      ...req.body,
      userId: (req as any).user?.id,
      timestamp: new Date(),
    });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
