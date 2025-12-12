import Project from "../models/Project.js";
import fs from "fs";
import path from "path";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      title,
      slug,
      tagline,
      description,
      location,
      address,
      status,
      price,
      area,
      propertyTypes,
      contactNumber,
      amenities,
      highlights,
      nearbyLocations,
      mapEmbedUrl,
      isActive,
      isFeatured,
      order,
      amenityIconIndexes,
    } = req.body;

    console.log(amenities);

    const projectTitle = name || title;

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.files.image[0].filename}`;
    const brochureUrl = req.files.brochure
      ? `/uploads/${req.files.brochure[0].filename}`
      : null;
    const priceSheetUrl = req.files.priceSheet
      ? `/uploads/${req.files.priceSheet[0].filename}`
      : null;
    const logoUrl = req.files.logo
      ? `/uploads/${req.files.logo[0].filename}`
      : null;
    const videoFileUrl = req.files.video
      ? `/uploads/${req.files.video[0].filename}`
      : null;
    const overviewImageUrl = req.files.overviewImage
      ? `/uploads/${req.files.overviewImage[0].filename}`
      : null;
    const masterPlanImageUrl = req.files.masterPlanImage
      ? `/uploads/${req.files.masterPlanImage[0].filename}`
      : null;
    const floorPlanImageUrl = req.files.floorPlanImage
      ? `/uploads/${req.files.floorPlanImage[0].filename}`
      : null;
    const buildingImageUrl = req.files.buildingImage
      ? `/uploads/${req.files.buildingImage[0].filename}`
      : null;

    const galleryImages = req.files.galleryImages
      ? req.files.galleryImages.map((file) => `/uploads/${file.filename}`)
      : [];

    // Process amenities with icon uploads
    let parsedAmenities = amenities ? JSON.parse(amenities) : [];

    if (req.files?.amenityIcons && amenityIconIndexes) {
      const iconFiles = req.files.amenityIcons;
      const indexes = Array.isArray(amenityIconIndexes)
        ? amenityIconIndexes
        : [amenityIconIndexes];

      // Map icon files to their corresponding amenities
      indexes.forEach((index, i) => {
        const amenityIndex = parseInt(index);
        if (iconFiles[i] && parsedAmenities[amenityIndex]) {
          parsedAmenities[
            amenityIndex
          ].icon = `/uploads/${iconFiles[i].filename}`;
        }
      });
    }

    const project = await Project.create({
      title: projectTitle,
      slug,
      tagline,
      description,
      location,
      address,
      status,
      price,
      area,
      propertyTypes,
      contactNumber,
      imageUrl,
      logoUrl,
      videoUrl: videoFileUrl,
      overviewImageUrl,
      masterPlanImageUrl,
      floorPlanImageUrl,
      buildingImageUrl,
      galleryImages,
      brochureUrl,
      priceSheetUrl,
      amenities: parsedAmenities,
      highlights: highlights ? JSON.parse(highlights) : [],
      nearbyLocations: nearbyLocations ? JSON.parse(nearbyLocations) : [],
      mapEmbedUrl,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const deleteOldFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join("uploads", fileUrl.replace("/uploads/", ""));
  if (fs.existsSync(filePath)) {
    console.log("hii");
    fs.unlinkSync(filePath);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      tagline,
      description,
      location,
      address,
      status,
      price,
      area,
      propertyTypes,
      contactNumber,
      amenities,
      highlights,
      nearbyLocations,
      mapEmbedUrl,
      isActive,
      isFeatured,
      order,
      amenityIconIndexes,
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // ------------------------
    // TEXT FIELDS UPDATE
    // ------------------------
    if (title !== undefined) project.title = title;
    if (slug !== undefined) project.slug = slug;
    if (tagline !== undefined) project.tagline = tagline;
    if (description !== undefined) project.description = description;
    if (location !== undefined) project.location = location;
    if (address !== undefined) project.address = address;
    if (status !== undefined) project.status = status;
    if (price !== undefined) project.price = price;
    if (area !== undefined) project.area = area;
    if (propertyTypes !== undefined) project.propertyTypes = propertyTypes;
    if (contactNumber !== undefined) project.contactNumber = contactNumber;
    if (mapEmbedUrl !== undefined) project.mapEmbedUrl = mapEmbedUrl;
    if (isActive !== undefined) project.isActive = isActive;
    if (isFeatured !== undefined) project.isFeatured = isFeatured;
    if (order !== undefined) project.order = order;

    // ------------------------
    // AMENITIES HANDLING
    // ------------------------
    if (amenities) {
      const parsedAmenities = JSON.parse(amenities);

      if (req.files?.amenityIcons && amenityIconIndexes) {
        const iconFiles = req.files.amenityIcons;
        const indexes = Array.isArray(amenityIconIndexes)
          ? amenityIconIndexes
          : [amenityIconIndexes];

        indexes.forEach((index, i) => {
          const amenityIndex = parseInt(index);
          if (iconFiles[i] && parsedAmenities[amenityIndex]) {
            deleteOldFile(parsedAmenities[amenityIndex].icon);
            parsedAmenities[
              amenityIndex
            ].icon = `/uploads/${iconFiles[i].filename}`;
          }
        });
      }

      project.amenities = parsedAmenities;
    }

    if (highlights) project.highlights = JSON.parse(highlights);
    if (nearbyLocations) project.nearbyLocations = JSON.parse(nearbyLocations);

    // ------------------------
    // FILE UPDATES (IMAGE / PDF / VIDEO)
    // ------------------------
    if (req.files?.image) {
      deleteOldFile(project.imageUrl);
      project.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    if (req.files?.brochure) {
      deleteOldFile(project.brochureUrl);
      project.brochureUrl = `/uploads/${req.files.brochure[0].filename}`;
    }

    if (req.files?.priceSheet) {
      deleteOldFile(project.priceSheetUrl);
      project.priceSheetUrl = `/uploads/${req.files.priceSheet[0].filename}`;
    }

    if (req.files?.logo) {
      deleteOldFile(project.logoUrl);
      project.logoUrl = `/uploads/${req.files.logo[0].filename}`;
    }

    if (req.files?.video) {
      deleteOldFile(project.videoUrl);
      project.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    if (req.files?.overviewImage) {
      deleteOldFile(project.overviewImageUrl);
      project.overviewImageUrl = `/uploads/${req.files.overviewImage[0].filename}`;
    }

    if (req.files?.masterPlanImage) {
      deleteOldFile(project.masterPlanImageUrl);
      project.masterPlanImageUrl = `/uploads/${req.files.masterPlanImage[0].filename}`;
    }

    if (req.files?.floorPlanImage) {
      deleteOldFile(project.floorPlanImageUrl);
      project.floorPlanImageUrl = `/uploads/${req.files.floorPlanImage[0].filename}`;
    }

    if (req.files?.buildingImage) {
      deleteOldFile(project.buildingImageUrl);
      project.buildingImageUrl = `/uploads/${req.files.buildingImage[0].filename}`;
    }

    // -------------------------------------------------
    //   GALLERY IMAGE DELETE — SINGLE & MULTIPLE SUPPORT
    // -------------------------------------------------
    // GALLERY IMAGES DELETE (MULTIPLE)
    if (req.body.deletedImages) {
      console.log("RAW DELETE:", req.body.deletedImages);

      let deleted = req.body.deletedImages;

      // If string → convert to JSON
      if (typeof deleted === "string") {
        try {
          deleted = JSON.parse(deleted);
        } catch {
          deleted = [deleted];
        }
      }

      console.log("FINAL DELETED ARRAY:", deleted);

      // Delete files
      deleted.forEach((img) => deleteOldFile(img));

      // Remove from DB
      project.galleryImages = project.galleryImages.filter(
        (img) => !deleted.includes(img)
      );
    }

    // -------------------------------------------------
    //  🔥 ADD NEW GALLERY IMAGES (WITHOUT deleting old)
    // -------------------------------------------------
    if (req.files?.galleryImages) {
      const newImages = req.files.galleryImages.map(
        (file) => `/uploads/${file.filename}`
      );
      project.galleryImages = [...project.galleryImages, ...newImages];
    }

    // ------------------------
    // SAVE PROJECT
    // ------------------------
    const updatedProject = await project.save();

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // console.log(project)

    if (project.videoUrl) {
      deleteOldFile(project.videoUrl);
    }

    if(project.imageUrl){
      deleteOldFile(project.imageUrl);
    }

    if(project.overviewImageUrl){
      deleteOldFile(project.overviewImageUrl);
    }

    if(project.masterPlanImageUrl){
      deleteOldFile(project.masterPlanImageUrl);
    }

    if(project.floorPlanImageUrl){
      deleteOldFile(project.floorPlanImageUrl);
    }

    if(project.buildingImageUrl){
      deleteOldFile(project.buildingImageUrl);
    }

    if(project.brochureUrl){
      deleteOldFile(project.brochureUrl)
    }

    if(project.priceSheetUrl){
      deleteOldFile(project.priceSheetUrl)
    }

    if (
      Array.isArray(project.galleryImages) &&
      project.galleryImages.length > 0
    ) {
      console.log("Total images:", project.galleryImages.length);

      project.galleryImages.forEach((img) => {
        if (img) deleteOldFile(img); // ensure value exists
      });
    }

    if (
      Array.isArray(project.amenities) &&
      project.amenities.length > 0
    ) {
      console.log("Total images:", project.amenities.length);

      project.amenities.forEach((amenite) => {
        if (amenite) deleteOldFile(amenite.icon); // ensure value exists
      });
    }

    console.log(project)

     await Project.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectTtile = async (req, res) => {
  try {
    // Fetch only title from DB
    const projectTitle = await Project.find().select("title");

    // If no projects found
    if (!projectTitle || projectTitle.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No project titles found" });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Project titles fetched successfully",
      titles: projectTitle,
    });
  } catch (error) {
    console.error("Error fetching project titles:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

export const toggleProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Toggle value
    project.isActive = !project.isActive;

    const updated = await project.save();

    res.status(200).json({
      success: project.isActive,
      message: `Project ${
        updated.isActive ? "Activated" : "Deactivated"
      } successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling status",
      error,
    });
  }
};
