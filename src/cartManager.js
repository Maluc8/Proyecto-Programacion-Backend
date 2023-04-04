import fs from "fs/promises";
import productManager from "./productsManager.js";

async function readFile(path) {
  try {
    const data = await fs.readFile(path, "utf-8");
    return data == "" ? [] : JSON.parse(data);
  } catch (err) {
    return [];
    console.error(err);
  }
}

async function saveData(path, data) {
  try {
    await fs.writeFile(path, data);
  } catch (err) {
    console.error(err);
  }
}

class cartManager {
  constructor() {
    this.path = "./Carritos.json";
    this.carts = [];
  }

  async loadCarts() {
    try {
      this.carts = await readFile(this.path);
    } catch (err) {
      console.error(`No existe el archivo.`);
    }
  }

  generateId() {
    if (this.carts.length == 0) {
      return 1;
    }
    return Math.max(...this.carts.map((c) => c.idCart)) + 1;
  }

  async addCart() {
    this.carts.push({
      idCart: this.generateId(),
      products: [],
    });
    try {
      await saveData(this.path, JSON.stringify(this.carts));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  getCarts() {
    return this.carts;
  }

  getCartsById(idCart) {
    return (
      this.carts.find((element) => element.idCart == idCart) ||
      "Product not found"
    );
  }

  async updateCart(indexCart, idProd, quantity) {
    const cartPos = this.carts.findIndex((c) => c.idCart == indexCart);
    if (cartPos < 0) return false;
    const prodPos = this.carts[cartPos].products.findIndex(
      (c) => c.idProd === idProd
    );
    const productsManager = new productManager();
    await productsManager.loadProducts();
    if (!productsManager.getProductsById(idProd)) return false;
    if (prodPos >= 0) {
      this.carts[cartPos].products[prodPos].quantity = quantity;
    } else {
      this.carts[cartPos].products.push({
        idProd: idProd,
        quantity: quantity,
      });
    }
    await saveData(this.path, JSON.stringify(this.carts));
    return true;
  }

  async deleteCart(id) {
    const initialLength = this.carts.length;
    this.carts = this.carts.filter((c) => c.idCart !== id);
    if (initialLength === this.carts.length) {
      return false;
    } else {
      await saveData(this.path, JSON.stringify(this.carts));
      return true;
    }
  }
}

export default cartManager;
