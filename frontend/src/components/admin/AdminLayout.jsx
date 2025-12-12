import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ProfileDropdown from "./AdminProfile";


export default function AdminLayout() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* ⭐ Top Navbar */}
        <header className="w-full flex justify-end items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <ProfileDropdown />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
