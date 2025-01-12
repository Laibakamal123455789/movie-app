import { User } from "@/models/userModel";
import jwt from "jsonwebtoken";
import { connectKaro } from "@/app/db/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const JWT_SECRET = "your_secret_key";

export async function GET(req) {
  await connectKaro();

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.error("No token provided");
      return NextResponse.json(
        { message: "No token provided" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure all movies have complete data
    const moviesWithDefaults = await Promise.all(
      user.favouriteMovies.map(async (movie) => {
        return {
          movieId: movie._id ,
          title: movie.title || "Unknown Title",
          imageUrl: movie.imageUrl || "https://via.placeholder.com/150",
          rating: movie.rating || "N/A",
          addedBy: await getUsersWhoFavoritedMovie(movie._id),
        };
      })
    );

    console.log("Movies sent to client:", await moviesWithDefaults);

    return NextResponse.json(
      { favouriteMovies: await moviesWithDefaults },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Error fetching wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectKaro();

  try {
    const { currentMovie: movie } = await req.json();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.error("No token provided");
      return NextResponse.json(
        { message: "No token provided" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the movie is already in the wishlist
    console.log(user.favouriteMovies);
    if (user.favouriteMovies.length) {
      const isAlreadyAdded = user.favouriteMovies.some(
        (m) => m._id.toString() === movie.movieId
      );

      if (isAlreadyAdded) {
        console.warn("Movie already in wishlist");
        return NextResponse.json(
          { message: "Movie already in wishlist" },
          { status: 400 }
        );
      }
    }
console.log(movie.backdrop_path)
    user.favouriteMovies.push({
      movieId: movie.movieId,
      title: movie.title || "Unknown Title",
      imageUrl: String(movie.backdrop_path),
      rating: movie.rating || "N/A",
      addedBy: user.name || "Unknown",
    });

    await user.save();

    console.log("Movie added to wishlist:", movie);

    return NextResponse.json(
      { favouriteMovies: user.favouriteMovies },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding movie to wishlist:", error);
    return NextResponse.json(
      { message: "Error adding movie to wishlist" },
      { status: 500 }
    );
  }
}

const getUsersWhoFavoritedMovie = async (movieId) => {
  try {
    const users = await User.find(
      {
        favouriteMovies: {
          $elemMatch: { _id: movieId },
        },
      },
      { firstName: 1, lastName: 1, _id: 0 } // Project only firstName and lastName
    );
    
    const userNames = users.map((user) => `${user.firstName} ${user.lastName}`)

    return userNames;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
