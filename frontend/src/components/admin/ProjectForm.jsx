import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { Upload, X, FileText, Plus, Trash2, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/redux/features/adminApi";
import { toast } from "sonner";

// Import your images
import temple from "../../assets/temple.png";
// import bedminton from "../../assets/bedminton.jpg";
import swiming from "../../assets/swiming.png";
import cycleTrack from "../../assets/cycleTrack.png";
import walk from "../../assets/walk.png";
import yoga from "../../assets/yoga.png";
import gym from "../../assets/gym.png";
import hall from "../../assets/Hall.png";
import theater from "../../assets/theater.png";
import carromBoard from "../../assets/carromBoard.png";
import room from "../../assets/room.png";
import poolTable from "../../assets/poolTable.png";
import playground from "../../assets/playground.png";
import park from "../../assets/park.png";
import seniorCitizenArea from "../../assets/seniorCitizenArea.png";
import BornFire from "../../assets/BornFire.png";

// Predefined amenities with imported images
const PREDEFINED_AMENITIES = [
  { name: "Temple", image: temple },

  { name: "Swimming Pool", image: swiming },
  { name: "Cycle Track", image: cycleTrack },
  { name: "Walking Track", image: walk },
  { name: "Yoga Area", image: yoga },
  { name: "Gym", image: gym },
  { name: "Community Hall", image: hall },
  { name: "Theater", image: theater },
  { name: "Carrom Board", image: carromBoard },
  { name: "Game Room", image: room },
  { name: "Pool Table", image: poolTable },
  { name: "Playground", image: playground },
  { name: "Park", image: park },
  { name: "Senior Citizen Area", image: seniorCitizenArea },
  { name: "Bonfire Area", image: BornFire },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getImageUrl = (url) => {
  if (!url) return null;
  if (
    url.startsWith("data:") ||
    url.startsWith("http") ||
    url.startsWith("blob:")
  )
    return url;
  return `${API_URL}${url}`;
};

const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

export default function ProjectForm({ open, onOpenChange, project, length }) {
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Image states
  const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [overviewImagePreview, setOverviewImagePreview] = useState(null);
  const [selectedOverviewImage, setSelectedOverviewImage] = useState(null);
  const [masterPlanPreview, setMasterPlanPreview] = useState(null);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [buildingImagePreview, setBuildingImagePreview] = useState(null);
  const [selectedBuildingImage, setSelectedBuildingImage] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);

  // Amenity icon states - array to store icon for each amenity
  const [amenityIconPreviews, setAmenityIconPreviews] = useState([]);
  const [selectedAmenityIcons, setSelectedAmenityIcons] = useState([]);

  // Document states
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const [brochureName, setBrochureName] = useState(null);
  const [selectedPriceSheet, setSelectedPriceSheet] = useState(null);
  const [priceSheetName, setPriceSheetName] = useState(null);

  // Video states
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);

  // NEW: Predefined amenities selector states
  const [selectedPredefinedAmenities, setSelectedPredefinedAmenities] =
    useState([]);
  const [showCustomAmenity, setShowCustomAmenity] = useState(false);
  const [customAmenityName, setCustomAmenityName] = useState("");
  const [customAmenityIcon, setCustomAmenityIcon] = useState(null);
  const [customAmenityPreview, setCustomAmenityPreview] = useState(null);

  const isEditing = !!project;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      tagline: "",
      description: "",
      location: "",
      address: "",
      status: "ongoing",
      price: "",
      area: "",
      propertyTypes: "",
      contactNumber: "",
      videoUrl: "",
      mapEmbedUrl: "",
      isActive: true,
      isFeatured: false,
      order: 0,
      amenities: [],
      highlights: [],
      nearbyLocations: [],
    },
  });

  const {
    fields: amenityFields,
    append: appendAmenity,
    remove: removeAmenity,
  } = useFieldArray({ control, name: "amenities" });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({ control, name: "highlights" });

  const {
    fields: nearbyFields,
    append: appendNearby,
    remove: removeNearby,
  } = useFieldArray({ control, name: "nearbyLocations" });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || "",
        tagline: project.tagline || "",
        description: project.description || "",
        location: project.location || "",
        address: project.address || "",
        status: project.status || "ongoing",
        price: project.price || "",
        area: project.area || "",
        propertyTypes: project.propertyTypes || "",
        contactNumber: project.contactNumber || "",
        videoUrl: project.videoUrl || "",
        mapEmbedUrl: project.mapEmbedUrl || "",
        isActive: project.isActive ?? true,
        isFeatured: project.isFeatured ?? false,
        order: project.order || 0,
        amenities: project.amenities || [],
        highlights: project.highlights || [],
        nearbyLocations: project.nearbyLocations || [],
      });
      setImagePreview(getImageUrl(project.imageUrl));
      setLogoPreview(getImageUrl(project.logoUrl));
      setOverviewImagePreview(getImageUrl(project.overviewImageUrl));
      setMasterPlanPreview(getImageUrl(project.masterPlanImageUrl));
      setFloorPlanPreview(getImageUrl(project.floorPlanImageUrl));
      setBuildingImagePreview(getImageUrl(project.buildingImageUrl));

      const existingGallery = project.galleryImages || [];
      setExistingGalleryImages(existingGallery);
      setGalleryPreviews(existingGallery.map(getImageUrl));

      if (project.amenities && project.amenities.length > 0) {
        const iconPreviews = project.amenities.map((amenity) =>
          amenity.icon ? getImageUrl(amenity.icon) : null
        );
        setAmenityIconPreviews(iconPreviews);
        setSelectedAmenityIcons(new Array(project.amenities.length).fill(null));
      }

      setBrochureName(project.brochureUrl ? "Current Brochure" : null);
      setPriceSheetName(project.priceSheetUrl ? "Current Price Sheet" : null);

      if (project.videoFileUrl) {
        setVideoPreview(getImageUrl(project.videoFileUrl));
        setVideoFileName("Current Video");
      }
    } else {
      reset({
        title: "",
        tagline: "",
        description: "",
        location: "",
        address: "",
        status: "ongoing",
        price: "",
        area: "",
        propertyTypes: "",
        contactNumber: "",
        videoUrl: "",
        mapEmbedUrl: "",
        isActive: true,
        isFeatured: false,
        order: 0,
        amenities: [],
        highlights: [],
        nearbyLocations: [],
      });
      resetAllPreviews();
    }
    resetAllSelectedFiles();
    setSelectedPredefinedAmenities([]);
    setShowCustomAmenity(false);
  }, [project, reset]);

  const resetAllPreviews = () => {
    setImagePreview(null);
    setLogoPreview(null);
    setOverviewImagePreview(null);
    setMasterPlanPreview(null);
    setFloorPlanPreview(null);
    setBuildingImagePreview(null);
    setGalleryPreviews([]);
    setExistingGalleryImages([]);
    setDeletedGalleryImages([]);
    setAmenityIconPreviews([]);
    setBrochureName(null);
    setPriceSheetName(null);
    setVideoPreview(null);
    setVideoFileName(null);
  };

  const resetAllSelectedFiles = () => {
    setSelectedImage(null);
    setSelectedLogo(null);
    setSelectedOverviewImage(null);
    setSelectedMasterPlan(null);
    setSelectedFloorPlan(null);
    setSelectedBuildingImage(null);
    setSelectedGalleryImages([]);
    setSelectedAmenityIcons([]);
    setSelectedBrochure(null);
    setSelectedPriceSheet(null);
    setSelectedVideo(null);
  };

  const handleImageChange = (e, setPreview, setSelected) => {
    const file = e.target.files[0];
    if (file) {
      setSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAmenityIconChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAmenityIconPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);

      setSelectedAmenityIcons((prev) => {
        const newIcons = [...prev];
        newIcons[index] = file;
        return newIcons;
      });
    }
  };

  const removeAmenityIcon = (index) => {
    setAmenityIconPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
    setSelectedAmenityIcons((prev) => {
      const newIcons = [...prev];
      newIcons[index] = null;
      return newIcons;
    });
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedGalleryImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    const existingCount = existingGalleryImages.length;

    if (index < existingCount) {
      const imageToDelete = existingGalleryImages[index];
      setDeletedGalleryImages((prev) => [...prev, imageToDelete]);
      setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingCount;
      setSelectedGalleryImages((prev) =>
        prev.filter((_, i) => i !== newImageIndex)
      );
    }

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e, setSelected, setName) => {
    const file = e.target.files[0];
    if (file) {
      setSelected(file);
      setName(file.name);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Video file size must be less than 100MB");
        e.target.value = null;
        return;
      }

      const validTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid video file (MP4, WebM, OGG, MOV)");
        e.target.value = null;
        return;
      }

      setSelectedVideo(file);
      setVideoFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const removeVideo = () => {
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setSelectedVideo(null);
    setVideoFileName(null);
  };

  const handleAddAmenity = () => {
    appendAmenity({ icon: "", name: "" });
    setAmenityIconPreviews((prev) => [...prev, null]);
    setSelectedAmenityIcons((prev) => [...prev, null]);
  };

  const handleRemoveAmenity = (index) => {
    removeAmenity(index);
    setAmenityIconPreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedAmenityIcons((prev) => prev.filter((_, i) => i !== index));
  };

  // NEW: Toggle predefined amenity selection
  const togglePredefinedAmenity = (amenity) => {
    setSelectedPredefinedAmenities((prev) => {
      const exists = prev.find((a) => a.name === amenity.name);
      if (exists) {
        return prev.filter((a) => a.name !== amenity.name);
      } else {
        return [...prev, amenity];
      }
    });
  };

  // NEW: Handle custom amenity icon upload
  const handleCustomAmenityIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setCustomAmenityIcon(file);
      const reader = new FileReader();
      reader.onloadend = () => setCustomAmenityPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // NEW: Add custom amenity to predefined list
  const addCustomPredefinedAmenity = () => {
    if (!customAmenityName.trim()) {
      toast.error("Please enter amenity name");
      return;
    }
    if (!customAmenityIcon) {
      toast.error("Please upload an icon");
      return;
    }

    const customAmenity = {
      name: customAmenityName,
      image: customAmenityPreview,
      isCustom: true,
      customFile: customAmenityIcon,
    };

    setSelectedPredefinedAmenities((prev) => [...prev, customAmenity]);
    setCustomAmenityName("");
    setCustomAmenityIcon(null);
    setCustomAmenityPreview(null);
    setShowCustomAmenity(false);
  };

  // NEW: Remove predefined amenity
  const removePredefinedAmenity = (amenityName) => {
    setSelectedPredefinedAmenities((prev) =>
      prev.filter((a) => a.name !== amenityName)
    );
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", data.title);
      formData.append("tagline", data.tagline);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("address", data.address);
      formData.append("status", data.status);
      formData.append("price", data.price);
      formData.append("area", data.area);
      formData.append("propertyTypes", data.propertyTypes);
      formData.append("contactNumber", data.contactNumber);
      formData.append("videoUrl", data.videoUrl);
      formData.append("mapEmbedUrl", data.mapEmbedUrl);
      formData.append("isActive", data.isActive);
      formData.append("isFeatured", data.isFeatured);
      formData.append("order", data.order);

      // Combine predefined selected amenities with manual ones
      const predefinedAmenities = [];

      for (let i = 0; i < selectedPredefinedAmenities.length; i++) {
        const a = selectedPredefinedAmenities[i];

        if (a.isCustom) {
          // Custom amenities already have file
          formData.append("amenityIcons", a.customFile);
          formData.append("amenityIconIndexes", predefinedAmenities.length);

          predefinedAmenities.push({
            name: a.name,
            icon: null,
          });
        } else {
          // ⭐ PREDEFINED AMENITY FIX ⭐
          const file = await urlToFile(a.image, `${a.name}.png`);

          formData.append("amenityIcons", file);
          formData.append("amenityIconIndexes", predefinedAmenities.length);

          predefinedAmenities.push({
            name: a.name,
            icon: null, // backend will replace with /uploads/file
          });
        }
      }

      // Process manual amenities and upload their icons
      const manualAmenities = [];
      let manualAmenityIconOffset = predefinedAmenities.length;

      data.amenities.forEach((amenity, index) => {
        if (amenity.name && amenity.name.trim()) {
          // If there's an icon for this manual amenity
          if (selectedAmenityIcons[index]) {
            formData.append("amenityIcons", selectedAmenityIcons[index]);
            formData.append("amenityIconIndexes", manualAmenityIconOffset);
            manualAmenities.push({
              name: amenity.name.trim(),
              icon: null, // Will be replaced by backend with uploaded path
            });
            manualAmenityIconOffset++;
          } else if (isEditing && amenity.icon) {
            // Keep existing icon during edit
            manualAmenities.push({
              name: amenity.name.trim(),
              icon: amenity.icon,
            });
          }
          // Skip amenities without icons (they won't pass validation)
        }
      });

      const allAmenities = [...predefinedAmenities, ...manualAmenities];

      const filteredHighlights = data.highlights.filter(
        (h) => h.title && h.subtitle
      );
      const filteredNearbyLocations = data.nearbyLocations.filter(
        (n) => n.name
      );

      formData.append("amenities", JSON.stringify(allAmenities));
      formData.append("highlights", JSON.stringify(filteredHighlights));
      formData.append(
        "nearbyLocations",
        JSON.stringify(filteredNearbyLocations)
      );

      // Images
      if (selectedImage) formData.append("image", selectedImage);
      if (selectedLogo) formData.append("logo", selectedLogo);
      if (selectedOverviewImage)
        formData.append("overviewImage", selectedOverviewImage);
      if (selectedMasterPlan)
        formData.append("masterPlanImage", selectedMasterPlan);
      if (selectedFloorPlan)
        formData.append("floorPlanImage", selectedFloorPlan);
      if (selectedBuildingImage)
        formData.append("buildingImage", selectedBuildingImage);
      selectedGalleryImages.forEach((img) =>
        formData.append("galleryImages", img)
      );

      // Amenity icons for manually added
      selectedAmenityIcons.forEach((icon, index) => {
        if (icon) {
          formData.append(`amenityIcons`, icon);
          formData.append(`amenityIconIndexes`, index);
        }
      });

      // Custom amenity icons from predefined selector
      // selectedPredefinedAmenities.forEach((amenity, index) => {
      //   if (amenity.isCustom && amenity.customFile) {
      //     formData.append(`customAmenityIcons`, amenity.customFile);
      //     formData.append(`customAmenityIndexes`, index);
      //   }
      // });

      // Documents
      if (selectedBrochure) formData.append("brochure", selectedBrochure);
      if (selectedPriceSheet) formData.append("priceSheet", selectedPriceSheet);

      // Video
      if (selectedVideo) formData.append("video", selectedVideo);

      deletedGalleryImages.forEach((img) => {
        formData.append("deletedImages", img);
      });

      if (isEditing) {
        await updateProject({ id: project._id, formData }).unwrap();
        toast.success("Project updated successfully!");
      } else {
        await createProject(formData).unwrap();
        toast.success("Project created successfully!");
      }

      onOpenChange(false);
      reset();
      resetAllPreviews();
      resetAllSelectedFiles();
      setSelectedPredefinedAmenities([]);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const ImageUploadField = ({
    label,
    preview,
    setPreview,
    setSelected,
    required,
  }) => (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setSelected(null);
            }}
            className="absolute cursor-pointer top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
          <Upload className="w-6 h-6 text-zinc-400 mb-1" />
          <span className="text-zinc-400 text-xs">Click to upload</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setPreview, setSelected)}
          />
        </label>
      )}
    </div>
  );

  const PdfUploadField = ({ label, name, setSelected, setName }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {name ? (
        <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#d4af37]" />
            <span className="text-zinc-300 text-sm truncate max-w-[150px]">
              {name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setName(null);
            }}
            className="p-1 cursor-pointer text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
          <FileText className="w-5 h-5 text-zinc-400 mb-1" />
          <span className="text-zinc-400 text-xs">Upload PDF</span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handlePdfChange(e, setSelected, setName)}
          />
        </label>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:cursor-pointer bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#d4af37]">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("title", {
                    required: "Project title is required",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Title cannot be empty or spaces only",
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Enter project tagline"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("tagline", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Tagline cannot be empty or spaces only",
                  })}
                />
                {errors.tagline && (
                  <p className="text-red-500 text-sm">
                    {errors.tagline.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                {...register("description", {
                  required: "Project Description is required",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Description cannot be empty or spaces only",
                  onChange: (e) => {
                    const value = e.target.value;
                    const words = value.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 100) {
                      const limitedText = words.slice(0, 100).join(" ");
                      e.target.value = limitedText;
                    }
                    return e;
                  },
                })}
              />
              <p className="text-xs text-gray-400">
                {
                  (watch("description") || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length
                }
                /100 words
              </p>
              {errors?.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Address</Label>
                <Input
                  id="location"
                  placeholder="e.g., Jodhpur"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("location", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Location cannot be empty or spaces only",
                  })}
                />
                {errors?.location && (
                  <p className="text-red-500 text-xs">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Location</Label>
                <Input
                  id="address"
                  placeholder="Full address"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("address", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Address cannot be empty or spaces only",
                  })}
                />
                {errors?.address && (
                  <p className="text-red-500 text-xs">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full h-9 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                  {...register("status")}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="e.g., 50 Lakhs"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("price", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Price cannot be empty or spaces only",
                  })}
                />
                {errors?.price && (
                  <p className="text-red-500 text-xs">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  placeholder="e.g., 2000 sq ft"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("area", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Area cannot be empty or spaces only",
                  })}
                />
                {errors?.area && (
                  <p className="text-red-500 text-xs">{errors.area.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyTypes">Property Types</Label>
                <Input
                  id="propertyTypes"
                  placeholder="e.g., 2BHK, 3BHK"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("propertyTypes", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Property Types cannot be empty or spaces only",
                  })}
                />
                {errors?.propertyTypes && (
                  <p className="text-red-500 text-xs">
                    {errors.propertyTypes.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="text"
                  maxLength={10}
                  placeholder="Enter contact number"
                  className="bg-zinc-800 border-zinc-700"
                  {...register("contactNumber", {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Contact Number cannot be empty or spaces only",
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
                {errors?.contactNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#d4af37]">Images</h3>

            <div className="grid grid-cols-3 gap-4">
              <ImageUploadField
                label="Main Image"
                preview={imagePreview}
                setPreview={setImagePreview}
                setSelected={setSelectedImage}
                required
              />
              {/* <ImageUploadField
                label="Logo"
                preview={logoPreview}
                setPreview={setLogoPreview}
                setSelected={setSelectedLogo}
              /> */}
              <ImageUploadField
                label="Overview Image"
                preview={overviewImagePreview}
                setPreview={setOverviewImagePreview}
                setSelected={setSelectedOverviewImage}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <ImageUploadField
                label="Master Plan"
                preview={masterPlanPreview}
                setPreview={setMasterPlanPreview}
                setSelected={setSelectedMasterPlan}
              />
              <ImageUploadField
                label="Floor Plan"
                preview={floorPlanPreview}
                setPreview={setFloorPlanPreview}
                setSelected={setSelectedFloorPlan}
              />
              {/* <ImageUploadField
                label="Building Image"
                preview={buildingImagePreview}
                setPreview={setBuildingImagePreview}
                setSelected={setSelectedBuildingImage}
              /> */}
            </div>

            {/* Video Section */}
            <div className="space-y-2">
              <Label>Video File (Max 200MB)</Label>
              {videoPreview ? (
                <div className="space-y-2">
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 rounded-lg bg-black"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute cursor-pointer top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {videoFileName && (
                    <p className="text-zinc-400 text-sm">{videoFileName}</p>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
                  <Video className="w-6 h-6 text-zinc-400 mb-1" />
                  <span className="text-zinc-400 text-xs">
                    Upload video (MP4, WebM, OGG, MOV)
                  </span>
                  <span className="text-zinc-500 text-xs mt-1">
                    Max size: 200MB
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={handleVideoChange}
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (YouTube/External)</Label>
              <Input
                id="videoUrl"
                placeholder="Enter YouTube or video URL"
                className="bg-zinc-800 border-zinc-700"
                {...register("videoUrl")}
              />
              <p className="text-zinc-500 text-xs">
                You can upload a video file above OR provide a URL here
              </p>
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <div className="grid grid-cols-4 gap-2">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Gallery ${index}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute cursor-pointer top-1 right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
                  <Plus className="w-5 h-5 text-zinc-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#d4af37]">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              <PdfUploadField
                label="Brochure (PDF)"
                name={brochureName}
                setSelected={setSelectedBrochure}
                setName={setBrochureName}
              />
              <PdfUploadField
                label="Price Sheet (PDF)"
                name={priceSheetName}
                setSelected={setSelectedPriceSheet}
                setName={setPriceSheetName}
              />
            </div>
          </div>

          {/* NEW: Predefined Amenities Selector */}
          <div className="space-y-4">
            {/* <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#d4af37]">
                Select Amenities
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCustomAmenity(!showCustomAmenity)}
                className="bg-zinc-800 text-white hover:bg-zinc-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Custom
              </Button>
            </div> */}

            {/* Predefined Amenities Grid with Real Images */}
            <div className="grid grid-cols-4 gap-3">
              {PREDEFINED_AMENITIES.map((amenity) => {
                const isSelected = selectedPredefinedAmenities.some(
                  (a) => a.name === amenity.name
                );
                return (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => togglePredefinedAmenity(amenity)}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-[#d4af37] bg-[#d4af37]/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={amenity.image}
                          alt={amenity.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <span className="text-xs text-center text-white leading-tight">
                        {amenity.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity Form */}
            {showCustomAmenity && (
              <div className="p-4 bg-zinc-800 rounded-lg space-y-3 border border-[#d4af37]">
                <h4 className="text-sm font-semibold text-[#d4af37]">
                  Add Custom Amenity
                </h4>
                <div className="flex gap-3">
                  <Input
                    placeholder="Amenity Name"
                    value={customAmenityName}
                    onChange={(e) => setCustomAmenityName(e.target.value)}
                    className="flex-1 bg-zinc-900 border-zinc-700"
                  />
                  <div className="flex gap-2">
                    {customAmenityPreview ? (
                      <div className="relative w-12 h-12 border border-zinc-700 rounded overflow-hidden">
                        <img
                          src={customAmenityPreview}
                          alt="Custom"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomAmenityIcon(null);
                            setCustomAmenityPreview(null);
                          }}
                          className="absolute cursor-pointer -top-1 -right-1 p-0.5 bg-red-500 rounded-full"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-12 h-12 border-2 border-dashed border-zinc-700 rounded cursor-pointer flex items-center justify-center hover:border-[#d4af37]">
                        <Upload className="w-4 h-4 text-zinc-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCustomAmenityIconChange}
                        />
                      </label>
                    )}
                    <Button
                      type="button"
                      onClick={addCustomPredefinedAmenity}
                      className="bg-[#d4af37] text-black hover:bg-[#c4a137]"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Amenities Display */}
            {selectedPredefinedAmenities.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white">
                  Selected Amenities ({selectedPredefinedAmenities.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedPredefinedAmenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-full border border-[#d4af37]"
                    >
                      <img
                        src={amenity.image}
                        alt={amenity.name}
                        className="w-4 h-4 object-contain"
                      />
                      <span className="text-sm text-white">{amenity.name}</span>
                      <button
                        type="button"
                        onClick={() => removePredefinedAmenity(amenity.name)}
                        className="text-red-400 cursor-pointer hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Manual Amenities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#d4af37]">
                Or Add Amenities Manually
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAmenity}
                className="bg-[#d4af37] text-black hover:bg-[#c4a137] cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Amenity
              </Button>
            </div>
            {amenityFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-400">
                    Icon (35x28px)
                  </Label>
                  {amenityIconPreviews[index] ? (
                    <div className="relative w-[60px] h-[48px] border border-zinc-700 rounded bg-zinc-800 flex items-center justify-center">
                      <img
                        src={amenityIconPreviews[index]}
                        alt="Icon"
                        className="max-w-[35px] max-h-[28px] object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeAmenityIcon(index)}
                        className="absolute cursor-pointer -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-[60px] h-[48px] border-2 border-dashed border-zinc-700 rounded cursor-pointer hover:border-[#d4af37] transition-colors">
                      <Upload className="w-4 h-4 text-zinc-400" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAmenityIconChange(e, index)}
                      />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-zinc-400">Amenity Name</Label>
                  <Input
                    placeholder="Enter amenity name"
                    className="bg-zinc-800 border-zinc-700 mt-1"
                    {...register(`amenities.${index}.name`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAmenity(index)}
                  className="text-red-400 hover:text-red-300 mt-6"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Highlights Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#d4af37]">
                Highlights
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendHighlight({ title: "", subtitle: "" })}
                className="bg-[#d4af37] text-black hover:bg-[#c4a137] cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Highlight
              </Button>
            </div>
            {highlightFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Title (e.g., 2 & 3 BHK)"
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  {...register(`highlights.${index}.title`, {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Title cannot be empty or spaces only",
                  })}
                />
                <Input
                  placeholder="Subtitle (e.g., Apartments)"
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  {...register(`highlights.${index}.subtitle`, {
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Subtitle cannot be empty or spaces only",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHighlight(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Nearby Locations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#d4af37]">
                Nearby Locations
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendNearby({ name: "", distance: "3.5 KM" })}
                className="bg-[#d4af37] text-black hover:bg-[#c4a137] cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Location
              </Button>
            </div>
            {nearbyFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Location name"
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  {...register(`nearbyLocations.${index}.name`, {
                    required: "Location is required",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Location cannot be empty or spaces only",
                  })}
                />
                <Input
                  placeholder="Distance (e.g., 3.5 KM)"
                  className="bg-zinc-800 border-zinc-700 w-32"
                  {...register(`nearbyLocations.${index}.distance`, {
                    required: "Distance is required",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Distance cannot be empty or spaces only",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNearby(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#d4af37]">
              Additional Settings
            </h3>
            <div className="space-y-2">
              <Label htmlFor="mapEmbedUrl">Map Embed URL</Label>
              <Input
                id="mapEmbedUrl"
                placeholder="Google Maps embed URL"
                className="bg-zinc-800 border-zinc-700"
                {...register("mapEmbedUrl", {
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Map URL cannot be empty or spaces only",
                })}
              />
              {errors.mapEmbedUrl && (
                <p className="text-red-500 text-sm">
                  {errors.mapEmbedUrl.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  min="0"
                  max={length}
                  className="bg-zinc-800 border-zinc-700"
                  {...register("order", {
                    valueAsNumber: true,
                    validate: (value) =>
                      value >= 0 || "Order cannot be negative",
                  })}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#d4af37] text-black hover:bg-[#c4a137] cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#d4af37] text-black hover:bg-[#c4a137] cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span>{isEditing ? "Update Project" : "Create Project"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
