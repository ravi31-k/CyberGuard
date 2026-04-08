import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  ANALYST = "ANALYST",
  EMPLOYEE = "EMPLOYEE",
  AUDITOR = "AUDITOR",
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  riskScore: number;
  department?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.EMPLOYEE },
  riskScore: { type: Number, default: 50 }, // 0-100, lower is better
  department: { type: String },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  lastLogin: { type: Date },
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);
