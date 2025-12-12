import { useNavigate } from "react-router-dom";
import EnquiryDialog from "./EnquiryDialog";
import { useGetProjectsQuery } from "@/redux/features/adminApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

export default function Projects() {
  const navigate = useNavigate();
  const { data: projectsData, isLoading } = useGetProjectsQuery();
  const allProjects = projectsData?.data || [];
  
  // Filter only active projects
  const projects = allProjects.filter(project => project.isActive !== false);

  // console.log(projects);

  if (isLoading) {
    return (
      <section className="max-w-[1370px] mx-auto px-6 lg:px-12 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-48 mb-4 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  // Show grid layout for exactly 4 projects
  if (projects.length === 4) {
    return (
      <section className="max-w-[1370px] mx-auto px-6 lg:px-12 py-16">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="h-1 w-5 bg-yellow-500"></div>
            <p className="font-bold text-[24px]">Projects</p>
          </div>
          <h2 className="text-3xl md:text-2xl font-normal">Featured Projects</h2>
        </div>

        {/* 2x2 Grid for 4 projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
            >
              <img
                onClick={() => navigate(`/project/${project._id}`)}
                src={`${API_URL}${project.imageUrl}`}
                alt={project.title}
                className="w-full h-[380px] object-cover cursor-pointer"
              />

              {/* Content overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-5 flex items-end justify-between">
                <div onClick={() => navigate(`/project/${project._id}`)} className="cursor-pointer">
                  <h3 className="text-xl font-semibold hover:underline mb-1 text-black">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#d4af37] hover:underline">
                    {project.location}
                  </p>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                  {project.brochureUrl && (
                    <Button
                      className="bg-[#d4af37] cursor-pointer hover:bg-[#c29d2f] text-white font-normal text-base px-8 py-3 rounded-full"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `${API_URL}${project.brochureUrl}`;
                        link.download = project.title;
                        link.click();
                      }}
                    >
                      Download
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-black cursor-pointer text-[#d4af37] font-normal px-8 py-3 rounded-full text-base hover:bg-gray-900">
                        Enquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <EnquiryDialog selectedProject={project.title} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show horizontal layout if more than 4 projects
  if (projects.length > 4) {
    return (
      <section className="max-w-[1370px] mx-auto px-6 lg:px-12 py-16">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="h-1 w-5 bg-yellow-500"></div>
            <p className="font-bold text-[24px]">Projects</p>
          </div>
          <h2 className="text-3xl md:text-2xl font-normal">Featured Projects</h2>
        </div>

        {/* Horizontal scrolling container with hidden scrollbar */}
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
          <div className="flex gap-6 pb-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[320px] sm:w-[380px]"
              >
                <img
                  onClick={() => navigate(`/project/${project._id}`)}
                  src={`${API_URL}${project.imageUrl}`}
                  alt={project.title}
                  className="w-full h-[280px] object-cover cursor-pointer"
                />
                <div className="p-4 flex flex-col gap-3">
                  <div onClick={() => navigate(`/project/${project._id}`)} className="cursor-pointer">
                    <h3 className="text-lg font-semibold hover:underline">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#d4af37] hover:underline">
                      {project.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {project.brochureUrl && (
                      <Button
                        className="bg-[#d4af37] cursor-pointer hover:bg-yellow-600 text-sm flex-1"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = `${API_URL}${project.brochureUrl}`;
                          link.download = project.title;
                          link.click();
                        }}
                      >
                        Download
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-black cursor-pointer text-[#d4af37] px-6 py-1 rounded-full text-sm flex-1">
                          Enquiry
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <EnquiryDialog selectedProject={project.title} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom CSS to hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    );
  }

  // Original layout for 5 or fewer projects
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1, 3);

  return (
    <section className="max-w-[1370px] mx-auto px-6 lg:px-12 py-16">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <div className="h-1 w-5 bg-yellow-500"></div>
          <p className="font-bold text-[24px]">Projects</p>
        </div>
        <h2 className="text-3xl md:text-2xl font-normal">Featured Projects</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE - BIG PROJECT */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            <img
              onClick={() => navigate(`/project/${featuredProject._id}`)}
              src={`${API_URL}${featuredProject.imageUrl}`}
              alt={featuredProject.title}
              className="w-full h-[420px] sm:h-[300px] md:h-[380px] lg:h-[550px] object-cover cursor-pointer"
            />

            <div className="p-4 mt-0 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer">
              <div onClick={() => navigate(`/project/${featuredProject._id}`)}>
                <h3 className="text-lg sm:text-xl font-semibold hover:underline">
                  {featuredProject.title}
                </h3>
                <p className="text-sm sm:text-base text-[#d4af37] hover:underline">
                  {featuredProject.location}
                </p>
              </div>

              <div className="flex gap-2">
                {featuredProject.brochureUrl && (
                  <Button
                    className="bg-[#d4af37] cursor-pointer hover:bg-yellow-600 text-sm sm:text-base"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = `${API_URL}${featuredProject.brochureUrl}`;
                      link.download = featuredProject.title;
                      link.click();
                    }}
                  >
                    Download
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#d4af37] cursor-pointer hover:bg-yellow-600 text-sm sm:text-base">
                      Enquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <EnquiryDialog selectedProject={featuredProject.title} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – OTHER PROJECTS */}
        <div className="lg:w-1/2 w-full flex flex-col gap-6">
          {otherProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                onClick={() => navigate(`/project/${project._id}`)}
                src={`${API_URL}${project.imageUrl}`}
                alt={project.title}
                className="w-full h-[220px] sm:h-[300px] md:h-[320px] lg:h-[240px] object-cover cursor-pointer"
              />
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer">
                <div onClick={() => navigate(`/project/${project._id}`)}>
                  <h3 className="text-lg sm:text-xl font-semibold hover:underline">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#d4af37] hover:underline">
                    {project.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  {project.brochureUrl && (
                    <Button
                      className="bg-[#d4af37] cursor-pointer hover:bg-yellow-600 text-sm sm:text-base"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `${API_URL}${project.brochureUrl}`;
                        link.download = project.title;
                        link.click();
                      }}
                    >
                      Download
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#d4af37] cursor-pointer hover:bg-yellow-600 text-sm sm:text-base">
                        Enquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <EnquiryDialog selectedProject={project.title} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}