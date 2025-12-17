import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  websiteCount: {
    type: Number,
    default: 0,
  },

  
});

export const View = mongoose.model("View", viewSchema);
