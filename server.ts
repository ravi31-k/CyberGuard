import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.ts";
import courseRoutes from "./src/routes/courses.ts";
import phishingRoutes from "./src/routes/phishing.ts";
import dashboardRoutes from "./src/routes/dashboard.ts";
import auditRoutes from "./src/routes/audits.ts";
import { User, UserRole } from "./src/models/User.ts";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedAdmin() {
  const adminEmail = "admin@cyberguard.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "System Admin",
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      riskScore: 0,
    });
    await admin.save();
    console.log("Admin user seeded: admin@cyberguard.com / admin123");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development/Vite
  }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cyberguard";
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log("Connected to MongoDB");
      await seedAdmin();
    })
    .catch((err) => console.error("MongoDB connection error:", err));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/phishing", phishingRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/audits", auditRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
