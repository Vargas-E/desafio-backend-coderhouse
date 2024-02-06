const fs = require("fs");
const ProductManager = require("./productsManager");

class CartsManager {
  constructor(path) {
    this.path = path || "./src/models/carts.json";
    this.carts;
  }

  async checkDb() {
    if (!this.carts) {
      try {
        let db;
        if (fs.existsSync(this.path)) {
          db = await fs.promises.readFile(this.path);
        } else {
          await fs.promises.writeFile(this.path, JSON.stringify([]));
          db = await fs.promises.readFile(this.path);
        }
        this.carts = JSON.parse(db);
      } catch (err) {
        console.log("error while checkingDb");
        console.log("err", err);
      }
    }
  }

  async createCart() {
    try {
      await this.checkDb();
      const newCart = {
        id: this.generateId(),
        products: [],
      };
      this.carts = [...this.carts, newCart];
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 4)
      );
      return newCart.id;
    } catch (err) {
      console.log("error while trying to add new cart");
    }
  }

  async addProductToCart(productId, cartId) {
    await this.checkDb();
    const cart = this.carts.find((e) => e.id == cartId);
    if (cart) {
      this.carts = this.carts.map((e, i) =>
        e.id != cartId
          ? e
          : { ...e, products: this.productsHandler(e.products, productId) }
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 4)
      );
      return `Products of cart with id ${cartId} updated`;
    } else {
      return `Cart with id ${cartId} not found`;
    }
  }

  productsHandler(products, productId) {
    if (products.some((e) => e.product == productId)) {
      return products.map((e) =>
        e.product != productId ? e : { ...e, quantity: e.quantity + 1 }
      );
    } else {
      return [...products, { product: productId, quantity: 1 }];
    }
  }

  async getCart(id) {
    await this.checkDb();
    if (id) {
      const cart = this.carts.find((e) => e.id == id);
      if (cart) {
        const productManager = new ProductManager("./src/models/products.json");
        const products = await productManager.getProducts();
        const productsFromIds = cart.products.map((e) => {
          const p = products.find((a) => {
            return a.id == e.product;
          });
          return { ...p, quantity: e.quantity };
        });
        return { ...cart, products: productsFromIds };
      }
    }
  }

  generateId() {
    const newId = Date.now().toString(36) + Math.random().toString(36);
    if (this.carts.some((e) => e.id == newId)) {
      return generateId();
    } else {
      return newId;
    }
  }
}

module.exports = CartsManager;
