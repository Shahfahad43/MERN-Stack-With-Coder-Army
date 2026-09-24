export default function RestInfo({ restData }) {
  if (!restData) return null;

  const price = (restData.defaultPrice ?? restData.price ?? 0) / 100;
  const rating = restData?.ratings?.aggregatedRating?.rating;
  const ratingCount = restData?.ratings?.aggregatedRating?.ratingCountV2;
  const hasImage = Boolean(restData?.imageId);

  return (
    <div className="group py-6 flex items-start justify-between gap-4 transition-colors duration-200 hover:bg-gray-50/70 rounded-2xl px-3 sm:px-4">
      {/* Item Details */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug truncate">
          {restData?.name}
        </h4>

        <div className="mt-1 font-semibold text-gray-800 text-sm sm:text-base">
          ₹{price}
        </div>

        {/* Rating Section */}
        {rating && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ★ {rating}
            </span>
            {ratingCount && (
              <span className="text-xs text-gray-500 font-normal">
                ({ratingCount})
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {restData?.description && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {restData.description}
          </p>
        )}
      </div>

      {/* Item Image & ADD Button */}
      <div className="relative flex flex-col items-center flex-shrink-0 w-28 sm:w-36">
        {hasImage ? (
          <img
            loading="lazy"
            className="w-28 h-24 sm:w-36 sm:h-28 object-cover rounded-2xl shadow-sm border border-gray-100 transition-transform duration-200 group-hover:scale-[1.02]"
            src={`https://media-assets.swiggy.com/swiggy/image/upload/${restData.imageId}`}
            alt={restData?.name || "Dish item"}
          />
        ) : (
          <div className="w-28 h-20 sm:w-36 sm:h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}

        {/* Add Button */}
        <button
          type="button"
          className="absolute -bottom-3 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold text-xs sm:text-sm px-6 py-1.5 rounded-lg shadow-md border border-gray-200 hover:border-emerald-600 uppercase tracking-wider transition-all duration-150 transform active:scale-95"
        >
          ADD
        </button>
      </div>
    </div>
  );
}
