import bgImg from "../assets/pngwing.com _4.png"; // correct image import

const CommomImg = ({page, arrowSize=60}) => {
  // console.log(arrowSize)
  return (
  <section
  style={{ backgroundImage: `url(${bgImg})` }}
  className="
    relative
    w-full 
    h-[180px] sm:h-[220px] md:h-[260px] lg:h-[276px]   /* Responsive Height */
    bg-cover bg-bottom bg-no-repeat
    flex items-center justify-center
  "
>
  {/* Gradient Overlay - matching first image's golden tone */}
  <div
    className="
      absolute inset-0 
      bg-gradient-to-b 
      from-[#d4a52e] via-[#c99a2d] to-[#b8932d]
      opacity-85
    "
  ></div>

  {/* Additional subtle overlay for depth */}
  <div
    className="
      absolute inset-0 
      bg-gradient-to-t 
      from-transparent via-transparent to-[#d4a52e]
      opacity-20
    "
  ></div>

  {/* MAIN TEXT + ARROW */}
  <div className="relative z-10 text-center px-3">
    {/* PAGE TITLE */}
    <h2
      className="
        text-[28px] sm:text-[36px] md:text-[48px] lg:text-[48px]
        font-serif italic font-bold tracking-wide text-white leading-tight
        drop-shadow-lg
      "
    >
      {page || "About us"}
    </h2>

    {/* ARROW LINE */}
   <div className={`flex items-center justify-center mt-3 mx-auto ${arrowSize == 80 ? "max-w-[540px]" : "max-w-[300px]"}`}>
      {/* Left Diamond */}
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white flex-shrink-0" style={{
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
      }}></div>

      <div
        className="
          h-[2px] bg-white flex-grow mx-2
          min-w-[140px] sm:min-w-[200px] md:min-w-[300px]
        "
      ></div>

      {/* Right Diamond */}
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white flex-shrink-0" style={{
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
      }}></div>
    </div>
  </div>
</section>

  );
};

export default CommomImg