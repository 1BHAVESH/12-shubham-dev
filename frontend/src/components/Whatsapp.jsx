import { Link } from "react-router-dom";
import whatsapp from "../assets/whatsapp.png";

const FloatingWhatsapp = () => {
  return (
    <Link
      href="https://api.whatsapp.com/send?phone=919024195195" // 👈 Apna number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-5 z-50 bg-green-500 p-3 rounded-full shadow-xl hover:scale-110 transition-all"
    >
      <img src={whatsapp} alt="WhatsApp" className="w-10 h-10 text-white" />
    </Link>
  );
};

export default FloatingWhatsapp;
