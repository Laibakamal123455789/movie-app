import { createSlice } from "@reduxjs/toolkit";

export let movieSlice = createSlice({
  name: "movie-slices",
  initialState: {
    favouriteMovies: [],
  },
  reducers: {
    addToFavourites: (state, action) => {
      state.favouriteMovies.push(action.payload);
    },
    setFavourites: (state, action) => {
      state.favouriteMovies = action.payload;
    },
  },
});

export const { addToFavourites, setFavourites } = movieSlice.actions;
