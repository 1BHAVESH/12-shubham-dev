// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import About from "@/pages/About";
import RealEstateLanding from "@/pages/LandingPage";
import Layout from "@/layout/Layout";
import ContactForm from "@/pages/ContactPage";
import Projects from "@/pages/Projects";
import Media from "@/pages/Media";
import MissionAndVision from "@/pages/MissionAndVision";
// import TheFortJodhpur from "@/pages/TheFortJodhpur";
// import ShubhamParadise from "@/pages/ShubhamParadise";
import ScrollToTop from "@/components/ScrollTop";
// import ShubhVilla from "@/pages/ShubhVilla";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Careers from "@/pages/Careers";
import Media1 from "@/pages/Media1";
import Faq from "@/pages/Faq";
import ProjectDetail from "@/pages/ProjectDetail";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminRegister from "@/pages/admin/AdminRegister";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BannerManagement from "@/pages/admin/BannerManagement";
import ProjectManagement from "@/pages/admin/ProjectManagement";
import AdminLayout from "@/components/admin/AdminLayout";
import HomePage from "@/components/admin/HomePage";
import AboutShubhamDeveloper from "@/pages/AboutShubhamDeveloper";
import OurFounder from "@/pages/OurFounder";
import JoinVenture from "@/pages/JoinVenture";
import CarrerAdmin from "@/pages/admin/CareerAdmin";
import AdminFaq from "@/pages/admin/adminFaqs";
import PolicyEditor from "@/pages/admin/PrivecyPolicy";
import GeneralSettings from "@/pages/admin/GenralSettings";
import ProfileDropdown from "@/components/admin/AdminProfile";
import Profile from "@/pages/admin/Profile";
import ForgotPassword from "@/pages/admin/ForgotPassword";
import Enqiry from "@/pages/admin/Enqiry";

export default function AppRoutes() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        {/* COMMON LAYOUT WITH NAVBAR */}
        <Route element={<Layout />}>
          <Route path="/" element={<RealEstateLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/media" element={<Media />} />
          <Route path="/mission-&-vision" element={<MissionAndVision />} />
          {/* <Route path="/the-fort-jodhpur" element ={<TheFortJodhpur />} /> */}
          {/* <Route path="/Shubham-Paradise" element={<ShubhamParadise />} /> */}
          {/* <Route path="/Shubh-Villa" element={<ShubhVilla />} /> */}
          <Route path="/privacy-poicy" element={<PrivacyPolicy />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/medeia-2" element={<Media1 />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/about-shubham-developer" element={<AboutShubhamDeveloper />} />
          <Route path="/our-team" element={<OurFounder />} />
          <Route path="/join-venture" element={<JoinVenture />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />

        {/* <Route path="/admin/register" element={<AdminRegister />} /> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="home-page" element={<HomePage />} />
          <Route path="career" element={<CarrerAdmin />} />
          <Route path="faq" element={<AdminFaq />} />
          <Route path="privacy-policy" element={<PolicyEditor />} />
          <Route path="genral-settings" element={<GeneralSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="get-enquiry" element={<Enqiry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
