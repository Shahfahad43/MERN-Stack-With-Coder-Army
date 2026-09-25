export default function GroceryCard({ grocery }) {
  return (
    <div className="w-36 sm:w-40 md:w-44 shrink-0 cursor-pointer group">
      <a href={grocery?.action?.link}>
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/${grocery?.imageId}`}
          alt={grocery?.action?.text || "grocery"}
          className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-xl 
                   transition-transform duration-200 group-hover:scale-105"
        />
        <h2 className="mt-2 text-sm md:text-base font-bold text-black leading-tight">
          {grocery?.action?.text}
        </h2>
      </a>
    </div>
  );
}
