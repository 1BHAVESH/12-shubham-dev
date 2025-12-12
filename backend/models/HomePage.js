import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  message: { type: String, required: true },   // 👈 client message
  name: { type: String, required: true },      // 👈 client name
  position: { type: String, required: true },  // 👈 client position
  photo: { type: String, required: true }      // 👈 client photo URL
});

const homePageSchema = new mongoose.Schema({
  about: {
    title: String,
    description: String,
    image: String,
  },
  stats: {
    awards: Number,
    projects: Number,
    clients: Number,
    team: Number,
  },
  testimonials: [testimonialSchema]  // 👈 Multiple testimonials stored here
});

export default mongoose.model("HomePage", homePageSchema);
