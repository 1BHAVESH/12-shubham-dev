import React, { useState } from "react";
import CommomImg from "@/components/CommonBackgroundImg";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import HeroImage from "@/components/HeroImage";
import { useGetFaqQuery } from "@/redux/features/shubamdevApi";

const Faq = () => {
  const { data, isLoading } = useGetFaqQuery();
  const [openItem, setOpenItem] = useState("");
  const [visible, setVisible] = useState(true);

  if (isLoading) return <h1>wait...</h1>;

  const faqList = data?.data || [];

  return (
    <div>
      {/* HERO SECTION */}
      <div className="relative">
        <HeroImage visible={visible} setVisible={setVisible} />
        <div className="absolute inset-0 bg-black/40"></div>

        <div
          className={`${
            visible
              ? "absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] text-center w-full px-4 pointer-events-none"
              : "hidden"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
            FAQs
          </h2>

          <div className="flex items-center justify-center mt-3 sm:mt-4 mx-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>

            <div className="h-[1.5px] sm:h-[2px] bg-white flex-grow mx-2"></div>

            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-[1370px] mx-auto px-4 py-5">
        <div className="flex items-center gap-1 mb-10 ml-5 max-w-[100px]">
          <div className="bg-[#D2AB48] h-1 w-7"></div>
          <p className="font-bold text-[20px]">FAQs</p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="max-w-[1140px] mx-auto space-y-4 ml-5"
          value={openItem}
          onValueChange={setOpenItem}
        >
          {faqList.map((item, index) => (
            <AccordionItem key={item._id} value={`item-${index}`}>
              <AccordionTrigger className="flex cursor-pointer justify-between items-center w-full text-[20px] font-semibold [&>svg]:hidden hover:no-underline">
                {item.question}
                <span className="text-xl">
                  {openItem === `item-${index}` ? "−" : "+"}
                </span>
              </AccordionTrigger>

              <AccordionContent className="text-[16px] font-normal">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Faq;
