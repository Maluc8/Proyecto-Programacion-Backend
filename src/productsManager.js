import fs from "fs/promises";

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

class productManager {
  constructor() {
    this.path = "./Products.json";
    this.products = [];
  }

  async loadProducts() {
    try {
      this.products = await readFile(this.path);
    } catch (err) {
      console.error(`No existe el archivo.`);
    }
  }

  generateId() {
    if (this.products.length == 0) {
      return 1;
    }
    return this.products.reduce((mayor, actual) => {
      return Math.max(...this.products.map((p) => p.id)) + 1;
    });
  }

  validate(title, description, price, thumbnail, code, stock) {
    return (
      title != null &&
      description != null &&
      price != null &&
      thumbnail != null &&
      code != null &&
      stock != null &&
      this.products.find((element) => element.code == code) == undefined
    );
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (this.validate(title, description, price, thumbnail, code, stock)) {
      this.products.push({
        id: this.generateId(),
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      });
      await saveData(this.path, JSON.stringify(this.products));
      return true;
    } else {
      return false;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    return this.products.find((element) => element.id == id) || false;
  }

  updateProduct(prod) {
    const index = this.products.findIndex((p) => p.id == prod.id);
    if (index < 0) return false;
    Object.assign(this.products[index], prod);
    return true;
  }

  async deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter((prod) => prod.id != id);
    if (initialLength === this.products.length) {
      return false;
    } else {
      await saveData(this.path, JSON.stringify(this.products));
      return true;
    }
  }
}

export default productManager;
