import express from "express";

const server = express();
const PORT = 8080;

server.use(express.json());

const products = [];
const carts = [];
let productId = 1;
let cartId = 1;

// Rutas para Manejo de Productos
server.get('/api/products/', (req, res) => {
    res.json(products);
});

server.get('/api/products/:pid', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

server.post('/api/products/', (req, res) => {
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
    products.push(newProduct);
    res.status(201).json(newProduct);
});

server.put('/api/products/:pid', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        const { title, description, code, price, stock, thumbnails } = req.body;
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (code !== undefined) product.code = code;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (thumbnails !== undefined) product.thumbnails = thumbnails;
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

server.delete('/api/products/:pid', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (index !== -1) {
        products.splice(index, 1);
        res.status(204).send("Producto Borrado Correctamente");
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Rutas para Manejo de Carritos
server.post('/api/carts/', (req, res) => {
    const newCart = {
        id: cartId++,
        products: []
    };
    carts.push(newCart);
    res.status(201).send("Nuevo Carrito Creado");
});

server.get('/api/carts/:cid', (req, res) => {
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

server.post('/api/carts/:cid/product/:pid', (req, res) => {
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
    res.status(200).json(cart);
});

// Servidor escuchando en puerto 8080
server.listen(PORT, () => {
    console.log(`Servidor escuchando en localhost:${PORT}`);
});