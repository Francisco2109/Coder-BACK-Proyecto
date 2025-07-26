import { Router } from "express";
import ProductsModel from "../models/products.model.js";
import CartsModel from "../models/carts.model.js";

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
    res.render("productDetail", { product: product.toObject() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando detalle del producto");
  }
});


viewRouter.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

viewRouter.get("/carts/:cid",async (req,res)=>{
  try {
    const cid = req.params.cid;
    const cart = await CartsModel.findById(cid).populate("products.product");

    if (!cart) return res.status(404).send("Carrito no encontrado");
    const malditosObjetos = cart.products.map(p => p.toObject());

    res.render("carts", {
      products: malditosObjetos.map((p) => ({
        title: p.product.title,
        price: p.product.price,
        category: p.product.category,
        quantity: p.quantity,
        id: p.product._id,
      })),
    });
  } catch (e) {
    console.error(error);
    res.status(500).send("Error cargando detalle del producto");
  }
});

export default viewRouter;
