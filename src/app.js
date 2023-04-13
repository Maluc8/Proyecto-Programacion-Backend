import express from "express";
import cartsRouter from "./routes/cartsRoutes.js";
import productsRouter from "./routes/productsRoutes.js";
import path from "path";
import { engine } from "express-handlebars";

const app = express();
const viewsPath = path.resolve("./views");
console.log(viewsPath);

app.engine(
  `handlebars`,
  engine({
    layoutsDir: `./views/layouts`,
    defaultLayout: `home.handlebars`,
  })
);
app.set("view engine", "handlebars");
app.set("views", `./views/layouts`);

app.get("/api/products", productsRouter);
app.get("/api/products/:id", productsRouter);
app.post("/api/products", productsRouter);
app.put("/api/products", productsRouter);
app.delete("/api/products", productsRouter);

app.get(`/api/carts`, cartsRouter);
app.get("/api/carts/:id", cartsRouter);
app.post("/api/carts", cartsRouter);
app.put("/api/carts", cartsRouter);
app.delete("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Server is listening on port 8080...");
});
