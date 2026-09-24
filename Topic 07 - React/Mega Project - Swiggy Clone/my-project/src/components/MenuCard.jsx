import { useState } from "react";
import RestInfo from "./RestInfo";

export default function MenuCard({ menuItems, foodSelected }) {
  const [isOpen, setIsOpen] = useState(true);

  if ("categories" in menuItems) {
    return (
      <div className="w-full mb-8">
        <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
          {menuItems.title}
        </p>

        <div className="space-y-4">
          {menuItems?.categories?.map((items) => (
            <MenuCard
              key={items?.title}
              menuItems={items}
              foodSelected={foodSelected}
            ></MenuCard>
          ))}
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full py-3">
          <p className="text-xl md:text-2xl font-bold text-gray-800">
            {menuItems.title}
          </p>

          <button
            className="text-3xl font-bold text-gray-600 hover:text-black px-4 py-2 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "^" : "⌄"}
          </button>
        </div>

        <div className="h-2 bg-gray-100 rounded-full mt-2 mb-4"></div>
      </div>
    );
  }

  if (foodSelected === "veg") {
    return (
      <div>
        <div className="w-full">
          <div className="flex items-center justify-between w-full py-3">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {menuItems.title}
            </p>

            <button
              className="text-3xl font-bold text-gray-600 hover:text-black px-4 py-2 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "^" : "˯"}
            </button>
          </div>

          <div className="space-y-2">
            {menuItems?.itemCards
              ?.filter(
                (food) =>
                  food?.card?.info?.isVeg === true ||
                  food?.card?.info?.itemAttribute?.vegClassifier === "VEG",
              )
              .map((items) => (
                <RestInfo
                  key={items?.card?.info?.id}
                  restData={items?.card?.info}
                ></RestInfo>
              ))}
          </div>

          <div className="h-2 bg-gray-100 rounded-full mt-4 mb-5"></div>
        </div>
      </div>
    );
  }

  if (foodSelected === "nonveg") {
    return (
      <div>
        <div className="w-full">
          <div className="flex items-center justify-between w-full py-3">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {menuItems.title}
            </p>

            <button
              className="text-3xl font-bold text-gray-600 hover:text-black px-4 py-2 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "^" : "˯"}
            </button>
          </div>

          <div className="space-y-2">
            {menuItems?.itemCards
              ?.filter(
                (food) =>
                  food?.card?.info?.isVeg === false ||
                  food?.card?.info?.itemAttribute?.vegClassifier === "NONVEG",
              )
              .map((items) => (
                <RestInfo
                  key={items?.card?.info?.id}
                  restData={items?.card?.info}
                ></RestInfo>
              ))}
          </div>

          <div className="h-2 bg-gray-100 rounded-full mt-4 mb-5"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center justify-between w-full py-3">
          <p className="text-xl md:text-2xl font-bold text-gray-800">
            {menuItems.title}
          </p>

          <button
            className="text-3xl font-bold text-gray-600 hover:text-black px-4 py-2 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "^" : "˯"}
          </button>
        </div>

        <div className="space-y-2">
          {menuItems?.itemCards?.map((items) => (
            <RestInfo
              key={items?.card?.info?.id}
              restData={items?.card?.info}
            ></RestInfo>
          ))}
        </div>

        <div className="h-2 bg-gray-100 rounded-full mt-4 mb-5"></div>
      </div>
    </div>
  );
}
