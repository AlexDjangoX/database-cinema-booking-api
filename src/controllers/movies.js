const { request } = require("express");
const { movie } = require("../utils/prisma");
const prisma = require("../utils/prisma");

exports.getAllMovies = async (req, res) => {
  try {
    const requestQuery = req.query;

    if (Object.keys(requestQuery).length > 0) {
      const lowerLimit = Number(requestQuery.runtimeMins.lte);
      const upperLimit = Number(requestQuery.runtimeMins.gte);
      let createdMovie;
      console.log(lowerLimit, upperLimit);
      createdMovie = await prisma.movie.findMany({
        select: {
          title: true,
          runtimeMins: true,
          screenings: true,
        },
        where: {
          runtimeMins: {
            gt: upperLimit,
            lt: lowerLimit,
          },
        },
      });
      res.status(200).json({
        status: "Success",
        data: createdMovie,
      });
    } else {
      createdMovie = await prisma.movie.findMany({
        select: {
          title: true,
          runtimeMins: true,
          screenings: true,
        },
      });
      res.status(200).json({
        status: "Success",
        data: createdMovie,
      });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createMovie = async (req, res) => {
  const { title, runtimeMins, screenings } = req.body;
  console.log(title, runtimeMins, screenings);
  try {
    const foundMovie = await prisma.movie.findFirst({
      where: { title },
    });

    if (foundMovie) {
      return res.status(404).json({ status: "fail", message: "Movie exists" });
    }

    if (!foundMovie) {
      let createdMovie;

      if (screenings) {
        createdMovie = await prisma.movie.create({
          data: {
            title,
            runtimeMins,
            screenings: {
              create: screenings,
            },
          },
          include: {
            screenings: true,
          },
        });
        res.status(200).json({
          status: "Success",
          data: createdMovie,
        });
      } else {
        createdMovie = await prisma.movie.create({
          data: {
            title,
            runtimeMins,
          },
        });

        res.status(200).json({
          status: "Success",
          data: createdMovie,
        });
      }
    }
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
