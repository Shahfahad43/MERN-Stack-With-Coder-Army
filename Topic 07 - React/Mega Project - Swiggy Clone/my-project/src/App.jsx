import "./App.css";
import Home from "./components/Home";
import FoodOptions from "./components/FoodOptions";
import GroceryData from "./components/GroceryData";
import Banner from "./components/Banner";
import DineoutData from "./components/DineoutData";
import ResturantData from "./Utils/ResturantOptions";
function App() {
  return (
    <>
      <Home />
      <FoodOptions />
      <GroceryData />
      <Banner />
      <DineoutData />
      <ResturantData />
    </>
  );
}

export default App;
