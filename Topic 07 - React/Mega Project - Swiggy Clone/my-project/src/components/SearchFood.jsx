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
    <div>
      {/* Search Bar */}
      <div className="w-[80%] mx-auto my-20">
        <input
          className="w-full p-3 bg-gray-300 border rounded-2xl"
          type="text"
          placeholder="Search food..."
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div className="w-[80%] mx-auto">
        {food.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-5">Search Results</h2>

            {filteredFood.length > 0 ? (
              <div className="space-y-4">
                {filteredFood.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-xl shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>

                        {item.price && (
                          <p className="text-gray-600">₹{item.price / 100}</p>
                        )}

                        {item.description && (
                          <p className="text-gray-500 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div>
                        <img
                          className="object-cover w-50"
                          src={
                            "https://media-assets.swiggy.com/swiggy/image/upload/" +
                            item.imageId
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No food found.</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Search for a food item...</p>
        )}
      </div>
    </div>
  );
}
