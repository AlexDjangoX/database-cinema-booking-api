const prisma = require("../utils/prisma");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        contact: true,
      },
    });
    res.status(200).json({
      status: "Success",
      data: customers,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    const createdCustomer = await prisma.customer.create({
      data: {
        name,
        contact: {
          create: {
            phone,
            email,
          },
        },
      },
      include: {
        contact: true,
      },
    });

    res.status(200).json({ data: createdCustomer });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id * 1;
    const { name, phone, email } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        contact: {
          update: { phone, email },
        },
      },
    });
    res.status(200).json({ status: "Success", data: updatedCustomer });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: "Provide a valid ID" });
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  getAllCustomers,
};

/**
 * This `create` will create a Customer AND create a new Contact, then automatically relate them with each other
 * @tutorial https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
 */

// We add an `include` outside of the `data` object to make sure the new contact is returned in the result
// This is like doing RETURNING in SQL
