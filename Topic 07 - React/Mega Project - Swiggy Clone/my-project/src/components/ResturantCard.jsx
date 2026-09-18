export default function ResturantCard({ restInfo }) {
  const {
    name,
    cloudinaryImageId,
    avgRating,
    sla,
    cuisines,
    locality,
    areaName,
    costForTwo,
  } = restInfo?.info || {};

  const cuisineList = cuisines?.slice(0, 2).join(", ");
  const location = locality || areaName || "";

  return (
    <div className="w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mx-auto">
      {/* Image Banner with Overlaid Name & Rating */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/${cloudinaryImageId}`}
          alt={name || "Restaurant"}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

        {/* Text inside the image banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
          <h3 className="truncate text-base font-bold text-white" title={name}>
            {name}
          </h3>

          {avgRating && (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              <span>★</span>
              {avgRating}
            </span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600">
        {/* Row 1: Cuisines & Cost */}
        <div className="flex items-center justify-between">
          <span className="truncate max-w-[65%] font-medium">
            {cuisineList || "Multi-cuisine"}
          </span>
          <span className="font-semibold text-gray-800">{costForTwo}</span>
        </div>

        {/* Row 2: Location & Delivery Time */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="truncate max-w-[65%]">{location}</span>
          <span className="font-medium text-gray-700">
            {sla?.slaString || `${sla?.deliveryTime || "30"} mins`}
          </span>
        </div>
      </div>
    </div>
  );
}
