const router = require("express").Router();
const { transaction, user } = require("../../models/index");

router.get("/", async (req, res) => {
  try {
    const result = await transaction.findAll({
      include: user,
    });
    res.send({
      status: "success",
      data: {
        transactions: result,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { userId, name, price, total, total_transaction } = req.body;

  try {
    const result = await transaction.create({
      userId,
      name,
      price,
      total,
      total_transaction,
    });

    res.status(201).send({
      status: "success",
      data: {
        transaction: result,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = router;
