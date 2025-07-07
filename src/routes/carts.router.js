import fs from "fs";
import { Router } from "express";

const cartsRouter = Router();  

let products = [];
let productId = 1;
let carts = [];
let cartId = 1;

const CARTS_FILE = "./data/carts.json";
const PRODUCTS_FILE = './data/products.json';

const loadData = () => {
    if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data", { recursive: true });
    }
    if (!fs.existsSync(CARTS_FILE)) {
    fs.writeFileSync(CARTS_FILE, '[]');
    }
    if (fs.existsSync(CARTS_FILE)) {
        carts = JSON.parse(fs.readFileSync(CARTS_FILE));
        cartId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    }
    if (!fs.existsSync("./data")) {
            fs.mkdirSync("./data", { recursive: true });
            }
    if (!fs.existsSync(PRODUCTS_FILE)) {
            fs.writeFileSync(PRODUCTS_FILE, '[]');
            }
    if (fs.existsSync(PRODUCTS_FILE)) {
            products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
            productId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        }
};
loadData();

const saveCarts = () => fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));

cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: cartId++,
        products: []
    };
    carts.push(newCart);
    saveCarts();
    res.status(201).send("Nuevo Carrito Creado");
});

cartsRouter.get('/:cid', (req, res) => {
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        // Mostramos el Producto a partir de su ID guardada
        const detalleProduct = cart.products.map(cp => {
            const product = products.find(p => p.id === cp.product);
            if (product) {
                return {
                    product: product,
                    quantity: cp.quantity
                };
            }}
        )
        res.json(detalleProduct);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    // Buscar si el producto ya está en el carrito
    const cartProduct = cart.products.find(p => p.product === product.id);
    if (cartProduct) {
        cartProduct.quantity += 1;
    } else {
        cart.products.push({ product: product.id, quantity: 1 });
    }
    saveCarts();
    res.status(200).json(cart);
});

export default cartsRouter;