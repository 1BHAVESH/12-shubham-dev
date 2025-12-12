import LatestCard from "@/components/LatestCard";
import MediaCard from "@/components/MediaCard";
import carimg from "../assets/Screenshot_3.png";
import CommomImg from "@/components/CommonBackgroundImg";
import subhamDeveloper from "../assets/image 28.png";
import calender from "../assets/Calendar.png";

const Media = () => {
  const mediaData = [
    {
      id: 1,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 2,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome...",
      date: "Dec 17, 2025",
    },
    {
      id: 3,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome...",
      date: "Dec 17, 2025",
    },
    {
      id: 4,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 5,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome...",
      date: "Dec 17, 2025",
    },
    {
      id: 6,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome...",
      date: "Dec 17, 2025",
    },
  ];

  // ARTICLE DATA (h2 + paragraph)
  const articleData = [
    {
      id: 1,
      title: "Build Your Future With Us: Why a Career in Real Estate is the Right Choice",
      content: `The real estate industry is one of the fastest-growing sectors in India,
      offering countless opportunities for individuals who want a rewarding and dynamic career.
      At [Your Company Name], we believe that our people are the foundation of our success.
      As we build homes, communities, and investment opportunities, we are equally
      committed to building strong careers for talented professionals. Whether you're
      passionate about sales, marketing, engineering, customer service, or project
      management — the real estate industry has a place for you.`
    }
  ];

  return (
    <>
      <CommomImg page="Media" />

      {/* IMAGE SECTION */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <AboutSection />
      </section>

      {/* ARTICLE + SIDEBAR */}
      <section className="max-w-6xl mx-auto px-4 mb-5">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT ARTICLE USING MAP */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <img src={calender} className="w-4 h-4 object-contain" />
                <span className="text-sm text-gray-700">
                  {"Dec 17, 2025"}
                </span>
              </div>

              <p className="text-sm text-gray-700">your name...</p>
            </div>

            {/* Article Mapping */}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {articleData.map((item) => (
              <div key={item.id}>
                <h2 className="text-2xl font-semibold mb-4 mt-5">{item.title}</h2>
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR - LATEST POSTS */}
          <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
            <h3 className="text-[16px] font-medium mb-4 mt-5">Latest Posts</h3>
            <div className="flex flex-col gap-4">
              {mediaData.map((item) => (
                <LatestCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Media;


import bgImg from "../assets/men-with-building.png";    // CHANGE PATH
import subhamLogo from "./../../public/logo.png";
import person1 from "../assets/men-with-building.png";
import person2 from "../assets/men-with-building.png";
import person3 from "../assets/men-with-building.png";
import person4 from "../assets/men-with-building.png";

 function AboutSection() {
  const people = [
    { img: person1, name: "Sheshmal Sanklecha", text: "With 25 years of experience in the Real Estate & Finance sectors..." },
    { img: person2, name: "Dhansukh Sanklecha", text: "Has 4 years of RE experience & 10 years in Finance..." },
    { img: person3, name: "Kantilal Jain", text: "With 4 years of RE experience & 20 years in Agro industries..." },
    { img: person4, name: "Mahaveer Kumar Jain", text: "2 years of RE experience & 10 years in Agro industries..." },
  ];

  return (
   <section className="max-w-7xl mx-auto my-10 bg-white shadow-lg rounded-2xl overflow-hidden">
  {/* MAIN FLEX LAYOUT */}
  <div className="flex flex-col lg:flex-row w-full">
    {/* LEFT SIDE – ABOUT GROUP with Background Image */}
    <div
      className="w-full lg:w-1/2 relative bg-cover bg-center p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-4"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(201,169,97,0.3) 40%, rgba(201,169,97,0.95) 100%), url(${bgImg})`,
      }}
    >
      {/* White box for logo - positioned top left */}
      <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md inline-block w-fit h-fit sm:h-[105px] mb-4 sm:mb-8">
        <img src={subhamLogo} alt="logo" className="w-24 sm:w-32 h-auto" />
      </div>

      {/* Content positioned on the right side */}
      <div className="w-full sm:ml-auto sm:w-[55%]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-3 sm:mb-4 text-gray-900 leading-tight">
          About Group
        </h2>

        <p className="text-[10px] sm:text-[9px] md:text-[10px] leading-relaxed text-gray-900 text-justify">
          At Subham Developers, we are committed to offer the best
          full-service Real Estate and Infrastructure Development. We aim at
          fulfilling one's dream into reality with our professional
          approach, timely delivery and commitment to excellent service.
          Since its inception, we have focused on creating unmatched luxury
          spaces with top-notch quality for our clients that surpasses our
          customer's aspirations. The house of Subham Developers is a blend
          of experience and a dedicated team to create spaces that offer
          natural light, air and aesthetically pleasing designs. Our work
          doesn't end with building a home, quality check-points are
          installed at every level to ensure the best results. The company
          is setting new standards in the real estate industry by creating
          quality-driven projects through our client's trusts.
        </p>
      </div>
    </div>

    {/* RIGHT SIDE – VISIONARIES */}
    <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 bg-white flex flex-col">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-gray-900 mb-6 sm:mb-8 lg:mb-10 leading-tight">
        The Visionaries
      </h2>

      {/* PEOPLE GRID - Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Person 1 - Sheshmal Sanklecha */}
        <div className="flex flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              className="w-20 sm:w-24 lg:w-28 h-16 sm:h-20 lg:h-24 object-cover object-top rounded-lg mb-2"
              src={person1}
              alt="Sheshmal Sanklecha"
            />
            <h3 className="font-semibold text-xs text-gray-900">
              Sheshmal
            </h3>
            <h3 className="font-semibold text-xs text-gray-900">
              Sanklecha
            </h3>
          </div>
          <p className="text-[110px] sm:text-[8px] lg:text-[9px] leading-relaxed text-gray-700 flex-1">
            With 25 years of experience in the Property Business along with
            30 years in the building industry, Mr. Sheshmal Sanklecha is the
            force behind The Fort. It's his dream project that will elevate
            the lifestyle of people.
          </p>
        </div>

        {/* Person 2 - Dhansukh Sanklecha */}
        <div className="flex flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              className="w-20 sm:w-24 lg:w-28 h-16 sm:h-20 lg:h-24 object-cover object-top rounded-lg mb-2"
              src={person1}
              alt="Dhansukh Sanklecha"
            />
            <h3 className="font-semibold text-xs text-gray-900">
              Dhansukh
            </h3>
            <h3 className="font-semibold text-xs text-gray-900">
              Sanklecha
            </h3>
          </div>
          <p className="text-[9px] sm:text-[8px] lg:text-[9px] leading-relaxed text-gray-700 flex-1">
            With 25 years of experience in the Property Business along with
            30 years in the building industry, Mr. Sheshmal Sanklecha is the
            force behind The Fort. It's his dream project that will elevate
            the lifestyle of people.
          </p>
        </div>

        {/* Person 3 - Kantilal Jain */}
        <div className="flex flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              className="w-20 sm:w-24 lg:w-28 h-16 sm:h-20 lg:h-24 object-cover object-top rounded-lg mb-2"
              src={person1}
              alt="Kantilal Jain"
            />
            <h3 className="font-semibold text-xs text-gray-900">
              Kantilal Jain
            </h3>
          </div>
          <p className="text-[9px] sm:text-[8px] lg:text-[9px] leading-relaxed text-gray-700 flex-1">
            With 25 years of experience in the Property Business along with
            30 years in the building industry, Mr. Sheshmal Sanklecha is the
            force behind The Fort. It's his dream project that will elevate
            the lifestyle of people.
          </p>
        </div>

        {/* Person 4 - Mahaveer Kumar Jain */}
        <div className="flex flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              className="w-20 sm:w-24 lg:w-28 h-16 sm:h-20 lg:h-24 object-cover object-top rounded-lg mb-2"
              src={person1}
              alt="Mahaveer Kumar Jain"
            />
            <h3 className="font-semibold text-xs text-gray-900">
              Mahaveer
            </h3>
            <h3 className="font-semibold text-xs text-gray-900">
              Kumar Jain
            </h3>
          </div>
          <p className="text-[9px] sm:text-[8px] lg:text-[9px] leading-relaxed text-gray-700 flex-1">
            With 25 years of experience in the Property Business along with
            30 years in the building industry, Mr. Sheshmal Sanklecha is the
            force behind The Fort. It's his dream project that will elevate
            the lifestyle of people.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
