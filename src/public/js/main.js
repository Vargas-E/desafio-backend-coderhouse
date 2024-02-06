const socket = io();

socket.emit("hola", "holaaa server");

socket.on("products", (data) => {
  if (data === false) {
    Swal.fire({
      title: "El código de producto ya esta en uso",
      confirmButtonColor: '#1A3A3A',
    });
  } else {
    console.log("socketProductos");
    renderProducts(data);
  }
});

// render products array
const renderProducts = (productos) => {
  const productsContainer = document.getElementById("productsContainer");
  if (!!productsContainer) {
    productsContainer.innerHTML = "";
    productos.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `<div><b>Id</b>: ${product.id}</div><div><b>Producto:</b> ${product.title}</div><div><b>Descripción:</b> ${product.description}</div><div><b>Precio:</b> $${product.price}</div><div><b>Stock:</b> $${product.stock}</div> <button class="button fixMargin"> E L I M I N A R </button>`;
      productsContainer.appendChild(card);
      card.querySelector("button").addEventListener("click", () => {
        deleteProduct(product.id);
      });
    });
  }
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

// add
if (!!document.getElementById("btnSend")) {
  document.getElementById("btnSend").addEventListener("click", (e) => {
    e.preventDefault();
    addProduct();
  });
}

const addProduct = () => {
  const newProduct = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: parseInt(document.getElementById("price").value),
    img: document.getElementById("img").value.trim(),
    code: document.getElementById("code").value.trim(),
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value.trim(),
    status: document.getElementById("status").value === "true" ? true : false,
    thumbnails: [],
  };

  console.log(typeof newProduct["status"]);
  if (
    Object.keys(newProduct).some((e) =>
      typeof newProduct[e] == "boolean" ? false : !!!newProduct[e]
    )
  ) {
    Swal.fire({
      title: "Error en el form!",
      text: "Alguno de los campos esta vacio, o el precio se asigno como 0. Revisa los campos por favor.",
      confirmButtonColor: '#1A3A3A',


    });
    console.log("error en input");
  } else {
    console.log("newProduct", newProduct);
    socket.emit("addProduct", newProduct);
    Swal.fire({
      title: "Producto agregado!",
      confirmButtonColor: '#1A3A3A',
    });
  }
};
