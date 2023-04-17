import { Router } from "express";
import express from "express";
import productManager from "../productsManager.js";

const productRouter = Router();
const productsManager = new productManager();

productRouter.use(express.urlencoded({ extended: true }));
productRouter.use(express.json());

productRouter.get("/api/products", async (req, res) => {
  try {
    await productsManager.loadProducts();
  } catch (e) {
    console.error(e);
  } finally {
    if (req.query.hasOwnProperty(`limit`)) {
      const limite = +req.query.limit;
      res.send(productsManager.getProducts().slice(0, limite));
    } else {
      const products = productsManager.getProducts();
      res.render(`cards`, { title: `Store`, products });
    }
  }
});
productRouter.get("/api/products/:id", async (req, res) => {
  try {
    await productsManager.loadProducts();
  } catch (e) {
    console.error(e);
  } finally {
    res.send(productsManager.getProductsById(req.params.id));
  }
});

productRouter.post("/api/products", async (req, res) => {
  let sucess;
  try {
    await productsManager.loadProducts();
    const { title, description, price, thumbnail, code, stock } = req.body;
    sucess = await productsManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
  } catch (e) {
    console.error(e);
  } finally {
    sucess
      ? res.status(200).send({ message: "Inserted successfully" })
      : res.status(409).send({ message: "Product code already exists" });
  }
});

productRouter.put("/api/products", async (req, res) => {
  let sucess;
  try {
    await productsManager.loadProducts();
    sucess = productsManager.updateProduct(req.body);
  } catch (e) {
    console.error(e);
  } finally {
    sucess
      ? res.status(200).send({ message: "Updated successfully" })
      : res.status(409).send({ message: "Error" });
  }
});

productRouter.delete("/api/products", async (req, res) => {
  let sucess;
  try {
    await productsManager.loadProducts();
    sucess = await productsManager.deleteProduct(req.body.id);
  } catch (e) {
    console.error(e);
  } finally {
    sucess
      ? res.status(200).send({ message: "Deleted successfully" })
      : res.status(409).send({ message: "Error" });
  }
});

productRouter.get("/api/realTimeProducts", async (req, res) => {
  try {
    await productsManager.loadProducts();
    const products = productsManager.getProducts();
    res.render(`realTimeProducts`, {
      title: `Real Time Store`,
      script: `<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js"></script>
    <script src="/js/index.js" type="text/javascript"></script>`,
      products,
    });
  } catch (e) {
    console.error(e);
  }
});

export default productRouter;
