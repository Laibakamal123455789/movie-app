import { User } from "@/models/userModel"; 
import jwt from "jsonwebtoken";
import { connectKaro } from "@/app/db/db"; 
export async function GET(req, res) {
  await connectKaro(); 

  try {
    const token = req.headers.get("authorization")?.split(" ")[1]; 
    console.log(token)
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ favouriteMovies: user.favouriteMovies }); 
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error fetching wishlist" });
  }
}

export async function POST(req, res) {
  await connectKaro(); 

  try {
    const { movie } = await req.json(); 
    const token = req.headers.get("authorization")?.split(" ")[1]; 

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const isAlreadyAdded = user.favouriteMovies.some(
      (m) => m.movieId.toString() === movie.movieId
    );

    if (isAlreadyAdded) {
      return res.status(400).json({ message: "Movie already in wishlist" });
    }

    user.favouriteMovies.push(movie); 
    await user.save(); // Save updated user

    return res.status(200).json({ favouriteMovies: user.favouriteMovies }); // Return updated wishlist
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error adding movie to wishlist" });
  }
}
