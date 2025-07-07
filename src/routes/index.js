import { Router } from "express";
import productRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";

const router = Router();

router.use("/products", productRouter);
router.use("/carts", cartsRouter);

export default router;