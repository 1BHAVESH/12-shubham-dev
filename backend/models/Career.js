import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    places: {
      type: String,
      required: true,
    },
    positions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Career = mongoose.model("Career", careerSchema);

export default Career;
