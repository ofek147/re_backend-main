import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  full_name: string;
  phone: string;
  email: string;
  text?: string;
  source?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    text: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
      enum: ["website", "facebook", "google", "referral", "other"],
    },
    status: {
      type: String,
      trim: true,
      enum: ["new", "contacted", "in_progress", "proposal_sent", "won", "lost"],
      default: "new",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "leads",
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id; 
        delete ret._id;
      },
    },
  }
);

LeadSchema.index({ full_name: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ status: 1 });

export default mongoose.model<ILead>("Lead", LeadSchema);
