import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Resturant API: https://www.swiggy.com/mapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&collection=80475&tags=layout_BAU_Contextual&sortBy=&filters=&type=rcv2&offset=0&carousel=true&third_party_vendor=1
