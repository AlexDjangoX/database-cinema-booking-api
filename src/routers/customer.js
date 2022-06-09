const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
} = require("../controllers/customer");

const router = express.Router();

router.get("/", getAllCustomers);
router.post("/register", createCustomer);
router.patch("/update/:id", updateCustomer);

module.exports = router;
