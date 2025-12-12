import HeroImage from "@/components/HeroImage";
import { useGetPrivacyPolicyQuery } from "@/redux/features/shubamdevApi";
import React, { useState } from "react";

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetPrivacyPolicyQuery();

  const [visible, setVisible] = useState(true);

  if (isLoading) return <h1>wait...</h1>;

  const content = data?.data?.content || "";

  return (
    <div>
      {/* HERO SECTION */}
      <div className="relative">
        <HeroImage visible={visible} setVisible={setVisible} />
        <div className="absolute inset-0 bg-black/40"></div>

        {visible && (
          <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] text-center w-full px-4 pointer-events-none">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
              Privacy Policy
            </h2>

            <div className="flex items-center justify-center mt-3 sm:mt-4 mx-auto max-w-[300px]">
              <div
                className="w-3 h-3 bg-white"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              ></div>

              <div className="h-[2px] bg-white flex-grow mx-2"></div>

              <div
                className="w-3 h-3 bg-white"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* PRIVACY POLICY CONTENT */}
      <section className="max-w-[1370px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-1 mb-3">
          <div className="bg-[#D2AB48] h-1 w-7"></div>
          <p className="font-bold text-[20px]">Privacy Policy</p>
        </div>

        {/* Render Jodit HTML Content */}
        <div
          className="prose prose-lg max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </div>
  );
};

export default PrivacyPolicy;
