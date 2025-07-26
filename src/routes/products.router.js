import e, { Router } from "express";
import io from "../app.js";
import ProductsModel from "../models/products.model.js";
import { PaginationParameters } from "mongoose-paginate-v2"

const productRouter = Router();

// async function updateProducts(){
//     try {
//         const allProducts = await ProductsModel.paginate();
//         io.emit("products", allProducts);
//         return allProducts
//     } catch (e) {
//         console.error({ message: e.message });
//         return;
//     }
// }

productRouter.get('/',async (req, res) => {
    try {
        const parsedQuery = new PaginationParameters(req)
        const queries = parsedQuery.get()
        const result = await ProductsModel.paginate(...queries);

        const baseUrl = req.protocol + "://" + req.get("host") + req.path;
        const generateLink = (targetPage) => {
        const options = new URLSearchParams();
            options.append("page", targetPage);
            options.append("limit", queries[1].limit);
            if (queries[1].sort) {
                options.append("sort", queries[1].sort);
            }
            if (queries[0].query) {
                options.append("query", queries[0].query);
            }
            return `${baseUrl}api/products?${options.toString()}`;
        };
        result.prevLink = result.hasPrevPage ? generateLink(result.page - 1) : null;
        result.nextLink = result.hasNextPage ? generateLink(result.page + 1) : null;
        res.json({status: "success",result});
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

productRouter.get('/:pid',async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductsModel.findById({ _id: pid });
        if (!product){
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
        res.json({ status: "success", product });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

productRouter.post('/',async (req, res) => {
    try {
        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        const newProduct = ProductsModel(req.body);
        await newProduct.save();
        const allProducts = await ProductsModel.find();
        io.emit("products", allProducts);
        res.json({ status: "product created", new_product: newProduct });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

productRouter.put('/:pid',async (req, res) => {
    try {
        const { pid } = req.params;
        const { body } = req;
        if (body.price){
            body.price = parseFloat(body.price)
        }
        if (body.stock){
            body.stock = parseInt(body.stock)
        }
        let response = await ProductsModel.updateOne({ _id: pid } , { $set: { ...body } },);
        const allProducts = await ProductsModel.find();
        io.emit("products", allProducts);
        res.json({ status: "product updated", response });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

productRouter.delete('/:pid',async (req, res) => {
    try {
        const { pid } = req.params;
        const response = await ProductsModel.findByIdAndDelete(pid);
        const allProducts = await ProductsModel.find();
        io.emit("products", allProducts);
        res.json({ status: "product deleted", response });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

export default productRouter;