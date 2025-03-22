require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const cors = require("cors");
const Recipe = require("./models/recipe");
const recipes = require("./data/data");
const url = process.env.MONGO_URL;

const recipeRoute = require("./src/router/recipeRoute");
const queryRoute = require("./src/router/queryRoute");

main()
  .then((res) => console.log(`DB Connected Successfully`))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(url);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://recipee-share.vercel.app"],
    credentials: true,
  })
);

app.use("/", recipeRoute);
app.use("/", queryRoute);

app.get("/", (req, res) => {
  res.send("Hi there welcome to server");
});

app.listen(PORT, () => {
  console.log(`App is listening on port : ${PORT}`);
});
