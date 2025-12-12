import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  websiteCount: {
    type: Number,
    default: 0,
  },

  projectViews: [
    {
      projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      title: String,
      count: { type: Number, default: 0 },
    },
  ],
});

export const View = mongoose.model("View", viewSchema);
