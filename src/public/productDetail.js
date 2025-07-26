const socket = io();
let cartId = localStorage.getItem("cartId");

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