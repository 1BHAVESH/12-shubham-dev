import { Link } from "react-router-dom";
import whatsapp from "../assets/whatsapp.png";
import { useGetGeneralSettingQueryQuery } from "@/redux/features/adminApi";

const FloatingWhatsapp = () => {
    const { data, isSuccess, isLoading } = useGetGeneralSettingQueryQuery();

    if(isLoading) return <h1>Loading...</h1>
  
  return (
    <Link
      to={`https://api.whatsapp.com/send?phone=91${data?.data?.whatsappMobile}`} // 👈 Apna number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-5 z-50 bg-green-500 p-3 rounded-full shadow-xl hover:scale-110 transition-all"
    >
      <img src={whatsapp} alt="WhatsApp" className="w-10 h-10 text-white" />
    </Link>
  );
};

export default FloatingWhatsapp;
