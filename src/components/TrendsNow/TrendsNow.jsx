"use client";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "./TrendsNow.css";

const API_KEY = "62ba84da719c3812b6d078e3f7c2e4f1";

const TrendsNow = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Action");
  const [movies, setMovies] = useState([]);

  const fetchGenres = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    setCategories(
      data.genres.filter((genre) =>
        ["Action", "Comedy", "Drama", "Horror", "Biography", "Adventure", "Crime"].includes(
          genre.name
        )
      )
    );
  };

  const fetchMoviesByGenre = async (genreId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    setMovies(data.results);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const genre = categories.find((cat) => cat.name === selectedCategory);
      if (genre) fetchMoviesByGenre(genre.id);
    }
  }, [selectedCategory, categories]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="trends-now">
      <h2>Trends Now</h2>
      <hr style={{width:"350px" ,justifyContent: "center ", margin: "auto" , marginBottom :"40px"}}></hr>
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`filter-button ${
              selectedCategory === category.name ? "active" : ""
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {movies.length > 0 ? (
        <Slider {...sliderSettings}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
        </Slider>
      ) : (
        <p className="no-movies">Select a category to see movies!</p>
      )}
    </div>
  );
};

export default TrendsNow;
