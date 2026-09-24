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
      const proxyServer = "https://cors-anywhere.herokuapp.com/";
      const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
      const response = await fetch(proxyServer + swiggyAPI);
      const data = await response.json();
      const tempData =
        data?.data?.cards[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
      const filterData = tempData.filter(
        (items) => "title" in (items?.card?.card || {}),
      );
      setRestData(filterData);
    }

    fetchData();
  }, []);

  return (
    <div className="w-[90%] md:w-[80%] max-w-5xl mx-auto mt-10 md:mt-16 mb-10">
      <div className="w-full py-4 bg-gray-300 my-20">
        <button
          onClick={() => navigate(`/city/delhi/${id}/search`)}
          className="rounded-2xl text-2xl"
        >
          Search Food
        </button>
      </div>

      {/* Veg / Non-Veg Filter Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          className={`border rounded-2xl px-6 py-2 ${selected === "veg" ? "bg-green-400" : "bg-gray-300"}`}
          onClick={() => setSelected(selected === "veg" ? null : "veg")}
        >
          Veg
        </button>
        <button
          className={`border rounded-2xl px-6 py-2 ${selected === "nonveg" ? "bg-red-400" : "bg-gray-300"}`}
          onClick={() => setSelected(selected === "nonveg" ? null : "nonveg")}
        >
          Non veg
        </button>
      </div>

      {RestData.map((menuItems) => (
        <MenuCard
          key={menuItems?.card?.card?.title}
          menuItems={menuItems?.card?.card}
          foodSelected={selected}
        ></MenuCard>
      ))}
    </div>
  );
}
