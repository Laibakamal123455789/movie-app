import { createSlice } from "@reduxjs/toolkit";

export let movieSlice = createSlice({
  name: "movie-slice",
  initialState: {
    movies: [], 
  },
  reducers: {
    addToFavourite: (state, action) => {
     
      const movie = action.payload;
      const existingMovie = state.movies.find((m) => m.id === movie.id);
      if (!existingMovie) {
        state.movies.push({
          ...movie,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image', 
        });
      }
    },
  },
});

export let { addToFavourite } = movieSlice.actions;
