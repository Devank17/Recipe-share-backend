const Recipe = require("../../models/recipe");
const { cloudinary } = require("../../config/cloudinary");

const mainRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).send(recipes);
  } catch (err) {
    console.log("Error fetching recipe", err);
    res.status(500).send({ message: "Failed to fetch recipes" });
  }
};

const newRecipe = async (req, res) => {
  try {
    let { path: url } = req.file;
    const publicId = req.file ? req.file.filename : "";

    const ingredients = JSON.parse(req.body.ingredients);
    const instructions = JSON.parse(req.body.instructions);
    const nutritionFacts = JSON.parse(req.body.nutritionFacts);
    const tags = JSON.parse(req.body.tags);
    const ratings = JSON.parse(req.body.ratings);

    // Create a new Recipe using the formatted data and Cloudinary image URL
    const newRecipe = new Recipe({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      time: req.body.time,
      difficulty: req.body.difficulty,
      image: url,
      imagePublicId: publicId,
      servings: parseInt(req.body.servings),
      ingredients,
      instructions,
      nutritionFacts,
      author: req.user.name,
      authorId: req.user.uid,
      tags,
      ratings,
    });

    await newRecipe.save();
    res
      .status(200)
      .send({ message: "Your recipe added successfully", recipe: newRecipe });
  } catch (err) {
    res.status(500).send({
      message: "Failed to create recipe",
      error: err.message,
      details: err.toString(),
    });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the existing recipe
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) {
      return res.status(404).send({ message: "Recipe not found" });
    }

    // Check if the authenticated user is the owner of the recipe
    if (existingRecipe.authorId !== req.user.uid) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this recipe" });
    }

    let updateData = {};

    // Process basic fields
    updateData.title = req.body.title;
    updateData.category = req.body.category;
    updateData.description = req.body.description;
    updateData.time = req.body.time;
    updateData.difficulty = req.body.difficulty;
    updateData.image = req.body.image;
    updateData.servings = parseInt(req.body.servings);

    // Parse JSON strings back to arrays/objects
    updateData.ingredients = JSON.parse(req.body.ingredients);
    updateData.instructions = JSON.parse(req.body.instructions);
    updateData.nutritionFacts = JSON.parse(req.body.nutritionFacts);
    updateData.tags = JSON.parse(req.body.tags);
    updateData.ratings = JSON.parse(req.body.ratings);
    updateData.author = req.body.author;

    // Handle image update if provided
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedRecipe) {
      return res.status(404).send({ message: "Recipe not found" });
    }

    res.status(200).send({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to update recipe",
      error: err.message,
      details: err.toString(),
    });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    let { id } = req.params;

    //* Retrieve the recipe so we can get its image public ID
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).send({ message: "Recipe not found" });
    }

    //* Verify that the authenticated user is the owner
    if (recipe.authorId !== req.user.uid) {
      return res
        .status(403)
        .send({ message: "You are not authorized to delete this recipe" });
    }

    //* If an imagePublicId exists, delete the image from Cloudinary
    if (recipe.imagePublicId) {
      await cloudinary.uploader.destroy(recipe.imagePublicId);
    }

    let delRecipe = await Recipe.findByIdAndDelete(id);
    res
      .status(200)
      .send({ message: "Your recipe deleted successfully", recipe: delRecipe });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete recipe",
      error: err.message,
      details: err.toString(),
    });
  }
};

module.exports = {
  mainRecipe,
  newRecipe,
  updateRecipe,
  deleteRecipe,
};
