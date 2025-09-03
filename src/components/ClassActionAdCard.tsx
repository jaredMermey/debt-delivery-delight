import { Card, CardContent } from "@/components/ui/card";
import classActionAd from "@/assets/class-action-ad.jpg";

interface ClassActionAdCardProps {
  onClick?: () => void;
}

export const ClassActionAdCard = ({ onClick }: ClassActionAdCardProps) => {
  const handleClick = () => {
    // Open class action signup in new tab
    window.open("https://example.com/class-action-signup", "_blank");
    if (onClick) onClick();
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-400 bg-white shadow-md h-full"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full">
        <div className="relative h-full min-h-[300px]">
          <img
            src={classActionAd}
            alt="Join another class action suit - Get compensated for corporate wrongdoing"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-lg font-bold mb-1">Join Another Class Action</h3>
            <p className="text-sm opacity-90">Click to explore new opportunities</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};