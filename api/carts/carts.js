const router = require("express").Router();
const { cart, product } = require("../../models/index");

router.get("/", async (req, res) => {
  try {
    const result = await cart.findAll({ include: product });

    res.send({
      status: "success",
      data: {
        cart: result,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "failed",
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { product_name, total_product, price, productId } = req.body;

    const result = await cart.create({
      product_name,
      total_product,
      price,
      productId,
    });

    res.status(201).send({
      status: "success",
      data: {
        cart: result,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.message.includes("violates")) {
      return res.status(400).send({
        status: "failed",
        message: "there's no match Product Id",
      });
    }
    res.status(404).send({
      status: "failed",
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await cart.destroy({ where: { id: req.params.id } });
    res.send({
      status: "success",
      message: "Your cart has been successfully deleted",
    });
  } catch (err) {
    res.status(404).send({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = router;
