import { useRef } from "react";
import imageGridCards from "../Utils/FoodData";
import FoodCard from "./FoodCard";

export default function FoodOptions() {
  const scrollRef = useRef(null);

  return (
    <section className="w-[80%] mx-auto px-4 md:px-10 py-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bol">What's on your mind?</h2>
      </div>

      <div className="mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
        >
          {imageGridCards.map((foodData) => (
            <FoodCard key={foodData.id} foodData={foodData} />
          ))}
        </div>
      </div>
    </section>
  );
}
