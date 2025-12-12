import React from 'react'
import hero from "../assets/the fort jodhpur.png";
import hero2 from "../assets/shubham paradise.png";
import pdf1 from "../assets/Brochure The Fort Jodhpur.pdf"
import pdf2 from "../assets/Brochure Shubham Paradise-I.pdf"

const ProjectsImgAndPdf = () => {
    const projects = [
        {
          img: hero,
          title: "The Fort Jodhpur",
          location: "Near AIIMS Hospital, Jodhpur(Raj.)",
          pdf: pdf1
        },
        {
          img: hero2,
          title: "Shubham Paradise",
          location: "Tagore Nagar, Opp. Circuit House Pali Rajasthan",
          pdf: pdf2
        }
      ];
    
      const handleDownload = (file) => {
          // window.open(file, "_blank");
      const link = document.createElement("a");
      link.href = file;
      link.download = file.split("/").pop(); // filename auto detect ho jayega
      link.click();
    };
  return (
    <div>
        {/* GRID */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:mr-40">
  {projects.map((project, idx) => (
    <div
      key={idx}
      className="bg-white sm:w-[547px] rounded-xl shadow-md overflow-hidden mb-13 h-[365px]"
    >
      <img
        src={project.img}
        alt={project.title}
        className="w-full h-[284px] object-cover"
      />

      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {project.title}
          </h3>
          <p className="text-sm text-[#d4af37] mt-1">{project.location}</p>
        </div>

        {/* 👉 Download Button */}
        <button
          // project.pdf key hona chahiye
          onClick={() => handleDownload(project.pdf)} 
          className="px-3 cursor-pointer py-1 bg-[#d4af37] text-white text-sm rounded-md hover:bg-yellow-600"
        >
          Download
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  )
}

export default ProjectsImgAndPdf
