import React from "react";
import CommomImg from "@/components/CommonBackgroundImg";
import LatestCard from "@/components/LatestCard";
import carimg from "../assets/Screenshot_3.png";
import calender from "../assets/Calendar.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Media1 = () => {
  const cards = [
    {
      id: 1,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 2,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 3,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 4,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 5,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
    {
      id: 6,
      img: carimg,
      title: "The beauty lies in little details",
      desc: "Welcome to the contemporary spaces to dwell in the modern luxuries of a premium 3 BHK duplex.",
      date: "Dec 17, 2025",
    },
  ];

  const latest = cards.slice(0, 4);

  return (
    <div>
      <CommomImg page="Media" />

      {/* MAIN GRID (MEDIA + LATEST POSTS) */}
      <div className="max-w-[1300px] mx-auto px-4 py-12 flex gap-20">
        {/* LEFT SIDE */}
        <div className="max-w-[741px] lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Dialog key={card.id}>
              <DialogTrigger asChild>
                <div className="bg-white max-w-[366px] h-[484px] rounded-xl shadow-md p-4 cursor-pointer">
                  <img
                    src={card.img}
                    className="w-full h-[320px] object-cover rounded-lg mb-4"
                    alt=""
                  />

                  <h3 className="text-lg font-semibold">{card.title}</h3>

                  <p className="text-sm text-gray-600 mt-1">{card.desc}</p>

                  <div className="text-gray-500 text-sm mt-3 flex gap-2">
                    <img src={calender} />
                    <span>{card.date}</span>
                  </div>
                </div>
              </DialogTrigger>

              {/* Dialog Box Content */}
              <DialogContent className="max-w-[650px] [&>button]:cursor-pointer [&>button]:text-black ">
                <DialogHeader>
                  <DialogTitle>{card.title}</DialogTitle>
                  <DialogDescription>{card.date}</DialogDescription>
                </DialogHeader>

                <img
                  src={card.img}
                  className="w-full h-[320px] object-cover rounded-lg mb-4"
                  alt=""
                />

                <p className="text-gray-700">{card.desc}</p>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* RIGHT SIDE – LATEST POSTS */}
        <div className="bg-white max-w-[366px] shadow-lg rounded-xl p-6 h-fit">
          <h3 className="text-[16px] font-medium mb-4">Latest Posts</h3>

          <div className="flex flex-col gap-4">
            {latest.map((item) => (
              <>
              <LatestCard key={item.id} item={item} />
              <hr />
              </>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------- TRENDING POSTS SECTION --------------------------- */}
      <div className="w-full bg-black py-16 mt-10">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Title */}
          <h2 className="text-white text-2xl font-semibold mb-8">
            Trending Posts
          </h2>

          {/* Trending Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => (
              <Dialog key={card.id}>
                <DialogTrigger asChild>
                  <div className="bg-white max-w-[366px] h-[484px] rounded-xl shadow-md p-4 cursor-pointer">
                    <img
                      src={card.img}
                      className="w-full h-[320px] object-cover rounded-lg mb-4"
                      alt=""
                    />

                    <h3 className="text-lg font-semibold">{card.title}</h3>

                    <p className="text-sm text-gray-600 mt-1">{card.desc}</p>

                    <div className="text-gray-500 text-sm mt-3 flex gap-2">
                      <img src={calender} />
                      <span>{card.date}</span>
                    </div>
                  </div>
                </DialogTrigger>

                {/* Dialog Box Content */}
                <DialogContent className="max-w-[650px] [&>button]:cursor-pointer [&>button]:text-black ">
                  <DialogHeader>
                    <DialogTitle>{card.title}</DialogTitle>
                    <DialogDescription>{card.date}</DialogDescription>
                  </DialogHeader>

                  <img
                    src={card.img}
                    className="w-full h-[320px] object-cover rounded-lg mb-4"
                    alt=""
                  />

                  <p className="text-gray-700">{card.desc}</p>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
      {/* ----------------------- END TRENDING SECTION --------------------------- */}
    </div>
  );
};

export default Media1;
