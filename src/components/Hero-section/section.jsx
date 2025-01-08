"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "./HeroSection.css";
import { addToFavourite } from "@/store/slices/moviesSlice";
import { Provider, useDispatch } from "react-redux";
import { meraStore } from "@/store/store";
import { BASE_URL,API_KEY } from "@/lib/apiConfig";

export default function Page() {
  return (
    <Provider store={meraStore}>
      <HeroSection />
    </Provider>
  );
}

function HeroSection() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const dispatch = useDispatch(); 

  const fetchMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    setMovies(data.results.slice(0, 10)); 
  };

  const fetchTrailer = async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    const trailer = data.results.find((video) => video.type === "Trailer");
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  };

  const handleWatch = async (movieId) => {
    const trailer = await fetchTrailer(movieId);
    if (trailer) {
      setTrailerUrl(trailer);
      setIsPlaying(true);
    } else {
      alert("Trailer not available for this movie.");
    }
  };

  const closeTrailer = () => {
    setTrailerUrl(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: !isPlaying,
    autoplaySpeed: 3000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentMovieIndex(next),
  };

  if (movies.length === 0) return <div>Loading...</div>;

  const currentMovie = movies[currentMovieIndex];

  const handleAddToList = () => {
    if (currentMovie) {
      dispatch(addToFavourite(currentMovie));
      console.log("yes");
      alert(`${currentMovie.title} added to your list!`);
    }
  };

  return (
    <div className="hero-container">
      {!isPlaying && (
        <div className="background-slider">
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie.id} className="background-slide">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="background-image"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {isPlaying && trailerUrl && (
        <div className="trailer-background">
          <iframe
            src={`${trailerUrl}?autoplay=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="trailer-video"
          ></iframe>
          <button className="close-trailer-button" onClick={closeTrailer}>
            Close Trailer
          </button>
        </div>
      )}

      <div className="hero-content">
        <div className="content-wrapper">
          <p className="movie-duration">Duration: 2h:30m</p>
          <h1 className="hero-title">{currentMovie?.title}</h1>
          <p className="hero-description">{currentMovie?.overview}</p>
          <div className="hero-buttons">
            <button
              className={`hero-button watch ${isPlaying ? "active" : ""}`}
              onClick={() => handleWatch(currentMovie?.id)}
            >
              Watch
            </button>
            <button className="hero-button add" onClick={handleAddToList}>
              Add to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
