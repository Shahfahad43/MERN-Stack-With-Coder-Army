import { useState } from "react";
import RestInfo from "./RestInfo";

export default function MenuCard({ menuItems }) {
  const [isOpen, setIsOpen] = useState(true);

  // Handle nested category groups (e.g., Subcategories)
  if ("categories" in menuItems) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight mb-3 px-1">
          {menuItems.title}
        </h3>
        <div className="divide-y divide-gray-100">
          {menuItems?.categories?.map((category) => (
            <MenuCard key={category?.title} menuItems={category} />
          ))}
        </div>
      </div>
    );
  }

  const items = menuItems?.itemCards || [];
  const itemCount = items.length;

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-shadow duration-200 hover:shadow-md">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-xl font-bold text-gray-800 tracking-tight truncate">
            {menuItems?.title}
          </span>
          {itemCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
              {itemCount}
            </span>
          )}
        </div>

        {/* Animated Chevron */}
        <span
          className={`transform transition-transform duration-300 ease-in-out text-gray-500 text-xs sm:text-sm shrink-0 ml-2 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* Accordion Body — animated grid trick for smooth collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 sm:px-6 pb-2 divide-y  divide-gray-100">
            {items.length > 0 ? (
              items.map((item) => (
                <RestInfo
                  key={item?.card?.info?.id}
                  restData={item?.card?.info}
                />
              ))
            ) : (
              <p className="py-6 text-sm text-gray-400 text-center">
                No items available in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
