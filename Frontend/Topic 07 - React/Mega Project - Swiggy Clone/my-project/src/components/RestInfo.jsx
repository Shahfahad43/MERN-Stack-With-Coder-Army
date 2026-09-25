import { AddItems, IncrementItems, DecrementItems } from "../Store/CartSlicer";
import { useDispatch, useSelector } from "react-redux";

export default function RestInfo({ restData }) {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cartslice.items);
  const getItems = cartItems.find((item) => item.id === restData.id);
  const count = getItems ? getItems.quantity : 0;

  function handleAddItems() {
    dispatch(AddItems(restData));
  }
  function handleIncrementItems() {
    dispatch(IncrementItems(restData));
  }
  function handleDecrementItems() {
    dispatch(DecrementItems(restData));
  }

  const price =
    "defaultPrice" in restData
      ? restData?.defaultPrice / 100
      : restData?.price / 100;

  return (
    <>
      <div className="flex items-start justify-between gap-4 sm:gap-8 py-5 group transition-colors">
        {/* Left Side: Item Information */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Item Name */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {restData?.name}
          </h3>

          {/* Price */}
          <p className="text-sm sm:text-base font-semibold text-slate-800 mt-1">
            ₹{price}
          </p>

          {/* Rating */}
          {restData?.ratings?.aggregatedRating?.rating && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
                <svg className="w-3 h-3 fill-emerald-600" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {restData?.ratings?.aggregatedRating?.rating}
              </span>

              {restData?.ratings?.aggregatedRating?.ratingCountV2 && (
                <span className="text-xs font-medium text-slate-400">
                  ({restData?.ratings?.aggregatedRating?.ratingCountV2})
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {restData?.description && (
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {restData?.description}
            </p>
          )}
        </div>

        {/* Right Side: Image & Floating Add/Counter Button */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-28 h-24 sm:w-36 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
            {restData?.imageId ? (
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={
                  "https://media-assets.swiggy.com/swiggy/image/upload/" +
                  restData.imageId
                }
                alt={restData?.name || "Dish item"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 text-xs">
                No Image
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <div className="absolute -bottom-3">
            {count === 0 ? (
              <button
                type="button"
                className="px-6 sm:px-8 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-emerald-600 bg-white border border-slate-200/90 shadow-md hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all duration-150 uppercase tracking-wide"
                onClick={handleAddItems}
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-white border border-emerald-300 shadow-md text-emerald-700 font-bold text-sm">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-emerald-50 active:scale-90 transition-transform"
                  onClick={handleDecrementItems}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="min-w-3.5 text-center text-xs sm:text-sm">
                  {count}
                </span>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-emerald-50 active:scale-90 transition-transform"
                  onClick={handleIncrementItems}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-2 border-slate-100" />
    </>
  );
}
