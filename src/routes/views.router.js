import { Router } from "express";
import ProductsModel from "../models/products.model.js";

const viewRouter = Router();

viewRouter.get("/products", async (req, res) => {
  const { page=1, limit=10 } = req.query;

  try {
    const result = await ProductsModel.paginate({}, { page, limit });
    const malditosObjetos = result.payload.map(p => p.toObject()); 
    res.render("home", {
      products: malditosObjetos,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

viewRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductsModel.findById(req.params.pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    console.log(product)
    res.render("productDetail", { product: product.toObject() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando detalle del producto");
  }
});


viewRouter.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default viewRouter;
