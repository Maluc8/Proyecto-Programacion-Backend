import express, { urlencoded } from "express";
import { productManager } from "./productsManager.js";

const app = express();
const manager = new productManager();
app.use(express.urlencoded({ extended: true }));

app.get(`/products`, async (req, res) => {
  try {
    await manager.loadProducts();
  } catch (e) {
    console.error(e);
  } finally {
    if (req.query.hasOwnProperty(`limit`)) {
      const limite = +req.query.limit;
      res.send(manager.getProducts().slice(0, limite));
    } else {
      res.send(manager.getProducts());
    }
  }
});

app.get(`/products/:id`, async (req, res) => {
  try {
    await manager.loadProducts();
  } catch (e) {
    console.error(e);
  } finally {
    res.send(manager.getProductsById(req.params.id));
  }
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080...");
});
