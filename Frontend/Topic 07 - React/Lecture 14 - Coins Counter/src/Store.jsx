import { configureStore } from "@reduxjs/toolkit";
import slicer1Reducer from "./Slicer1";

const stores = configureStore({
  reducer: {
    slice: slicer1Reducer,
  },
});
export default stores;
