
import dbConnect from "@/app/db/dbConnect";
import { Favorite } from "@/models/FavoriteMovie";


export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  if (method === "POST") {
    try {
      const { userId, movieId, title, image } = req.body;

      // Check if movie already exists in favorites
      const existingFavorite = await Favorite.findOne({ userId, movieId });
      if (existingFavorite) {
        return res.status(400).json({ message: "Movie already in favorites" });
      }

      // Add movie to favorites
      const newFavorite = new Favorite({ userId, movieId, title, image });
      await newFavorite.save();
      return res.status(201).json({ message: "Movie added to favorites" });
    } catch (error) {
      return res.status(500).json({ message: "Error adding to favorites", error });
    }
  }

  if (method === "GET") {
    try {
      const { userId } = req.query;
      const favorites = await Favorite.find({ userId });
      return res.status(200).json(favorites);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching favorites", error });
    }
  }

  // If method is not POST or GET
  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).json({ message: `Method ${method} Not Allowed` });
}
