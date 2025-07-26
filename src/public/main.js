const socket = io();
const form = document.getElementById("productForm");
const cartControls = document.getElementById("cartControls");
let cartId = null;

document.getElementById("createCartBtn").addEventListener("click", () => {
  socket.emit("newCart");
});

socket.on("cartCreated", (id) => {
  cartId = id;
  cartControls.innerHTML = `<button id="deleteCartBtn">Eliminar carrito</button>`;
  document.getElementById("deleteCartBtn").addEventListener("click", () => {
    socket.emit("delCart", cartId);
  });
});

socket.on("cartDeleted", () => {
  cartId = null;
  cartControls.innerHTML = `<button id="createCartBtn">Crear carrito</button>`;
  document.getElementById("createCartBtn").addEventListener("click", () => {
    socket.emit("newCart");
  });
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const productId = button.dataset.id;

    if (!cartId) {
      alert("Primero debes crear un carrito");
      return;
    }
    console.log(productId)
    socket.emit("addToCart", productId.toString(), cartId);
  });
});