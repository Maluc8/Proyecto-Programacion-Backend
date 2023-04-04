import { Router } from "express";
import express from "express";
import cartManager from "../cartManager.js";

const cartsRouter = Router();
const cartsManager = new cartManager();

cartsRouter.use(express.json());

cartsRouter.get("/api/carts", async (req, res) => {
  try {
    await cartsManager.loadCarts();
  } catch (e) {
    res.send(e);
  } finally {
    res.send(cartsManager.getCarts());
  }
});

cartsRouter.get("/api/carts/:id", async (req, res) => {
  try {
    await cartsManager.loadCarts();
  } catch (e) {
    res.send(e);
  } finally {
    res.send(cartsManager.getCartsById(req.params.id));
  }
});

cartsRouter.post("/api/carts", async (req, res) => {
  let sucess;
  try {
    await cartsManager.loadCarts();
    sucess = cartsManager.addCart();
  } catch (e) {
    res.send(e);
  } finally {
    sucess
      ? res.status(200).send({ message: "Created successfully" })
      : res.status(409).send({ message: "Error" });
  }
});

cartsRouter.put("/api/carts", async (req, res) => {
  const idCart = req.body.idCart;
  const products = req.body.products;
  try {
    await cartsManager.loadCarts();
    const promises = await products.map((prod) => {
      return cartsManager.updateCart(idCart, prod.idProd, prod.quantity);
    });
    const results = await Promise.all(promises);
    if (results.every((prom) => prom)) {
      res.status(200).send({ message: `Modified successfully` });
    } else {
      res.status(409).send({ message: `Error` });
    }
  } catch (e) {
    console.error(e);
    res.status(409).send({ message: "Error loading carts." });
  }
});

cartsRouter.delete("/api/carts", async (req, res) => {
  let sucess;
  try {
    await cartsManager.loadCarts();
    sucess = await cartsManager.deleteCart(req.body.id);
  } catch (e) {
    console.error(e);
  } finally {
    sucess
      ? res.status(200).send({ message: "Deleted successfully" })
      : res.status(409).send({ message: "Error" });
  }
});

export default cartsRouter;
