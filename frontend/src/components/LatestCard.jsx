import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LatestCard({ item }) {
  return (
    <Dialog>
      {/* CARD CLICK hote hi dialog open hoga */}
      <DialogTrigger asChild>
        <div className="cursor-pointer flex gap-2 sm:gap-3 items-start p-1.5 sm:p-2">
          {/* LEFT IMAGE */}
          <img
            src={item.img}
            alt={item.title}
            className="w-16 sm:w-20 md:w-[95px] h-16 sm:h-20 md:h-[95px] rounded-md object-cover flex-shrink-0"
          />

          {/* RIGHT TEXT */}
          <div className="flex flex-col justify-between flex-1">
            <h4 className="text-xs sm:text-[13px] md:text-[14px] font-semibold leading-snug">
              {item.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] md:text-[12px] font-normal line-clamp-2 mt-1">
              {item.desc}
            </p>

            {/* DATE */}
            <div className="flex items-center text-gray-500 text-[10px] sm:text-[11px] md:text-[12px] gap-1 mt-1 sm:mt-1.5">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* DIALOG OPEN HONE PAR YEH SHOW HOGA */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {item.desc}
          </DialogDescription>
        </DialogHeader>

        {/* Yaha img aur other details bhi show kar sakte ho */}
        <img
          src={item.img}
          alt={item.title}
          className="w-full rounded-md mt-2"
        />
      </DialogContent>
    </Dialog>
  );
}
