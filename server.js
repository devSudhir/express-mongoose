const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const connect = async () => {
  return await mongoose.connect("mongodb://127.0.0.1:27017/moviedb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

const movieSchema = new mongoose.Schema(
  {
    movie_name: { type: String, required: true },
    movie_genre: { type: String, required: true },
    production_year: { type: Number, required: true },
    budget: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Movie = mongoose.model("movie", movieSchema);

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().lean().exec();
    res.send(movies);
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.post("/movies", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ movie });
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({ movie });
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.patch("/movies/:id", async (req, res) => {
  try {
    const movies = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ movies });
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id).lean().exec();
    res.status(200).json({ movie });
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.listen("8001", async () => {
  await connect();
  console.log("App responded");
});
