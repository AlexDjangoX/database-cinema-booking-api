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
          id: true,
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
        // include: {
        //   screenings: true,
        // },
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
      throw new Error();
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
  const movieId = req.params.id;
  const foundMovie = await prisma.movie.findFirst({
    where: {
      OR: [
        {
          id: Number(movieId) || undefined,
        },
        {
          title: {
            equals: movieId,
          },
        },
      ],
    },
  });

  try {
    if (!foundMovie) throw new Error();

    const movie = await prisma.movie.findFirst({
      where: {
        OR: [
          {
            id: Number(movieId) || undefined,
          },
          {
            title: {
              equals: movieId,
            },
          },
        ],
      },
      include: {
        screenings: true,
      },
    });
    res.status(200).json({
      status: "Success",
      data: movie,
    });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ status: "fail", message: "Provide a valid ID or Title" });
  }
};

exports.updateMovie = async (req, res) => {
  const movieId = Number(req.params.id);
  const { title, runtimeMins, screenings } = req.body;

  const updatedMovie = await prisma.movie.update({
    where: {
      id: movieId,
    },
    data: {
      title,
      runtimeMins,
      screenings: {
        update: screenings.map((screening) => {
          return {
            where: {
              id: screening.id,
            },
            data: {
              screenId: screening.screenId,
              startsAt: screening.startsAt,
            },
          };
        }),
      },
    },
  });

  res.json({ data: updatedMovie });
};

// exports.updateMovie = async (req, res) => {
//   try {
//     const movieId = Number(req.params.id);
//     const { title, runtimeMins, screenings } = req.body;

//     const updatedMovie = await prisma.movie.update({
//       where: {
//         id: movieId,
//       },
//       data: {
//         title,
//         runtimeMins,
//         screenings: {
//           update: screenings.map((screening) => {
//             return {
//               where: {
//                 id: screening.id,
//               },
//               data: {
//                 screenId: screening.screenId,
//                 startsAt: screening.startsAt,
//               },
//             };
//           }),
//         },
//       },
//     });
//     res.status(200).json({ status: "Success", data: updatedMovie });
//   } catch (err) {
//     console.error(err);
//     res.status(404).json({ status: "fail", message: "Provide a valid ID" });
//   }
// };
