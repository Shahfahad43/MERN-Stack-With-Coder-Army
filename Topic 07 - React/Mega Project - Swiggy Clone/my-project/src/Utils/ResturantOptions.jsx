import { useEffect, useState } from "react";
import ResturantCard from "../components/ResturantCard";

export default function ResturantData() {
  const [restData, setRestData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const heroku = "https://cors-anywhere.herokuapp.com/";
        const swiggyAPI =
          "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";

        const response = await fetch(heroku + swiggyAPI);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();

        // Safely locate the restaurant cards section
        const restaurantSection = json?.data?.cards?.find(
          (c) => c?.card?.card?.gridElements?.infoWithStyle?.restaurants,
        );

        const restaurants =
          restaurantSection?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants || [];

        setRestData(restaurants);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) return <p className="p-4 text-red-500">Failed to load: {error}</p>;

  return (
    <div className="flex flex-wrap gap-4 p-4 mx-auto w-[80%]">
      {restData?.map((restInfo) => (
        <ResturantCard key={restInfo?.info?.id} restInfo={restInfo} />
      ))}
    </div>
  );
}
