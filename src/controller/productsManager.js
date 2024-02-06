// NOTE: Default value for .json file is ./src/db.json

const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path || "./src/models/products.json";
    this.products;
  }

  async checkDb() {
    if (!this.products) {
      try {
        let db;
        if (fs.existsSync(this.path)) {
          db = await fs.promises.readFile(this.path);
        } else {
          await fs.promises.writeFile(this.path, JSON.stringify([]));
          db = await fs.promises.readFile(this.path);
        }
        this.products = JSON.parse(db);
      } catch (err) {
        console.log("error while checkingDb");
        console.log("err", err);
      }
    }
  }

  async addProduct(product) {
    try {
      await this.checkDb();
      if (this.products.some((e) => e?.code == product.code)) {
        console.log("Product already exists");
        return `Product already exists`
      } else if (this.checkNewProduct(product)) {
        const newId = this.generateId();
        this.products = [...this.products, { ...product, id: newId }];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
        console.log(`Product added with id ${newId}`);
        return `Product added with id ${newId}`;
      } else {
        console.log("invalid product");
        return `Invalid product`;
      }
    } catch (err) {
      console.log("error while trying to add product");
    }
  }

  async getProducts() {
    await this.checkDb();
    return this.products;
  }

  async getProductById(id) {
    await this.checkDb();
    const response = this.products.find((e) => e.id == id);
    console.log(`product with id "${id}":`, response);
    return response;
  }

  async updateProductById(id, fields) {
    await this.checkDb();
    const checkProduct = this.products.find((e) => e.id == id);
    if (checkProduct) {
      this.products = this.products.map((e) =>
        e.id == id ? { ...e, ...fields } : e
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 4)
      );
    } else {
      console.log("Product to update not found");
    }
  }

  async deleteProductById(id) {
    try {
      await this.checkDb();
      const checkProduct = this.products.find((e) => e.id == id);
      if (checkProduct) {
        this.products = this.products.filter((e) => e.id != id);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
      } else {
        console.log("Product to delete not found");
      }
    } catch (err) {
      console.log("error while trying to delete product");
    }
  }

  // TODO CAMBIAR LOS CAMPOS DEL OBJECTO PRODUCT
  checkNewProduct(product) {
    const fields = [
      "title",
      "description",
      "price",
      "code",
      "stock",
      "status",
      "category"
    ];
    if (fields.every((e) => e == "status" ? !!(typeof product[e] == "boolean") : product[e])) return true;
    return false;
  }

  generateId() {
    const newId = Date.now().toString(36) + Math.random().toString(36);
    if (this.products.some((e) => e.id == newId)) {
      return generateId();
    } else {
      return newId;
    }
  }
}

module.exports = ProductManager;
