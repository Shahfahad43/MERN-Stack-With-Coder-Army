import "./App.css";
import { BrowserRouter } from "react-router";
import { Routes, Route } from "react-router";

import HomePage from "./components/HomePage";
import ResturantData from "./Utils/ResturantOptions";
import ResturantMenu from "./components/ResturantMenu";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resturant" element={<ResturantData />} />
          <Route path="/city/delhi/:id" element={<ResturantMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=622616&catalog_qa=undefined&submitAction=ENTER => Getting individual cards data.
