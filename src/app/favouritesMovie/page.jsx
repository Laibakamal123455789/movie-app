"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToFavourites, setFavourites } from "@/store/slice/moviesFavourite";
import { useRouter } from "next/navigation";
import { merastore } from "@/store/store";
import Image from "next/image";

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

  // Fetch the wishlist on component mount if authenticated
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

      const response = await axios.post(
        "/api/auth/wishlist",
        { currentMovie: movie },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(addToFavourites(movie));
      alert(`${movie.title} added to your wishlist!`);
    } catch (error) {
      console.error("Error adding movie:", error.response);
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Your Wishlist</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {favouriteMovies.length > 0 ? (
          favouriteMovies.map((movie) => (
            <div
              key={movie.movieId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              {/* Movie Image */}
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.imageUrl}`}
                alt={movie.title || "No Title Available"}
                width={150}
                height={200}
                unoptimized={true} // Skip image optimization temporarily
                style={{ borderRadius: "10px", marginBottom: "10px" }}
                
              />

              {/* Movie Title */}
              <h3>{movie.title || "Unknown Title"}</h3>

              {/* Movie Rating */}
              <p>
                <strong>Rating:</strong> {movie.rating || "N/A"}
              </p>

              {/* Added By */}
              <p>
                <strong>Added by:</strong> {movie.addedBy || "Unknown"}
              </p>

            
            </div>
          ))
        ) : (
          <p>No movies in your wishlist yet.</p>
        )}
      </div>
    </div>
  );
}
