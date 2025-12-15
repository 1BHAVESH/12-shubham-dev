import { Phone, Mail, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Separator } from "./ui/separator";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EnquiryDialog from "./EnquiryDialog";
import React, { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // Determine active nav based on current path
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/projects") return "projects";
    if (path === "/join-venture") return "Venture";
    if (path === "/contact") return "contact";
    if (path === "/about-shubham-developer" || path === "/our-team") return "about";
    return "";
  };

  const activeNav = getActiveNav();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Hide header at the very top
      if (currentScroll <= 10) {
        setShowHeader(false);
      }
      // Hide when scrolling up
      else if (currentScroll < lastScroll) {
        setShowHeader(false);
      }
      // Show when scrolling down
      else if (currentScroll > lastScroll && currentScroll > 100) {
        setShowHeader(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const leftMenuItems = [
    { name: "Projects", id: "projects", path: "/projects" },
  ];

  const rightMenuItems = [
    { name: "Join Venture", id: "Venture", path: "/join-venture" },
    { name: "Contact us", id: "contact", path: "/contact" },
  ];

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* TOP BLACK BAR */}
      <div className="bg-black text-[#d4af37] text-xs flex justify-between items-center px-3 sm:px-6 md:px-10 lg:px-20 xl:px-[145px] h-12 sm:h-14 overflow-hidden">
        {/* MOBILE CONTACT INFO */}
        <div className="flex md:hidden flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-3 text-[9px] sm:text-xs py-1">
          <Link
            to="tel:+919024195195"
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors whitespace-nowrap"
          >
            <Phone size={10} className="sm:w-3 sm:h-3" />
            <span>+91 9024195 195</span>
          </Link>
          <Link
            to="mailto:info@subhamdevelopers.com"
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors whitespace-nowrap"
          >
            <Mail size={10} className="sm:w-3 sm:h-3" />
            <span>info@subhamdevelopers.com</span>
          </Link>
        </div>

        {/* DESKTOP CONTACT INFO */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm">
          <Link
            to="tel:+919024195195"
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <Phone size={14} />
            <span className="hidden lg:inline">+91 9024195 195</span>
            <span className="inline lg:hidden">+91 902...</span>
          </Link>
          <Link
            to="mailto:info@subhamdevelopers.com"
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <Mail size={14} />
            <span className="hidden lg:inline">info@subhamdevelopers.com</span>
            <span className="inline lg:hidden">info@subham...</span>
          </Link>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="https://www.facebook.com/SubhamDevelopersJodhpur"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-colors"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              className="text-base sm:text-lg"
            />
          </Link>
          <Link
            to="https://www.instagram.com/subhamdeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-colors"
          >
            <FontAwesomeIcon
              icon={faSquareInstagram}
              className="text-base sm:text-lg"
            />
          </Link>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white w-full shadow-sm border-b">
        <div
          className="max-w-[1370px] h-20 sm:h-24 md:h-28 mx-auto 
      flex items-center justify-between px-3 sm:px-6 md:px-8 lg:px-10"
        >
          {/* LEFT MENU */}
          <ul className="hidden lg:flex gap-6 text-gray-700 text-base font-medium items-center">
            <li
              className={`cursor-pointer border-b-2 pb-1 transition-all whitespace-nowrap
            ${
              activeNav === "home"
                ? "border-[#d4af37] text-[#d4af37] font-semibold"
                : "border-transparent hover:border-[#d4af37] hover:text-[#d4af37]"
            }`}
            >
              <Link to="/">Home</Link>
            </li>

            {/* ABOUT - ShadCN Dropdown */}
            <li>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={`text-gray-700 hover:text-[#d4af37] text-base bg-transparent ${
                      activeNav === "about" ? "text-[#d4af37]" : ""
                    } data-[state=open]:text-[#d4af37]`}>
                      About us
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white rounded-md shadow-lg p-4 min-w-[250px]">
                      <ul className="flex flex-col gap-2">
                        <li>
                          <NavigationMenuLink
                            href="/about-shubham-developer"
                            className="block px-3 py-2 hover:bg-gray-100 rounded text-gray-700 hover:text-[#d4af37]"
                          >
                            About Shubham Developers
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            href="/our-team"
                            className="block px-3 py-2 hover:bg-gray-100 rounded text-gray-700 hover:text-[#d4af37]"
                          >
                            Our Founder
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>

            {leftMenuItems.map(({ name, id, path }) => (
              <li
                key={id}
                className={`cursor-pointer border-b-2 pb-1 transition-all whitespace-nowrap
            ${
              activeNav === id
                ? "border-[#d4af37] text-[#d4af37] font-semibold"
                : "border-transparent hover:border-[#d4af37] hover:text-[#d4af37]"
            }`}
              >
                <Link to={path}>{name}</Link>
              </li>
            ))}
          </ul>

          {/* CENTER LOGO */}
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 hidden lg:block"
          >
            <img
              src="/logo.png"
              className="h-20 w-auto object-contain"
              alt="Subham Developers"
            />
          </Link>

          {/* RIGHT MENU */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-6 text-gray-700 text-base font-medium">
              {rightMenuItems.map(({ name, id, path }) => (
                <li
                  key={id}
                  className={`cursor-pointer border-b-2 pb-1 transition-all whitespace-nowrap
              ${
                activeNav === id
                  ? "border-[#d4af37] text-[#d4af37] font-semibold"
                  : "border-transparent hover:border-[#d4af37] hover:text-[#d4af37]"
              }`}
                >
                  <Link to={path}>{name}</Link>
                </li>
              ))}
            </ul>

            {/* Enquiry Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer text-gray-700 text-base font-medium md:mb-1 hover:text-[#d4af37] transition-colors">
                  Enquiry
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="hidden"></DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
                <EnquiryDialog />
              </DialogContent>
            </Dialog>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center gap-3">
            <Sheet>
              <SheetTrigger>
                <Menu
                  size={24}
                  className="cursor-pointer text-gray-700 hover:text-[#d4af37] transition-colors"
                />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-white w-[280px] h-[550px]"
              >
                <SheetTitle className="hidden"></SheetTitle>
                <SheetHeader className="p-2 mr-[190px] h-[0px] mt-2">
                  <img
                    src="/logo.png"
                    alt="menu"
                    className="h-12 w-auto object-contain"
                  />
                  <SheetDescription className="hidden"></SheetDescription>
                </SheetHeader>

                {/* Mobile Menu Items */}
                <ul className="flex flex-col gap-1 text-gray-700 mt-4">
                  <li
                    className={`pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer ${
                      activeNav === "home" ? "text-[#d4af37] font-semibold" : ""
                    }`}
                    onClick={() => navigate("/")}
                  >
                    <Link to="/">Home</Link>
                  </li>
                  <Separator />

                  {/* About Section in Mobile */}
                  <li className="border-b border-gray-200 pb-2">
                    <div className={`pl-4 py-3 font-semibold ${
                      activeNav === "about" ? "text-[#d4af37]" : "text-gray-700"
                    }`}>About us</div>
                    <ul className="pl-8 space-y-2">
                      <li>
                        <Link
                          to="/about-shubham-developer"
                          className="block py-2 hover:text-[#d4af37] transition-colors"
                          onClick={() => navigate("/about-shubham-developer")}
                        >
                          About Shubham Developers
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/our-team"
                          className="block py-2 hover:text-[#d4af37] transition-colors"
                          onClick={() => navigate("/our-team")}
                        >
                          Our Founder
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li
                    className={`pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer ${
                      activeNav === "projects" ? "text-[#d4af37] font-semibold" : ""
                    }`}
                    onClick={() => navigate("/projects")}
                  >
                    <Link to="/projects">Projects</Link>
                  </li>
                  <Separator />

                  <li
                    className={`pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer ${
                      activeNav === "Venture" ? "text-[#d4af37] font-semibold" : ""
                    }`}
                    onClick={() => navigate("/join-venture")}
                  >
                    <Link to="/join-venture">Join Venture</Link>
                  </li>
                  <Separator />

                  <li
                    className={`pl-4 py-3 hover:bg-gray-50 hover:text-[#d4af37] transition-colors cursor-pointer ${
                      activeNav === "contact" ? "text-[#d4af37] font-semibold" : ""
                    }`}
                    onClick={() => navigate("/contact")}
                  >
                    <Link to="/contact">Contact us</Link>
                  </li>
                  <Separator />
                </ul>

                {/* Mobile Enquiry Button */}
                <div className="mt-6 px-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full bg-black text-[#d4af37] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors">
                        Enquiry
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="hidden"></DialogTitle>
                      <DialogDescription className="hidden"></DialogDescription>
                      <EnquiryDialog />
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}