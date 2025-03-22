const express = require("express");
const {
  mainRecipe,
  newRecipe,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipeController");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../config/cloudinary");
const firebaseAuth = require("../middleware/firebaseAuth");
const upload = multer({ storage });

router.get("/main", mainRecipe);

router.post("/recipe/new", firebaseAuth, upload.single("image"), newRecipe);

router.delete("/recipe/delete/:id", firebaseAuth, deleteRecipe);

router.put(
  "/recipe/:id/edit",
  firebaseAuth,
  upload.single("image"),
  updateRecipe
);

module.exports = router;
