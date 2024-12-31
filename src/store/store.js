import { configureStore } from "@reduxjs/toolkit";
import { movieSlice } from "./slices/moviesSlice";

export let meraStore=configureStore({
    reducer: movieSlice.reducer
})