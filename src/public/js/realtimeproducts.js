console.log("Estoy en realtimeproducts.js");

const socketClient = io();
//elementos del DOM
const productsList = document.getElementById("productsList");
const createProductForm = document.getElementById("createProductForm");

//enviamos la información del formulario al servidor
createProductForm.addEventListener("submit", (event) => {
    event.preventDefault(); //evito que se recargue la página
    const formData = new FormData(createProductForm); //obtengo los datos del formulario en un objeto
    const jsonData = {}; //creo un objeto vacío para guardar los datos del formulario


    //Forma 1 de obtener los datos del formulario (usando el método get)
    console.log(formData.get("title"));
    console.log(formData.get("description"));
    console.log(formData.get("thumbnail"));
    console.log(formData.get("code"));
    console.log(formData.get("price"));
    console.log(formData.get("stock"));
    console.log(formData.get("category"));
    console.log(formData.get("status"));
    console.log(formData.get("id"));
    console.log("\n\n\n");

    //Forma 2 de obtener los datos del formulario (iterando sobre el objeto formData)
    for(const [key, value] of formData.entries()){
        jsonData[key] = value;
    };
    jsonData.price = parseInt(jsonData.price); //convierto el precio a number, ya que siempre se envía como string
    jsonData.stock = parseInt(jsonData.stock); //convierto el stock a number, ya que siempre se envía como string
    console.log(jsonData);

    //envío los datos al socket del servidor
    socketClient.emit("addProduct", jsonData);
    createProductForm.reset(); //reseteo el formulario

});

socketClient.on("productsArray", (dataProducts) => {
    console.log("dataProducts: ", dataProducts);

    let productsElements = "";
    dataProducts.forEach((product) => {
        productsElements +=
       `<li>
            <p>Id: ${product.id}</p>
            <p>Nombre: ${product.title}</p>
            <p>Descripción: ${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: ${product.price}</p>
            <p>Categoria: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
            <p>estado: ${product.status}</p>
            <p>Ruta de imagen: ${product.thumbnail}</p><button onclick="deleteProduct(${product.id})">Eliminar</button>
        </li>` 
    });
    console.log("productsElements: ", productsElements);
    productsList.innerHTML = productsElements;
});

const deleteProduct = (productId) => {
    console.log("id: ", productId);
    socketClient.emit("deleteProduct", productId);
}