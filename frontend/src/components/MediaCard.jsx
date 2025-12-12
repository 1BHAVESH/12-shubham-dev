import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const MediaCard = ({ item }) => {
  return (
    <Card className="rounded-xl h-[496px] w-[366px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <img src={item.img} alt={item.title} className="rounded-t-xl w-[335px] mx-auto h-[340px] object-cover" />

      <CardContent className="px-4 pb-0">
        <h3 className="text-[14px] font-semibold mb-1">{item.title}</h3>
        <p className="text-[14px] font-normal text-gray-600 mb-2">
          {item.desc}
        </p>
        <div className="flex items-center text-gray-500 text-[14px] gap-2">
          <Calendar className="w-4 h-4" />
          <span>{item.date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
