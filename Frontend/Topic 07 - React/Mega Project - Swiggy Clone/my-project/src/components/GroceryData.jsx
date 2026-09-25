import groceryOptions from "../Utils/GroceryOptions";
import GroceryCard from "./GroceryCard";

export default function GroceryData() {
  return (
    <section className="w-[80%] mx-auto px-4 md:px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Shop groceries on Instamart
        </h2>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2">
        {groceryOptions.map((grocery) => (
          <GroceryCard key={grocery.id} grocery={grocery} />
        ))}
      </div>
    </section>
  );
}
