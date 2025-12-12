import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true },
});

const nearbyLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distance: { type: String, default: "3.5 KM" },
});

const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  tagline: {
    type: String,
    default: "",
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ["ongoing", "completed", "upcoming"],
    default: "ongoing",
  },
  price: {
    type: String,
  },
  area: {
    type: String,
  },
  propertyTypes: {
    type: String,
  },
  contactNumber: {
    type: String,
  },

  // Images
  imageUrl: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  overviewImageUrl: {
    type: String,
  },
  masterPlanImageUrl: {
    type: String,
  },
  floorPlanImageUrl: {
    type: String,
  },
  buildingImageUrl: {
    type: String,
  },
  galleryImages: [
    {
      type: String,
    },
  ],

  // Documents
  brochureUrl: {
    type: String,
    default: null,
  },
  priceSheetUrl: {
    type: String,
    default: null,
  },

  // Amenities
  amenities: [amenitySchema],

  // Highlights (e.g., "2 & 3 BHK - Apartments", "Well Equipped - Modern Gym")
  highlights: [highlightSchema],

  // Location details
  nearbyLocations: [nearbyLocationSchema],
  mapEmbedUrl: {
    type: String,
  },

  // Settings
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug from title
projectSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
