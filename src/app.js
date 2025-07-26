import express from "express";
import allRoutes from "./routes/index.js";
import viewRouter from "./routes/views.router.js";
import hbs from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProductsModel from "./models/products.model.js";
import CartsModel from "./models/carts.model.js";
 
const app = express();
const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

let cart = CartsModel();

io.on("connection",async (socket) => {
  try {
    const productList = await ProductsModel.find();
    socket.emit("products", productList);
  } catch (e) {
    console.error({ message: e.message });
  }
  console.log("Nuevo cliente conectado: " + socket.id);

  socket.on("addProduct", async (product) => {
    try {
      const newProduct = new ProductsModel(product);
      await newProduct.save();

      const productList = await ProductsModel.find();
      io.emit("products", productList);
    } catch (e) {
      console.error("Error al agregar producto:", e.message);
    }
  });

  socket.on("deleteProduct", async (pid) => {
    try {
        await ProductsModel.findByIdAndDelete(pid);
        const productList = await ProductsModel.find();
        io.emit("products", productList)
    } catch (e) {
        console.error({ message: e.message });
    }
  });
  socket.on("newCart", async () => {
    try {
      const newCart = CartsModel();
      await newCart.save();
      cart = newCart;
      io.emit("cartCreated", cart._id);
    } catch (e) {
        console.error({ message: e.message });
    }
  });

  socket.on("delCart", async (cid) => {
    try {
        await CartsModel.findByIdAndDelete(cid);
        cart = {}
        io.emit("cartDeleted")
    } catch (e) {
        console.error({ message: e.message });
    }
  });
  
  socket.on("addToCart", async (pid, cid)=>{
    try {
      const cart = await CartsModel.findById(cid);
      if (!cart) return;
      const cartProduct = cart.products.find(p => p.product._id.toString() === pid);
      if (cartProduct){
        cartProduct.quantity ++;
        await cart.save();
        console.log(cart)
        socket.emit("cartUpdated", cart);
      }else{
        cart.products.push({ product: pid, quantity: 1 });
        await cart.save();
        console.log(cart)
        socket.emit("cartUpdated", cart);
      }
    } catch (e) {
      console.error({ message: e.message });
    }
  })
});

// mongoose.connect("mongodb+srv://admin-user:<B4YW5GZcy8iGuzH3>@cluster0.8ysuhwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// .then(() => console.log("MongoDB connected success"))
// .catch((e) => console.error("MongoDB Error: \n" + e))

mongoose.connect("mongodb://127.0.0.1:27017/colegio")
.then(() => console.log("MongoDB connected success"))
.catch((e) => console.error("MongoDB Error: \n" + e))

// CONFIGURACION DE HANDLEBARS
app.engine("handlebars", hbs.engine());  // 1. implementamos el motor
app.set("views", import.meta.dirname + "/views") // 2. definimos carpeta de vistas
app.set("view engine", "handlebars") // 3. definimos handlebars como nuestro motor de plantillas

// MIDDLEWARE
app.use(express.static(import.meta.dirname + "/public"));
app.use(express.json());

// Routes
app.use("/api", allRoutes);
app.use("/", viewRouter);

// Servidor escuchando en puerto 8080

// loadProducts().then(() => {
// serverHttp.listen(8080, () => {
//     console.log(`Servidor escuchando en localhost:8080}`);
// });
// });

serverHttp.listen(8080, () => {
    console.log(`Servidor escuchando en localhost:8080}`);
});

export default io;