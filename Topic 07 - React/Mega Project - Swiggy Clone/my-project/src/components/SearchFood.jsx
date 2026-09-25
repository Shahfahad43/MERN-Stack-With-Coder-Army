import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function SearchFood() {
  const { id } = useParams();

  const [food, setFood] = useState("");
  const [restData, setRestData] = useState([]);

  // Fetch restaurant menu
  useEffect(() => {
    async function fetchData() {
      try {
        const proxyServer = "https://cors-anywhere.herokuapp.com/";

        const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;

        const response = await fetch(proxyServer + swiggyAPI);

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }

        const data = await response.json();

        const tempData =
          data?.data?.cards?.[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
          [];

        // Get only cards which contain a title
        const filterData = tempData.filter((item) => item?.card?.card?.title);

        setRestData(filterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);

  // Get all food items from all categories
  const allFoodItems = restData.flatMap((category) => {
    return (
      category?.card?.card?.itemCards?.map((item) => item?.card?.info) || []
    );
  });

  // Filter food items according to search input
  const filteredFood = allFoodItems.filter((item) =>
    item?.name?.toLowerCase().includes(food.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Search Bar Container */}
        <div className="relative mb-8 sm:mb-12">
          <div className="relative flex items-center">
            {/* Search Icon */}
            <span className="absolute left-4 text-slate-400 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </span>

            <input
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-xs focus:outline-hidden focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              type="text"
              placeholder="Search dishes, desserts, drinks..."
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />

            {/* Clear Input Button */}
            {food.length > 0 && (
              <button
                type="button"
                onClick={() => setFood("")}
                className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div>
          {food.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Search Results
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-600">
                  {filteredFood.length}{" "}
                  {filteredFood.length === 1 ? "result" : "results"}
                </span>
              </div>

              {filteredFood.length > 0 ? (
                <div className="space-y-3.5">
                  {filteredFood.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-4">
                        {/* Details */}
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                            {item.name}
                          </h3>

                          {item.price && (
                            <p className="text-sm font-semibold text-emerald-600 mt-1">
                              ₹{item.price / 100}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          {item.imageId ? (
                            <img
                              className="w-full h-full object-cover"
                              src={
                                "https://media-assets.swiggy.com/swiggy/image/upload/" +
                                item.imageId
                              }
                              alt={item.name || "Dish"}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-bold text-slate-700">
                    No dishes found
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Try checking for spelling errors or searching for a
                    different dish.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 border border-dashed border-slate-300 rounded-2xl">
              <p className="text-sm font-medium text-slate-400">
                Type above to start searching for dishes in this restaurant...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
