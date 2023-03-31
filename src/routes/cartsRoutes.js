import { Router } from "express";

const cartsRouter = Router();

cartsRouter.get("/api/carts", (req, res) => {
  res.send("Dentro del get carts");
});

//cartsRouter.post();

//cartsRouter.delete();

export default cartsRouter;
