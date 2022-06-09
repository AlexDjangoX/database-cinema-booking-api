const { movie } = require("../utils/prisma");
const prisma = require("../utils/prisma");

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      select: {
        title: true,
        runtimeMins: true,
        screenings: true,
      },
      //   include: {
      //     screenings: true,
      //   },
    });
    res.status(200).json({
      status: "Success",
      data: movies,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createMovie = async (req, res) => {
  const { title, runtimeMins, screenings } = req.body;
  console.log(screenings);
  try {
    const createdMovie = await prisma.movie.create({
      data: {
        title,
        runtimeMins,
        screenings: {
          create: {
            screenings,
          },
        },
      },
    });
    res.status(200).json({
      status: "Success",
      data: createdMovie,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getMovieById = async (req, res) => {
  const movieId = req.params.id * 1;
  const movies = await prisma.movie.findMany({});
  const foundMovie = movies.find((movie) => movie.id === movieId);

  try {
    if (!foundMovie) throw new Error();

    const movie = await prisma.movie.findUnique({
      where: {
        id: Number(movieId),
      },
    });
    res.status(200).json({
      status: "Success",
      data: movie,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Provide a valid ID" });
  }
};
