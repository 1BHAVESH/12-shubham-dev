import { Image, FolderKanban, TrendingUp, Eye } from "lucide-react";
import { useGetBannersQuery, useGetProjectsQuery, useGetViewAnalyticsQuery } from "@/redux/features/adminApi";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: bannersData } = useGetBannersQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: viewsData } = useGetViewAnalyticsQuery();

  const bannerCount = bannersData?.data?.length || 0;
  const projectCount = projectsData?.data?.length || 0;

  // ⭐ Extract Website Views from API
  const websiteViews = viewsData?.views?.websiteCount || 0;

  const stats = [
    {
      name: "Total Banners",
      value: bannerCount,
      icon: Image,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Total Projects",
      value: projectCount,
      icon: FolderKanban,
      color: "bg-green-500/20 text-green-400",
    },
    {
      name: "Website Views",
      value: websiteViews, // ⭐ REAL DATA HERE
      icon: Eye,
      color: "bg-orange-500/20 text-orange-400",
    },
  ];

  console.log(viewsData)

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/banners"
              className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <Image className="w-5 h-5 text-[#d4af37]" />
              <span className="text-white">Manage Banners</span>
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <FolderKanban className="w-5 h-5 text-[#d4af37]" />
              <span className="text-white">Manage Projects</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
     
      </div>
    </div>
  );
}
