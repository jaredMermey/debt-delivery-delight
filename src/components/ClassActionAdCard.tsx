import classActionAd from "@/assets/class-action-ad.jpg";

interface ClassActionAdCardProps {
  image?: string;
  clickable?: boolean;
  url?: string;
}

export const ClassActionAdCard = ({ image, clickable = false, url }: ClassActionAdCardProps = {}) => {
  const handleClick = () => {
    if (url && clickable) {
      window.open(url, '_blank');
    }
  };

  return (
    <div 
      onClick={clickable ? handleClick : undefined}
      className={`relative rounded-lg border border-slate-200 overflow-hidden bg-white group max-w-sm ${
        clickable ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''
      }`}
    >
      <div className="aspect-video relative">
        <img 
          src={image || classActionAd}
          alt="Class Action Lawsuit Advertisement"
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
        />
      </div>
    </div>
  );
};