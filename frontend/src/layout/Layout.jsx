// src/layout/Layout.jsx
import Footer from "@/components/Footer";
import FooterTrue from "@/components/FooterTrue";
import Header from "@/components/Navbar";
import FloatingWhatsapp from "@/components/Whatsapp";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />   {/* Page content yaha change hoga */}
      <Footer />
      <FooterTrue />
      <FloatingWhatsapp />
    </>
  );
}
