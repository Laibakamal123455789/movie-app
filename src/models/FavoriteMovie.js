import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true
  },
  movieId:{
    type: String,
    required: true,
    unique: true
  },
  title:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
});

export let Favorite= mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
