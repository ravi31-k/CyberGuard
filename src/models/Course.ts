import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  modules: {
    title: string;
    content: string; // Markdown or HTML
    type: "VIDEO" | "PDF" | "LAB" | "TEXT";
    url?: string;
  }[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: string;
  estimatedTime: number; // in minutes
  createdAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  modules: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["VIDEO", "PDF", "LAB", "TEXT"], default: "TEXT" },
    url: { type: String },
  }],
  difficulty: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: "BEGINNER" },
  category: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
}, { timestamps: true });

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
