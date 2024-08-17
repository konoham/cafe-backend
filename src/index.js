const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { createClient } = require("@supabase/supabase-js");
const midtransClient = require("midtrans-client");

dotenv.config();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get("/", (req, res) => {
  res.send("UTAMA");
});

app.get("/CART/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.json({ data: [], message: "Email none", email });

  const { data: sendProduct, error } = await supabase.from("product-cart").select("*").eq("email", email);

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ data: sendProduct, success: true });
});

app.post("/CART", async (req, res) => {
  const { name, price, images, email, country, qty } = req.body;

  const { data: sendProduct, error } = await supabase.from("product-cart").insert({ name, price, images, email, country, qty });

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.status(200).json({ success: true, data: sendProduct });
});

app.patch("/CART/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { qty } = req.body;

  console.log(qty);

  const { data: sendProduct, error } = await supabase.from("product-cart").update({ qty }).eq("id", id);

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.status(200).json({ success: true, data: sendProduct, message: "Update products success" });
});

app.delete("/CART/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const { error } = await supabase.from("product-cart").delete().eq("id", id);

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.status(200).json({ success: true, message: "Delete product success from cart" });
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
        order_id: `${Date.now()}-${buyingProduct.id}-${Math.floor(Math.random() * 1000)}`,
        gross_amount: buyingProduct.price * buyingProduct.qty,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    res.send({ success: true, token, message: "Snap open" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
