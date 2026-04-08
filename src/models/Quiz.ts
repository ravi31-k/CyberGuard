import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number; // index
    explanation?: string;
  }[];
  passingScore: number;
}

const QuizSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
  }],
  passingScore: { type: Number, default: 70 },
}, { timestamps: true });

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
