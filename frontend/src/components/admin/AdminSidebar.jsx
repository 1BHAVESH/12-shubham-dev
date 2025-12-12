import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Image, FolderKanban, LogOut, Menu, X, HomeIcon, Briefcase, Newspaper, Settings, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Banners",
    path: "/admin/banners",
    icon: Image,
  },
  {
    name: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Home-Page",
    path: "/admin/home-page",
    icon: HomeIcon
  },
  {
    name: "Carrer",
    path: "/admin/career",
    icon: Briefcase
  },
  {
    name: "FAQs",
    path: "/admin/faq",
    icon: Briefcase
   
  },
  {
    name: "privecy-policy",
    path: "/admin/privacy-policy",
    icon: Newspaper
  },
  {
    name: "genral-setting",
    path: "/admin/genral-settings",
    icon: Settings
  },
  {
    name: "Enquiry",
    path: "/admin/get-enquiry",
    icon: MessageCircle
  }
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-[#d4af37]">Shubham Dev</h1>
        <p className="text-zinc-400 text-sm">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#d4af37] text-black"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
