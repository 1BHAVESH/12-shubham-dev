import Career from "../models/Career.js";

export const getJobs = async(req, res) => {
  try {

    const getJobs = await Career.find()

    if(!getJobs){
       return res.status(400).json({
        status: false,
        message: "No Jobs",
      });
    }

    return res.status(200).json({
      status: true,
      data: getJobs
    });

    
    
  } catch (error) {
     console.error("Job Find Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

export const createCareer = async (req, res) => {
  try {
    const { jobTitle, places, positions } = req.body;

    // Validation
    if (!jobTitle || !places || !positions) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Insert into DB
    const newCareer = await Career.create({
      jobTitle,
      places,
      positions,
    });

    return res.status(201).json({
      status: true,
      message: "Career created successfully",
      data: newCareer,
    });
  } catch (error) {
    console.error("Create Career Error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle, places, positions } = req.body;

    // Validation
    if (!jobTitle || !places || !positions) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check existing document
    const existingCareer = await Career.findById(id);
    if (!existingCareer) {
      return res.status(404).json({
        status: false,
        message: "Career not found",
      });
    }

    // Update career (save for validation)
    existingCareer.jobTitle = jobTitle;
    existingCareer.places = places;
    existingCareer.positions = positions;

    await existingCareer.save();

    return res.status(200).json({
      status: true,
      message: "Career updated successfully",
      data: existingCareer,
    });

  } catch (error) {
    console.error("Update Career Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists
    const existingCareer = await Career.findById(id);

    if (!existingCareer) {
      return res.status(404).json({
        status: false,
        message: "Career not found",
      });
    }

    // Delete the job
    await Career.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Career deleted successfully",
    });

  } catch (error) {
    console.error("Delete Career Error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};



