const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

dotenv.config();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("UTAMA");
});

app.get("/product", async (req, res) => {
  const product = await prisma.findMany();
  res.send(product);
});

app.post("/product", async (req, res) => {
  const data = req.body;

  const sendProduct = await prisma.create({
    data: {
      name: data.name,
      price: data.price,
      images: data.images,
    },
  });
  res.status(200).send({
    data: sendProduct,
    message: "send product succses",
  });
});

app.get("/CART", async (req, res) => {
  const sendProduct = await prisma.productCart.findMany();
  res.send(sendProduct);
});

app.post("/CART", async (req, res) => {
  const { name, price, images, email, country } = req.body;
  try {
    const sendProduct = await prisma.productCart.create({
      data: {
        name: name,
        price: price,
        images: images,
        email: email,
        country: country,
      },
    });

    res.status(200).json({
      success: true,
      data: sendProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart products",
      error: error.meta.target,
      data: name,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
