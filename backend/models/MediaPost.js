import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Dainik Bhaskar / Business Standard
      required: true,
      trim: true,
    },

    publishDate: {
      type: Date, 
      required: true,
    },

    year: {
      type: Number, 
      required: true,
    },

    month: {
      type: String, 
      required: true,
    },

    image: {
      type: String, 
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", mediaSchema);
