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

app.get("/product", async (req, res) => {
  const product = await prisma.product.findMany();
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

app.get("/CART/:id", async (req, res) => {
  const productId = req.params.id;
  const sendProduct = await prisma.productCart.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
  res.send(sendProduct);
});
app.post("/CART", async (req, res) => {
  const dataProduct = req.body;
  try {
    const sendProduct = await prisma.productCart.create({
      data: {
        name: dataProduct.name,
        price: dataProduct.price,
        images: dataProduct.images,
        email: dataProduct.email,
        country: dataProduct.country,
        qty: dataProduct.qty,
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
      data: dataProduct,
    });
  }
});
app.patch("/CART/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const dataProduct = req.body;
  try {
    const sendProduct = await prisma.productCart.update({
      where: {
        id: productId,
      },
      data: {
        qty: dataProduct.qty,
      },
    });
    console.log(productId);
    console.log(dataProduct);

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
        order_id: Number(
          Date.now().toString() +
            Math.floor(Math.random() * 1000) +
            buyingProduct.id
        ),
        gross_amount: buyingProduct.price * buyingProduct.qty,
      },
    };
    console.log(parameter);
    console.log(buyingProduct);
    const token = await snap.createTransactionToken(parameter);

    res.send({
      success: true,
      token: token,
      message: "snap open",
    });
  } catch (error) {
    const simpleError = JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    ); // Remove circular structure
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
