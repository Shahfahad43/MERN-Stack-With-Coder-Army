import "./App.css";
import { BrowserRouter } from "react-router";
import { Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "./Store/Store";

import HomePage from "./components/HomePage";
import ResturantData from "./Utils/ResturantOptions";
import ResturantMenu from "./components/ResturantMenu";
import SearchFood from "./components/SearchFood";
import SecondaryHome from "./components/SecondaryHome";
import CheckOut from "./components/CheckOut";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<SecondaryHome />}>
              <Route path="/resturant" element={<ResturantData />} />
              <Route path="/city/delhi/:id" element={<ResturantMenu />} />
              <Route
                path="/city/delhi/:id/search"
                element={<SearchFood></SearchFood>}
              ></Route>
            </Route>
            <Route path="/Checkout" element={<CheckOut></CheckOut>}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

// https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=622616&catalog_qa=undefined&submitAction=ENTER => Getting individual cards data.

// https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId${id}

// https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=46857&catalog_qa=undefined&submitAction=ENTER
