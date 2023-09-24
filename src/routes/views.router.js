import  express  from "express";
import ProductManager from "../dao/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager("products.json");

router.get("/", async(req, res) => {
    const products = await productManager.getProducts();

    res.render("home", {
        title: "Home",
        style: "home.css",
        message: "Bienvenidos a la tienda de productos",
        product: products,
    });
});

router.get("/realtimeproducts", async(req, res) => {
    const products = await productManager.getProducts();

    res.render("realtimeproducts", {
        title: "Real Time Products",
        style: "realtimeproducts.css",
        message: "Bienvenidos a la tienda de productos en tiempo real",
        product: products,
    });

    res.render("realtimeproducts");
});

export { router as viewsRouter}