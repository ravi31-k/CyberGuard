import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  severity: { type: String, enum: ["INFO", "WARNING", "CRITICAL"], default: "INFO" },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
