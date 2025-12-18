import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    websiteCount: {
      type: Number,
      default: 0,
    },

    //  IP ke sath date store hogi
    ips: [
      {
        ip: String,
        date: String, 
      },
    ],
  },
  { timestamps: true }
);

export const View = mongoose.model("View", viewSchema);
