const prisma = require("../utils/prisma");

exports.createTicket = async (req, res) => {
  try {
    const { customerId, screeningId } = req.body;
    console.log(req.body);
    const ticket = await prisma.ticket.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
        screening: {
          connect: { id: screeningId },
        },
      },
    });
    res.status(200).json({ status: "success", data: ticket });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};
