"use client";
import { meraStore } from "@/store/store";
import { Provider, useSelector } from "react-redux";
import "./page.css";

export default function Page() {
  return (
    <Provider store={meraStore}>
      <AddToFavourite />
    </Provider>
  );
}

function AddToFavourite() {
  const movies = useSelector((store) => store.movies || []);

  return (
    <div>
      <h1>Favorite Movies</h1>
      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <div key={index} className="movie-card">
              <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
              />
              <div className="movie-details">
                <h3>{movie.title}</h3>
                <div className="para">
                  <p>⭐ {movie.vote_average}</p>
                  <p>{movie.release_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite movies yet!</p>
      )}
    </div>
  );
}
