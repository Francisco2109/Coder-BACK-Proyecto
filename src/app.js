import express from "express";
import allRoutes from "./routes/index.js";
import viewRouter from "./routes/views.router.js";
import hbs from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import fs from "fs/promises";
import mongoose from "mongoose";
import ProductsModel from "./models/products.model.js";
 
const app = express();
const serverHttp = http.createServer(app)
const io = new Server(serverHttp)


io.on("connection",async (socket) => {
  let productList = await ProductsModel.find();
  console.log("Nuevo cliente conectado: " + socket.id);

  socket.emit("products", productList);

  socket.on("addProduct", async (prod) => {
    const newProduct = ProductsModel(prod);
    await newProduct.save();
    io.emit("products", productList);
  });

  socket.on("deleteProduct", async (id) => {
    // productList = productList.filter((p) => parseInt(p.id) !== parseInt(id));
    // await saveProducts();
    // io.emit("products", productList);

    try {
        const productList = await ProductsModel.findByIdAndDelete(id);
        io.emit("products", productList)
    } catch (e) {
        console.error({ message: e.message });
        res.status(500).json({ status: "Internal server error", message: "View console" });
    }
  });
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