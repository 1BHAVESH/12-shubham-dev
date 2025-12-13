import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="w-10 h-10 rounded-full border border-zinc-700 cursor-pointer bg-[#d4af37] flex items-center justify-center text-black font-bold text-lg">
          S
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-zinc-900 text-white border border-zinc-700"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/admin/profile")}
        >
          <User className="w-4 h-4 mr-2" /> Profile
        </DropdownMenuItem>

        
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-400 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}