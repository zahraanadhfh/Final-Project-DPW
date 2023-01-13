const router = require("express").Router();
const { user } = require("../../models/index");

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await user.create({ name, email, password, role });
    res.send({
      status: "success",
      message: "data berhasil dibuat",
    });
  } catch (err) {
    res.send({
      status: "failed",
      error: err.message,
      name: err.name,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await user.findAll({
      where: {
        email,
        password,
      },
    });
    res.send({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
});

module.exports = router;
