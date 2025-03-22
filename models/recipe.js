const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    id: Number,
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"], // Optional: restrict to only these values
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: String,
    servings: Number,
    ingredients: {
      type: [String], // Array of strings
      required: true,
    },
    instructions: {
      type: [String], // Array of strings
      required: true,
    },
    nutritionFacts: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    author: String,
    authorId: String,
    datePublished: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
      },
      count: Number,
    },
  },
  { timestamps: true }
);

// Create the model
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
