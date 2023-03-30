import fs from "fs/promises";
import { createServer } from "http";
import { productManager } from "./productsManager.js";

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
    this.path = "./Carts.json";
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
    await saveData(this.path, JSON.stringify(this.carts));
  }

  getCarts() {
    return this.carts;
  }

  getcartsById(idCart) {
    return (
      this.carts.find((element) => element.idCart == idCart) ||
      "Product not found"
    );
  }

  async updateCart(indexCart, idProd, quantity) {
    const cartPos = this.carts.findIndex((c) => c.idCart == indexCart);
    if (cartPos < 0) return `No exite el carrito con ese ID`;
    const prodPos = this.carts[cartPos].products.findIndex(
      (e) => e.idProd === idProd
    );
    if (prodPos >= 0) {
      this.carts[cartPos].products[prodPos].quantity = quantity;
    } else {
      this.carts[cartPos].products.push({
        idProd: idProd,
        quantity: quantity,
      });
    }
    /*if (
      this.carts[indexCart - 1].products.findIndex(
        (element) => element.idProd === idProd
      )
    ) {
      this.carts[indexCart - 1].quantity = quantity;
    } else {
      this.carts[indexCart - 1].products.push({
        idProd: idProd,
        quantity: quantity,
      });
    }
    saveData(this.path, JSON.stringify(this.carts));
    */
  }

  async deleteCart(id) {
    this.carts = this.carts.filter((c) => c.idCart !== id);
    saveData(this.path, JSON.stringify(this.carts));
  }
}

export default cartManager;
