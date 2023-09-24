import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { __dirname } from "./utils/utils.js";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { viewsRouter } from "./routes/views.router.js";
import ProductManager from "./dao/ProductManager.js";
import { ValidateProduct } from "./middlewares/product.middleware.js";

const app = express();
const port = 8080;
const productManager = new ProductManager("products.json");
const validateProduct = new ValidateProduct();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// Configuración de handlebars
app.engine("hbs", handlebars.engine({ extname: '.hbs'}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, '/views'));

//servidor express con protocolo http
const httpServer =  app.listen(port, () => {console.log(`Server running on port ${port}`);});

//servidor socket.io
const io = new Server(httpServer);
io.on("connection", async(socket) => {
    console.log(`New client connected ${socket.id}`);

    const products = await productManager.getProducts();
    socket.emit("productsArray", products);

    socket.on("addProduct", async (product) => {
        //IMPORTANTE, al llamar directamente a productManager, no se ejecuta el método asignId, por lo que el id del producto es undefined. Ademas, no valida los datos del producto, ya que no pasa por los middlewares.
        //la solucion es llamar al método addProduct, que si ejecuta el método asignId y valida los datos del producto.
        //la solucion para las validaciones del middleware, es llamar a los middlewares directamente (No funciono!)

        const result = await productManager.addProduct(product);
        const products = await productManager.getProducts();
        io.emit("productsArray", products);
    });

    socket.on("deleteProduct", async (productId) => {
        const result = await productManager.deleteProductById(productId);
        const products = await productManager.getProducts();
        io.emit("productsArray", products);
    });

});

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use(viewsRouter);