import mongoose, { Schema, Document } from "mongoose";

export interface IPhishingCampaign extends Document {
  name: string;
  template: {
    subject: string;
    body: string;
    senderName: string;
    senderEmail: string;
  };
  targets: {
    userId: mongoose.Types.ObjectId;
    status: "SENT" | "OPENED" | "CLICKED" | "COMPROMISED" | "REPORTED";
    timestamp: Date;
  }[];
  createdBy: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
}

const PhishingCampaignSchema: Schema = new Schema({
  name: { type: String, required: true },
  template: {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
  },
  targets: [{
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["SENT", "OPENED", "CLICKED", "COMPROMISED", "REPORTED"], default: "SENT" },
    timestamp: { type: Date, default: Date.now },
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

export const PhishingCampaign = mongoose.model<IPhishingCampaign>("PhishingCampaign", PhishingCampaignSchema);
