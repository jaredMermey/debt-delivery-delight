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
      className={`relative rounded-lg border border-slate-200 overflow-hidden bg-[#0D0B3D] group ${
        clickable ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''
      }`}
    >
      <div className="aspect-[4/3] relative">
        <img 
          src={image || classActionAd}
          alt="Class Action Lawsuit Advertisement"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 translate-x-4"
        />
      </div>
    </div>
  );
};