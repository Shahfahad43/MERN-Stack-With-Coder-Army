import "./App.css";
import HomePage from "./components/HomePage";

import ResturantData from "./Utils/ResturantOptions";
import { BrowserRouter } from "react-router";
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resturant" element={<ResturantData />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
