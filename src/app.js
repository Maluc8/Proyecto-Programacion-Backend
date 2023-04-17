import express from "express";
import cartsRouter from "./routes/cartsRoutes.js";
import productsRouter from "./routes/productsRoutes.js";
import path from "path";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const app = express();
const viewsPath = path.resolve("./views");
const publicPath = path.resolve("./public");

app.use(express.static(publicPath));

const httpServer = app.listen(8080, () => {
  console.log("Server is listening on port 8080...");
});
const socketServer = new Server(httpServer);

socketServer.on(`connection`, (socket) => {
  console.log(`Nuevo cliente conectado.`);
});

app.engine(
  `handlebars`,
  engine({
    layoutsDir: `${viewsPath}/layouts`,
    defaultLayout: `home`,
  })
);
app.set("view engine", "handlebars");
app.set("views", `${viewsPath}/layouts`);

app.get("/api/products", productsRouter);
app.get("/api/products/:id", productsRouter);
app.post("/api/products", productsRouter);
app.put("/api/products", productsRouter);
app.delete("/api/products", productsRouter);
app.get("/api/realtimeproducts", productsRouter);

app.get(`/api/carts`, cartsRouter);
app.get("/api/carts/:id", cartsRouter);
app.post("/api/carts", cartsRouter);
app.put("/api/carts", cartsRouter);
app.delete("/api/carts", cartsRouter);

// app.listen(8080, () => {
//   console.log("Server is listening on port 8080...");
// });
