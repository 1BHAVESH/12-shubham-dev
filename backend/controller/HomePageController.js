import HomePage from "../models/HomePage.js";
import fs from "fs";
import path from "path";

export const getHomePage = async (req, res) => {
  try {
    const data = await HomePage.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Home Page data" });
  }
};




function saveBase64Image(base64) {
  if (!base64 || !base64.startsWith("data")) return base64;

  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  const ext = matches[1].split("/")[1];
  const data = matches[2];

  const fileName = Date.now() + "." + ext;
  const filePath = path.join("uploads", fileName);

  fs.writeFileSync(filePath, Buffer.from(data, "base64"));

  return "/uploads/" + fileName;
}



const deleteOldFile = (dbPath) => {
  if (!dbPath) return;

  const cleanPath = dbPath.startsWith("/")
    ? dbPath.slice(1)
    : dbPath;

  // final absolute path WITHOUT double backend
  const absolutePath = path.join(process.cwd(), cleanPath);

  // console.log("TRY DELETE:", absolutePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    // console.log("Deleted:", absolutePath);
  } else {
    console.log("File Not Found:", absolutePath);
  }
};


export const createOrUpdateHomePage = async (req, res) => {
  try {
    const body = req.body;

    let homePage = await HomePage.findOne();
    const oldData = homePage ? homePage.toObject() : null;

    // --------------------------
    // ABOUT IMAGE UPDATE HANDLER
    // --------------------------
    if (body.about && body.about.image) {
      const newImg = body.about.image;

      // agar **new image base64** ho → means update ho rahi hai
      if (newImg.startsWith("data")) {
        const savedImg = saveBase64Image(newImg);

        // old image delete
        if (oldData?.about?.image) {
          console.log("OLD IMAGE FROM DB:", oldData?.about?.image);

          deleteOldFile(oldData.about.image);
        }

        body.about.image = savedImg;
      }
    }

    // --------------------------
    // TESTIMONIALS IMAGE UPDATE
    // --------------------------
    if (body.testimonials) {
      let testimonials = body.testimonials;

      if (typeof testimonials === "string") {
        testimonials = JSON.parse(testimonials);
      }

      body.testimonials = testimonials.map((t, i) => {
        const newPhoto = t.photo;

        if (newPhoto?.startsWith("data")) {
          const saved = saveBase64Image(newPhoto);

          // old delete if exists
          if (oldData?.testimonials?.[i]?.photo) {
            deleteOldFile(oldData.testimonials[i].photo);
          }

          return { ...t, photo: saved };
        }

        return t;
      });
    }

    // --------------------------
    // CREATE / UPDATE
    // --------------------------
    if (!homePage) {
      homePage = new HomePage(body);
      await homePage.save();
      return res.json({ message: "Home Page Created", data: homePage });
    }

    const updated = await HomePage.findOneAndUpdate({}, body, { new: true });
    res.json({ message: "Home Page Updated", data: updated });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", error: error.message });
  }
};





export const addTestimonial = async (req, res) => {
  try {
    const home = await HomePage.findOne();
    home.testimonials.push(req.body);
    await home.save();

    res.json({ message: "Testimonial Added", home });
  } catch (error) {
    res.status(500).json({ message: "Error adding testimonial" });
  }
};


export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const home = await HomePage.findOne();
    home.testimonials = home.testimonials.filter(t => t._id.toString() !== id);

    await home.save();
    res.json({ message: "Testimonial Deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial" });
  }
};
