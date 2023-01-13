//memanggil para library
const express = require("express"); //web framework yang berbasis unopinionited
const app = express(); //manggil function express
require("dotenv").config(); //environtment variable //akan dipanggil variable .env
const axios = require("axios"); //http client
const apiProducts = require("./api/products/products");
const apiUsers = require("./api/user/users");
const apiTransaction = require("./api/transactions/transactions");
const apiCarts = require("./api/carts/carts");
const cookieParser = require("cookie-parser"); //session management
const cookieMiddleware = require("./cookie.middleware"); //authentifikasi
const multer = require("multer"); // library untuk memasukan file
// const swal = require("sweetalert");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const PORT = process.env.EXPRESS_PORT || 3000; //sub-ipaddress

app.set("view engine", "ejs"); //templating engine
app.use(cookieParser(" "));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form

//email:rafly@gmail.com
//password:12345

//NULL

//middle-ware mengatur public
app.use(express.static("public"));

//REST-API
app.use("/api/products", apiProducts);
app.use("/api/users", apiUsers);
app.use("/api/transactions", apiTransaction);
app.use("/api/carts", apiCarts);

//CONSUMING-API/FETCHING API
app.get("/", async (req, res) => {
  //http client

  //JSON(Javascript Object notation) = format pertukaran data ringan yang digunakan untuk bertukar informasi

  const result = await axios.get("http://localhost:5000/api/products");

  res.render("index", result.data);
});

//http-method:GET(menampilkan data)
app.get("/login", (req, res) => {
  let attempt = "";

  //password/email itu salah. tampilkan pesan ini.
  if (req.query.attempt) {
    attempt = "failed";
    return res.render("login", { attempt });
  }

  //kalau bener tampilkan ini
  res.render("login", { attempt });
});

//HTTP-METHOD(POST): digunakan untuk mengirim data
app.post("/login", async (req, res) => {
  //body/payload
  const { email, password } = req.body;
  const result = await axios.post("http://localhost:5000/api/users/login", {
    email,
    password,
  });
  const { data } = result.data;

  //data ngga ketemu
  if (data.length === 0) {
    const string = encodeURIComponent("failed");
    return res.redirect(`/login?attempt=${string}`);
  }

  const options = {
    maxAge: 9000000,
    httpOnly: true,
  };
  res.cookie("x-access", [data[0].id, data[0].role], options); //session management
  res.redirect("/dashboard");
});

app.get("/dashboard", cookieMiddleware, (req, res) => {
  res.render("dashboard", {});
});

app.get("/register", (req, res) => {
  res.render("register", { isValid: false, method: "GET" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await axios.post("http://localhost:5000/api/users", {
      name,
      email,
      password,
      role,
    });
    const data = result.data;
    if (data.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email is already in use");
    } else if (data.error === "Validation error") {
      throw new Error("Wrong input!");
    }

    // console.log(req.body);
    res.render("register", { isValid: true, method: "POST" });
  } catch (err) {
    // console.log(err.message);
    res.render("register", {
      isValid: false,
      method: "POST",
      message: err.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("x-access"); //data user nya harus dihapus
  res.redirect("/");
});

app.get("/shop", cookieMiddleware, async (req, res) => {
  const [id, role] = req.cookies["x-access"];

  const result = await axios.get("http://localhost:5000/api/products");
  const { product } = result.data.data;

  res.render("shop", { id, role, product: product });
});

app.get("/admin", cookieMiddleware, (req, res) => {
  res.render("admin", { message: "" });
});

app.post(
  "/admin",
  upload.single("product"),
  cookieMiddleware,
  async (req, res) => {
    try {
      const { name, price, material, weight } = req.body;
      console.log(req.file);
      if (req.file === undefined) {
        return res.render("admin", { message: "failed" });
      }
      const { destination } = req.file;
      const splitDestination = destination.split("/");
      const image = splitDestination[1] + "/" + req.file.filename;
      const result = await axios.post("http://localhost:5000/api/products", {
        name,
        price,
        material,
        weight,
        image,
      });
      res.render("admin", { message: "success" });
    } catch (err) {
      console.log(err);
      res.render("admin", { message: "failed" });
    }
  }
);

app.get("/men-catalog", (req, res) => {
  res.render("men", {});
});
app.get("/women-catalog", (req, res) => {
  res.render("women", {});
});
app.get("/transaction", async (req, res) => {
  const result = await axios.get(
    "http://localhost:5000/api/products/" + req.query.productId
  );
  const { product } = result.data.data;

  res.render("transaction", { product });
});

app.get("/aboutus", (req, res) => {
  res.render("about", {});
});

app.get("/delete/product/:id", async (req, res) => {
  const { id } = req.params;
  const result = await axios.delete("http://localhost:5000/api/products/" + id);

  res.redirect("/shop");
});

app.listen(PORT, () => {
  console.log("SERVER IS LISTENING TO THE PORT", PORT);
});
