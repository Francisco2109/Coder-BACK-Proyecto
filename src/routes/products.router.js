import fs from "fs";
import { Router } from "express";
import io from "../app.js";

const productRouter = Router();  

let productList = [];
let productId = 1;

const PRODUCTS_FILE = './data/products.json';

const loadData = () => {
    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data", { recursive: true });
        }
        if (!fs.existsSync(PRODUCTS_FILE)) {
        fs.writeFileSync(PRODUCTS_FILE, '[]');
        }
    if (fs.existsSync(PRODUCTS_FILE)) {
        productList = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
        productId = productList.length > 0 ? Math.max(...productList.map(p => p.id)) + 1 : 1;
    }
};
loadData();

const saveProducts = () => fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productList, null, 2));

productRouter.get('/', (req, res) => {
    res.json(productList);
});

productRouter.get('/:pid', (req, res) => {
    const product = productList.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productRouter.post('/', (req, res) => {
    const { title, description, code, price,  stock,  thumbnails } = req.body;
    const newProduct = {
        id: productId++,
        title,
        description,
        code,
        price,
        stock,
        thumbnails
    };
    productList.push(newProduct);
    saveProducts();
    io.emit("products", productList);

    res.status(201).json(newProduct);
});

productRouter.put('/:pid', (req, res) => {
    const product = productList.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        const { title, description, code, price, stock, thumbnails } = req.body;
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (code !== undefined) product.code = code;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (thumbnails !== undefined) product.thumbnails = thumbnails;
        res.json(product);
        saveProducts();
        io.emit("products", productList);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productRouter.delete('/:pid', (req, res) => {
    const index = productList.findIndex(p => p.id === parseInt(req.params.pid));
    if (index !== -1) {
        productList.splice(index, 1);
        saveProducts();
        io.emit("products", productList);
        res.status(204).send("Producto Borrado Correctamente");
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

export default productRouter;