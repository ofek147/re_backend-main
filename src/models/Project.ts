import mongoose, { Document, Schema } from "mongoose";

interface Coordinate {
  lat: number;
  lng: number;
}

interface ProjectDetails {
  area_size: string;
  residence: string;
  employment: string;
}

export interface IProject extends Document {
  slug: string;
  image: string;
  time_frame: string;
  progress: number;
  status: string;
  name: string;
  under_name: string;
  title: string;
  description: string;
  details: ProjectDetails[];
  progress_description: string;
  coordinates: Coordinate[];
  center: Coordinate;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      image: {
        type: String,
        trim: true,
      },
      time_frame: {
        type: String,
        trim: true,
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      status: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      under_name: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      details: [
        {
          area_size: String,
          residence: String,
          employment: String,
        },
      ],
      progress_description: {
        type: String,
        trim: true,
      },
      coordinates: [
        {
          lat: Number,
          lng: Number,
        },
      ],
      center: {
        lat: Number,
        lng: Number,
      },
    },
    {
      timestamps: true,
      versionKey: false,
      collection: "projects",
      toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
          ret.id = ret._id; // שימוש ב-_id של Mongoose כ-id החיצוני
          delete ret._id;
        },
      },
    }
  );

export default mongoose.model<IProject>("Project", ProjectSchema);
