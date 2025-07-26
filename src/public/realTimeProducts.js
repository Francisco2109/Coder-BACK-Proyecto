const socket = io();
const form = document.getElementById("productForm");

socket.on("products", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((prod) => {
    const li = document.createElement("li");
    li.dataset.id = prod._id;
    li.innerHTML = `
      Code: ${prod.code} - ${prod.title} - $${prod.category} - $${prod.price} - Stock:${prod.stock}
      <button onclick="deleteProduct('${prod._id}')">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock")),
  };

  socket.emit("addProduct", product);
  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
