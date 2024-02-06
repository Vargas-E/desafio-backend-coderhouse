const express = require("express");
const router = express.Router();
const ProductManager = require("../controller/productsManager");
const socket = require("socket.io");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// Se agrega al req desde app.js la variable httpServer. Se toma aca de manera
// que solo se inicia la conexion con el websocker en esta ruta.
router.get("/realtimeproducts", async (req, res) => {
  var httpServer = req.httpServer;
  const io = socket(httpServer);
  const productManager = new ProductManager("./src/models/products.json");

  try {
    io.on("connection", async (socket) => {
      console.log("Initiatin websocket connection");
      // Mandar productos
      socket.emit("products", await productManager.getProducts());

      // Borrar productos
      socket.on("deleteProduct", async (id) => {
        await productManager.deleteProductById(id);
        io.sockets.emit("products", await productManager.getProducts());
      });

      // Agregar productos
      socket.on("addProduct", async (newProduct) => {
        console.log("newProduct:", newProduct);
        const addResponse = await productManager.addProduct(newProduct);
        if (addResponse == `Product already exists`) {
          io.sockets.emit("products", false);
        }
        io.sockets.emit("products", await productManager.getProducts());
      });
    });
    res.render("realtimeproducts");
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
