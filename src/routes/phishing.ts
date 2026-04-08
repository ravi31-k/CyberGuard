import express from "express";
import { PhishingCampaign } from "../models/PhishingCampaign.ts";
import { User, UserRole } from "../models/User.ts";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.ts";

const router = express.Router();

// Get all campaigns
router.get("/", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST]), async (req, res) => {
  try {
    const campaigns = await PhishingCampaign.find().populate("createdBy", "name");
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});

// Create new campaign
router.post("/", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST]), async (req: AuthRequest, res) => {
  try {
    const { name, template, targetUserIds } = req.body;
    
    const targets = targetUserIds.map((userId: string) => ({
      userId,
      status: "SENT",
      timestamp: new Date(),
    }));

    const campaign = new PhishingCampaign({
      name,
      template,
      targets,
      createdBy: req.user?.id,
      startDate: new Date(),
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Track interaction (Public-ish endpoint for simulation)
router.get("/track/:campaignId/:userId/:action", async (req, res) => {
  try {
    const { campaignId, userId, action } = req.params;
    const statusMap: any = {
      click: "CLICKED",
      compromise: "COMPROMISED",
      open: "OPENED",
    };

    const status = statusMap[action];
    if (!status) return res.status(400).json({ message: "Invalid action" });

    await PhishingCampaign.updateOne(
      { _id: campaignId, "targets.userId": userId },
      { $set: { "targets.$.status": status, "targets.$.timestamp": new Date() } }
    );

    // If compromised, increase risk score
    if (status === "COMPROMISED") {
      await User.findByIdAndUpdate(userId, { $inc: { riskScore: 10 } });
    }

    res.send("<h1>Security Alert</h1><p>This was a simulated phishing attempt. Please complete your training.</p>");
  } catch (error) {
    res.status(500).send("Error tracking interaction");
  }
});

export default router;
