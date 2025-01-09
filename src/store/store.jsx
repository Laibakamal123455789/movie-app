
import { configureStore } from "@reduxjs/toolkit";
import { userWalaSlice } from "./slice/user"; 

export let merastore = configureStore({
  reducer: {
    user: userWalaSlice.reducer, 
  },
});
