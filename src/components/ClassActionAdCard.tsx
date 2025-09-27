import classActionAd from "@/assets/class-action-ad.jpg";

interface ClassActionAdCardProps {
  image?: string;
  clickable?: boolean;
}

export const ClassActionAdCard = ({ image, clickable = false }: ClassActionAdCardProps = {}) => {
  const handleClick = () => {
    // Open in new tab - you can replace this URL with the actual signup link
    window.open('https://example.com/class-action-signup', '_blank');
  };

  return (
    <div 
      onClick={clickable ? handleClick : undefined}
      className={`relative rounded-lg border border-slate-200 overflow-hidden bg-white group ${
        clickable ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''
      }`}
    >
      <div className="aspect-square relative">
        <img 
          src={image || classActionAd}
          alt="Class Action Lawsuit Advertisement"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />
      </div>
    </div>
  );
};