import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MenuCard from "./MenuCard";

export default function RestaurantMenu() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [RestData, setRestData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const proxyServer = "https://cors-anywhere.herokuapp.com/";
        const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;

        const response = await fetch(proxyServer + swiggyAPI);
        const data = await response.json();

        // Find the card that holds groupedCard dynamically
        const menuGroupCard = data?.data?.cards?.find(
          (c) => c?.groupedCard?.cardGroupMap?.REGULAR,
        );

        const tempData =
          menuGroupCard?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

        // Safe filter with fallback
        const filterData = tempData.filter((items) => items?.card?.card?.title);

        setRestData(filterData);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Search Food Bar Trigger */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/city/delhi/${id}/search`)}
            className="w-full flex items-center justify-between px-4 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-xs hover:shadow-sm active:scale-[0.99] transition-all duration-150 group"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors"
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
              <span className="text-sm sm:text-base font-medium">
                Search for dishes in this restaurant...
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg hidden sm:inline-block">
              Search
            </span>
          </button>
        </div>

        {/* Veg / Non-Veg Filter Chips */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-150 active:scale-95 ${
              selected === "veg"
                ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
            }`}
            onClick={() => setSelected(selected === "veg" ? null : "veg")}
          >
            <span
              className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${
                selected === "veg" ? "border-white" : "border-emerald-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selected === "veg" ? "bg-white" : "bg-emerald-600"
                }`}
              />
            </span>
            Veg
          </button>

          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-150 active:scale-95 ${
              selected === "nonveg"
                ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                : "bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/40"
            }`}
            onClick={() => setSelected(selected === "nonveg" ? null : "nonveg")}
          >
            <span
              className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${
                selected === "nonveg" ? "border-white" : "border-rose-600"
              }`}
            >
              <span
                className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${
                  selected === "nonveg" ? "border-b-white" : "border-b-rose-600"
                }`}
              />
            </span>
            Non-Veg
          </button>
        </div>

        {/* Menu Cards List */}
        {RestData.length > 0 ? (
          <div className="space-y-4">
            {RestData.map((menuItems) => (
              <MenuCard
                key={menuItems?.card?.card?.title}
                menuItems={menuItems?.card?.card}
                foodSelected={selected}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-white border border-slate-200/80 rounded-2xl" />
            <div className="h-16 bg-white border border-slate-200/80 rounded-2xl" />
            <div className="h-16 bg-white border border-slate-200/80 rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}
