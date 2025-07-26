const socket = io();
const form = document.getElementById("productForm");
const cartControls = document.getElementById("cartControls");
let cartId = localStorage.getItem("cartId");

document.getElementById("createCartBtn").addEventListener("click", () => {
  socket.emit("newCart");
});

const botonesCart = () => {
  if (cartId) {
    cartControls.innerHTML = `
      <button id="deleteCartBtn">Eliminar carrito</button>
      <a href="/carts/${cartId}" style="text-decoration: none; margin-left: 10px;">
        <button id="viewCartBtn">Ver carrito</button>
      </a>
    `;
    document.getElementById("deleteCartBtn").addEventListener("click", () => {
      socket.emit("delCart", cartId);
    });
  } else {
    cartControls.innerHTML = `<button id="createCartBtn">Crear carrito</button>`;
    document.getElementById("createCartBtn").addEventListener("click", () => {
      socket.emit("newCart");
    });
  }
};

botonesCart(); // Llamar al iniciar

socket.on("cartCreated", (id) => {
  cartId = id;
  localStorage.setItem("cartId", cartId); // Guardar en localStorage
  botonesCart();
});

socket.on("cartDeleted", () => {
  cartId = null;
  localStorage.removeItem("cartId");
  botonesCart();
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const productId = button.dataset.id;

    if (!cartId) {
      alert("Primero debes crear un carrito");
      return;
    }
    socket.emit("addToCart", productId.toString(), cartId);
  });
});