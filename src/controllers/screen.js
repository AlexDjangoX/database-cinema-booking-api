const prisma = require("../utils/prisma");

exports.getAllScreens = async (req, res) => {
  try {
    const screens = await prisma.screen.findMany({});

    res.status(200).json({
      status: "Success",
      data: screens,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createScreen = async (req, res) => {
  try {
    const { number } = req.body;
    const screen = await prisma.screen.create({
      data: {
        number,
      },
    });
    res.status(200).json({ status: "Success", data: screen });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
