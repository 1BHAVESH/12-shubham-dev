import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    resume: {
      type: String, // resume file path / URL
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const JobApplication =  mongoose.model("JobApplication", jobApplicationSchema);
