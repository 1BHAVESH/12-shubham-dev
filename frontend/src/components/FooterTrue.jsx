import { FormInputIcon, MailIcon, Phone } from "lucide-react";
import React from "react";
import whatsapp from "../assets/whatsapp.png";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import EnquiryDialog from "./EnquiryDialog";
import { Link, useNavigate } from "react-router-dom";

const FooterTrue = () => {
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl md:max-w-[1800px] mx-auto flex items-center justify-between py-3">

        {/* ENQUIRY */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer flex-1 justify-center">
          <FormInputIcon className="w-5" />
          <span className="font-semibold text-xs md:text-base">  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-sm lg:text-base font-medium hover:opacity-80 transition-opacity cursor-pointer">
                        Enquiry
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="hidden"></DialogTitle>
                      <DialogDescription className="hidden"></DialogDescription>
                      <EnquiryDialog />
                    </DialogContent>
                  </Dialog></span>
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-gray-300"></div>

        {/* CALL */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer flex-1 justify-center">
          <Phone className="w-5" />
          <Link
                      href="tel:+919024195195"
                      className="font-semibold text-xs md:text-base"
                    >
                      
                      <span>Call</span>
                    </Link>
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-gray-300"></div>

        {/* WHATSAPP */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer flex-1 justify-center">
          <img src={whatsapp} className="w-5" />
          <Link
                      href="https://api.whatsapp.com/send?phone=919024195195"
                      target="_blank"
                      className="font-semibold text-xs md:text-base"
                    >
                      
                      <span>Whatsapp</span>
                    </Link>
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-gray-300"></div>

        {/* CONTACT */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer flex-1 justify-center" onClick={() => navigate("/contact")}>
          <MailIcon className="w-5" />
          <Link
                      href="/contact"
                      target="_blank"
                      className="font-semibold text-xs md:text-base"
                    >
                      
                      <span>Contact</span>
                    </Link>
        </div>

      </div>
    </div>
  );
};

export default FooterTrue;
