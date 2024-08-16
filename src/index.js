const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { PrismaClient } = require("@prisma/client");
const midtransClient = require("midtrans-client");

const prisma = new PrismaClient();

dotenv.config();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("UTAMA");
});

app.get("/CART/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.json({ data: [], massage: "email none", email });
  const sendProduct = await prisma.productCart.findMany({
    where: {
      email,
    },
  });
  res.json({ data: sendProduct });
});

app.post("/CART", async (req, res) => {
  const { name, price, images, email, country, qty } = req.body;
  try {
    const sendProduct = await prisma.productCart.create({
      data: {
        name,
        price,
        images,
        email,
        country,
        qty,
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
      data: req.body,
    });
  }
});

app.patch("/CART/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { qty } = req.body;
  console.log({ qty, id });

  try {
    const sendProduct = await prisma.productCart.update({
      where: {
        id,
      },
      data: {
        qty,
      },
    });

    res.status(200).json({
      success: true,
      data: sendProduct,
      message: "update products succses",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart products",
      error: error,
    });
  }
});

app.delete("/CART/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    await prisma.productCart.delete({
      where: {
        id: productId,
      },
    });
    res.status(200).json({
      success: true,
      message: "delete products succses from card",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch delete products from cart",
      error: error,
    });
  }
});

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

app.post("/CART/BUY", async (req, res) => {
  const buyingProduct = req.body;
  try {
    let parameter = {
      transaction_details: {
        order_id: Number(Date.now().toString() + Math.floor(Math.random() * 1000) + buyingProduct.id),
        gross_amount: buyingProduct.price * buyingProduct.qty,
      },
    };
    console.log(parameter);
    const token = await snap.createTransactionToken(parameter);
    console.log(token);

    res.send({
      success: true,
      token: token,
      message: "snap open",
    });
  } catch (error) {
    const simpleError = JSON.stringify(error, Object.getOwnPropertyNames(error)); // Remove circular structure
    res.send({
      success: false,
      error: simpleError,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
