import express from "express";
import allRoutes from "./routes/index.js";
import viewRouter from "./routes/views.router.js";
import hbs from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import fs from "fs/promises";
 
const app = express();
const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

let productList = [];

const loadProducts = async () => {
  try {
    const data = await fs.readFile("data/products.json", "utf-8");
    productList = JSON.parse(data);
    console.log("Productos cargados:", productList.length);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("Archivo products.json no encontrado. Se creará uno nuevo al guardar.");
    } else {
      console.error("Error leyendo products.json:", err);
    }
    productList = [];
  }
};

const saveProducts = async () => {
  try {
    await fs.writeFile("data/products.json",JSON.stringify( productList, null, 2));
    console.log("Productos guardados en archivo.");
  } catch (err) {
    console.error("Error escribiendo archivo:", err);
  }
};


io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado: " + socket.id);

  socket.emit("products", productList);

  socket.on("addProduct", async (prod) => {
    prod.id = productList.length+1;
    productList.push(prod);
    await saveProducts();
    io.emit("products", productList);
  });

  socket.on("deleteProduct", async (id) => {
    productList = productList.filter((p) => parseInt(p.id) !== parseInt(id));
    await saveProducts();
    io.emit("products", productList);
  });
});


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

loadProducts().then(() => {
serverHttp.listen(8080, () => {
    console.log(`Servidor escuchando en localhost:8080}`);
});
});


export default io;