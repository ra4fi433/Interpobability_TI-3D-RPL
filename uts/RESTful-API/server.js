const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Dummy database
let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 25 }
];

// GET /products → semua produk
app.get("/products", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(products);
});

// GET /products/:id → detail produk
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(product);
});

// POST /products → tambah produk
app.post("/products", (req, res) => {
  const { name, price } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };

  products.push(newProduct);

  res.setHeader("Content-Type", "application/json");
  res.status(201).json(newProduct);
});

// PUT /products/:id → update produk
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, price } = req.body;

  if (name) product.name = name;
  if (price != null) product.price = price;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(product);
});

// DELETE /products/:id → hapus produk
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deleted = products.splice(index, 1);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: "Product deleted",
    product: deleted[0]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});