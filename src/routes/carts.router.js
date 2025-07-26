import { Router } from "express";
import CartsModel from "../models/carts.model.js";

const cartsRouter = Router();  

let products = [];
let productId = 1;
let carts = [];
let cartId = 1;

cartsRouter.get('/:cid',async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartsModel.findById({ _id: cid }).populate("products.product");
        if (!cart){
            return res.status(404).json({ status: "error", message: "Cart not found" });
        }
        res.json({ status: "success", cart });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

cartsRouter.post('/',async (req, res) => {
    try {
        const newCart = CartsModel(req.body);
        await newCart.save();
        res.json({ status: "cart created", newCart: newCart });
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

// Aumentar cantidad en carro ya existente
cartsRouter.post('/:cid/product/:pid',async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await CartsModel.findById(cid).populate("products.product");

        const cartProduct = cart.products.find(p => p.product._id.toString() === pid);
        cartProduct.quantity ++;

        await cart.save();
        res.json({status:"success", cart})
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
});

cartsRouter.put('/:cid',async (req,res) =>{
    // Reemplazar Todos los productos del carro con un array
    try {
        const { cid } = req.params;
        const body = req.body;
        const cart = await CartsModel.findById(cid).populate("products.product");
        cart.products = body.products;

        await cart.save();
        res.json({status:"success", cart})
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
})>

cartsRouter.put('/:cid/product/:pid',async (req,res) =>{
    // Reemplazar cantidad del producto especifico esta cantidad esta en el body
    try {
        const {cid,pid} = req.params;
        const body = req.body;

        const cart = await CartsModel.findById(cid).populate("products.product");
        const cartProduct = cart.products.find(p => p.product._id.toString() === pid);
        cartProduct.quantity = body.quantity;

        await cart.save();
        res.json({status:"success", cart})
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
})

cartsRouter.delete('/:cid',async (req,res) =>{
    // Eliminar Todos los productos del carro sin eliminar el mismo
    try {
        const { cid } = req.params;

        const cart = await CartsModel.findById(cid);
        cart.products = [];

        await cart.save();
        res.json({status:"success", cart})
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
})


cartsRouter.delete('/:cid/product/:pid',async (req,res) =>{
    // Eliminar un producto del carrito sin importar la cantidad
    try {
        const {cid, pid} = req.params
        const cart = await CartsModel.findById(cid);
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        
        cart.save();
        res.json({status:"success", cart})
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
})

export default cartsRouter;