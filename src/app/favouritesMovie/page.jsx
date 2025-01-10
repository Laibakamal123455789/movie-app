"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToFavourites, setFavourites } from "@/store/slice/moviesFavourite";
import { useRouter } from "next/navigation";
import { merastore } from "@/store/store";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Wishlist />
    </Provider>
  );
}

function Wishlist() {

  const { favouriteMovies } = useSelector((state) => state.movieSlice);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token not found in localStorage");
            return;
          }

          const response = await axios.get("/api/auth/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(setFavourites(response.data.favouriteMovies || []));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };

      fetchWishlist();
    }
  }, [isAuthenticated, dispatch]);

  const handleAddToWishlist = async (movie) => {
    console.log("Movie to add:", movie);

    if (!isAuthenticated) {
      alert("Please log in to add movies to your wishlist.");
      router.push("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage");
        alert("No valid token found.");
        return;
      }

      const response = await axios.post( "/api/auth/wishlist", { movie }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json", 
          },
        }
      );

      console.log("Response:", response.data);
      dispatch(addToFavourites(movie)); 
      alert(`${movie.title} added to your wishlist!`);
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        console.error("Status code:", error.response.status);
        console.error("Error data:", error.response.data);
      }
      if (error.response && error.response.status === 400) {
        alert("Movie is already in your wishlist.");
      } else if (error.response && error.response.status === 401) {
        alert("Unauthorized. Please log in.");
      } else {
        alert("An error occurred while adding the movie.");
      }
    }
  };

  return (
    <div>
      <h1>Your Wishlist</h1>
      <ul>
        {favouriteMovies.map((movie) => (
          <li key={movie.movieId}>
            {movie.title}
            <button onClick={() => handleAddToWishlist(movie)}>Add to Wishlist</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
