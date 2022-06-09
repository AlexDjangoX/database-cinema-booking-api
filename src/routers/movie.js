const express = require("express");
const {
  getAllMovies,
  createMovie,
  getMovieById,
} = require("../controllers/movies");

const router = express.Router();

router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.post("/movies", createMovie);

module.exports = router;
