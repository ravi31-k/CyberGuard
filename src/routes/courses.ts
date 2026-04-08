import express from "express";
import { Course } from "../models/Course.ts";
import { Quiz } from "../models/Quiz.ts";
import { authenticate, authorize } from "../middleware/auth.ts";
import { UserRole } from "../models/User.ts";

const router = express.Router();

// Get all courses
router.get("/", authenticate, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get course by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    const quiz = await Quiz.findOne({ courseId: course._id });
    res.json({ course, quiz });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course" });
  }
});

// Create course (Admin/Analyst only)
router.post("/", authenticate, authorize([UserRole.ADMIN, UserRole.ANALYST]), async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
