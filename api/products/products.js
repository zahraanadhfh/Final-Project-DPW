const router = require("express").Router();
const { product } = require("../../models/index");

//dapetin keseluruhan data
router.get("/", async (req, res) => {
  try {
    const result = await product.findAll(); //"SELECT * FROM products"

    res.send({
      stasus: "success",
      statusCode: "200 OK",
      data: {
        product: result,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "failed",
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await product.destroy({
      where: {
        id: req.params.id,
      },
      truncate: { cascade: true },
    });

    res.send({
      status: "success",
      message: "Product has been successfully deleted",
    });
  } catch (err) {
    res.status(404).send({
      status: "failed",
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  req.body.desc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam aliquet non arcu sed rutrum. Morbi ut felis ut ligula viverra eleifend eu ut lacus. Proin venenatis blandit felis, at fermentum massa luctus sed. Curabitur eu nulla tortor. Donec et hendrerit erat. Ut imperdiet erat vitae quam gravida, a ornare ligula fringilla. Curabitur malesuada nulla leo, a auctor enim sollicitudin finibus. Integer viverra, libero ut rutrum auctor, dui sem euismod est, quis sodales mauris libero vel augue. Mauris eget elit condimentum, volutpat libero vitae, sagittis nisi. Cras libero dolor, convallis sit amet risus sit amet, dapibus congue mauris.";
  req.body.stock = 100;
  const { name, image, price, material, weight, desc, stock } = req.body;
  try {
    //INSERT INTO
    const result = await product.create({
      name,
      image,
      price,
      material,
      weight,
      desc,
      stock,
    });

    res.status(201).send({
      status: "success",
      message: "Data has been successfully created",
      data: {
        product: result,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //SELECT
    const result = await product.findOne({ where: { id } });

    if (!result) throw new Error("Product is not found");

    res.send({
      status: "success",
      data: {
        product: result,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //DELETE
    const result = await product.destroy({ where: { id: req.params.id } });

    res.send({
      status: "success",
      message: "Data has been successfully destroyed",
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: "Invalid ID, data is not deleted",
    });
  }
});
module.exports = router;
