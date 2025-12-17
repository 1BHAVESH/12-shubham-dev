// components/Footer.jsx
import {
  faFacebook,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Facebook, Instagram } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import footerlogo from "../assets/footer-logo-2.png"
import { useGetProjectTitleQuery } from "@/redux/features/shubamdevApi";
import { useGetGeneralSettingQueryQuery } from "@/redux/features/adminApi";

export default function Footer() {

   const navigate = useNavigate()

  const {data, isLoading} = useGetProjectTitleQuery()
  const {data: genralData, isLoading: genralIsLoading} = useGetGeneralSettingQueryQuery()

  if(isLoading) return <h1>wait...</h1>
  if(genralIsLoading) return <h1>wait...</h1>

  const titles = data?.titles || []

  // console.log("titles",titles)

 

  // console.log("33333333",data)

  console.log(genralData)



  return (
  <footer className="bg-[#1a1a1a] text-gray-300 pt-12 pb-24">
  {/* TOP SECTION */}
  <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
    {/* LINKS GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {/* Logo Section */}
      <div className="flex flex-col">
        <img src={footerlogo} className="w-[120px] h-[55px]" alt="logo" />
        <p className="text-sm leading-relaxed mt-4 max-w-[200px]">
          Subham Developers is a real estate and construction company known
          for delivering quality residential and commercial projects.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-semibold text-white mb-4 text-base">
          Quick Links
        </h4>
        <ul className="space-y-2.5 text-sm">
          <li
            onClick={() => navigate("/contact")}
            className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
          >
            Contact
          </li>
          <li
            onClick={() => navigate("/privacy-poicy")}
            className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
          >
            Privacy Policy
          </li>
          <li
            onClick={() => navigate("/careers")}
            className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
          >
            Carrers
          </li>
          <li
            onClick={() => navigate("/faq")}
            className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
          >
            FAQs
          </li>
           {/* <li
            onClick={() => navigate("/medeia-2")}
            className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
          >
            media2
          </li> */}
        </ul>
      </div>

      {/* Projects */}
      <div>
        <h4 className="font-semibold text-white mb-4 text-base">Projects</h4>
        <ul className="space-y-2.5 text-sm">
          {
            titles && titles.map((item)=>(
              <li
              key={item._id}  
              onClick={() => navigate(`/project/${item._id}`)}
              className="cursor-pointer hover:text-[#d4af37] transition-colors duration-200"
            >
              {item.title}
            </li>
            ))
          }
          
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="font-semibold text-white mb-4 text-base">Live Support</h4>

        <div className="space-y-3 text-sm mb-5">
          <Link
            to={`mailto:${genralData?.data?.email}`}
            className="block hover:text-[#d4af37] transition-colors duration-200"
          >
            {genralData?.data?.email || ""}
          </Link>

          <Link 
            to={`tel:+91${genralData?.data?.phone}`}
            className="block hover:text-[#d4af37] transition-colors duration-200"
          >
            +91 {genralData?.data?.phone || "9024195195"}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">Follow Us</span>
          <div className="flex gap-3">
            <Link
              to={genralData?.data?.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-xl hover:text-[#d4af37] transition-colors duration-200"
              />
            </Link>

            <Link
              to={genralData?.data?.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon
                icon={faSquareInstagram}
                className="text-xl hover:text-[#d4af37] transition-colors duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* BOTTOM BAR */}
  <div className="border-t pt-5 border-gray-700 text-center text-xs text-gray-400">
    <p>{genralData?.data.copyright || "All rights reserved © Subham Developers"}</p>
  </div>
</footer>

  );
}
