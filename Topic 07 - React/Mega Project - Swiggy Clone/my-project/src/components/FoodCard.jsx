export default function FoodCard({ foodData }) {
  return (
    <div className="shrink-0 cursor-pointer group flex flex-col items-center">
      <img
        src={`https://media-assets.swiggy.com/swiggy/image/upload/${foodData?.imageId}`}
        alt={foodData?.action?.text || "food"}
        className="w-28 sm:w-32 md:w-36 lg:w-40 object-contain 
                   transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
}
