import DineoutOptions from "../Utils/DineoutOptions";
import DineoutCard from "./DineoutCard";

export default function DineoutData() {
  return (
    <section className="w-[80%] mx-auto my-10">
      <h2 className="mb-5 font-bold">Discover best restaurants on Dineout</h2>
      <div className="flex gap-4 overflow-x-auto">
        {DineoutOptions.map((restaurant) => (
          <DineoutCard key={restaurant?.info?.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
