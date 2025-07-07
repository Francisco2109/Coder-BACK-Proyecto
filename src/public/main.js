const socket = io();

  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");

  socket.on("products", (products) => {
      productList.innerHTML = "";
      products.forEach((prod) => {
        const li = document.createElement("li");
        li.dataset.id = prod.id;
        li.innerHTML = `
        ${prod.title} - $${prod.price} <button onclick="deleteProduct('${prod.id}')">Eliminar</button>
        `;
        productList.appendChild(li);
      });
    });

  form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const product = {
        id: -1,
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        thumbnails: "" 
      };
      socket.emit("addProduct", product);
      form.reset();
    });

  function deleteProduct(id) {
      socket.emit("deleteProduct", id);
  }