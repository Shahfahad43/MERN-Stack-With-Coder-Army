export default function DineoutCard({ restaurant }) {
  const info = restaurant?.info;
  const imageId = info?.mediaFiles?.[0]?.url;
  const cuisines = info?.cuisines?.slice(0, 2).join(", ");

  return (
    <div className="w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/${imageId}`}
          alt={info?.name || "Restaurant"}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text inside the image banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
          <h3 className="truncate text-base font-bold text-white">
            {info?.name}
          </h3>

          {info?.rating?.value && (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              <span>★</span>
              {info.rating.value}
            </span>
          )}
        </div>
      </div>

      {/* Metadata / Details */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span className="truncate max-w-[60%] font-medium">
          {cuisines || "Multi-cuisine"}
        </span>
        <span className="font-semibold text-gray-800">{info?.costForTwo}</span>
      </div>
    </div>
  );
}
