import express from "express";
import { User, UserRole } from "../models/User.ts";
import { Course } from "../models/Course.ts";
import { PhishingCampaign } from "../models/PhishingCampaign.ts";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.ts";

const router = express.Router();

router.get("/stats", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === UserRole.ADMIN || role === UserRole.ANALYST) {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const campaigns = await PhishingCampaign.find();
      
      const totalClicks = campaigns.reduce((acc, c) => acc + c.targets.filter(t => t.status === "CLICKED").length, 0);
      const totalCompromised = campaigns.reduce((acc, c) => acc + c.targets.filter(t => t.status === "COMPROMISED").length, 0);

      res.json({
        totalUsers,
        totalCourses,
        totalClicks,
        totalCompromised,
        avgRiskScore: 45, // Placeholder or calculated
      });
    } else {
      const user = await User.findById(userId);
      // User specific stats
      res.json({
        riskScore: user?.riskScore,
        completedCourses: 2,
        pendingCourses: 1,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

export default router;
