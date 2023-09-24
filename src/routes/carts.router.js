import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";
import { checkId, checkLimit } from "../utils/validations.js";
import { Router } from "express";
import { ValidateCart } from "../middlewares/cart.middleware.js";
import { ValidateProduct } from "../middlewares/product.middleware.js";

const router = Router();
const productManager = new ProductManager("products.json");
const cartManager = new CartManager("carts.json");
const validateCart = new ValidateCart();
const validateProduct = new ValidateProduct();

//*validations middleware
checkId("pib"), checkId("cib");

//addCartValidator = No es necesario, ya que no se le pasan parámetros
//
const addProductInCartValidator = [
  checkId("cid"),
  checkId("pid"),
  validateCart.checkCartExist,
  validateProduct.checkProductExist,
];

const deleteCartValidator = [checkId("cid"), validateCart.checkCartExist];

//*----------------------routes---------------------------

router.get("/", checkLimit, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    if (limit) {
      const carts = await cartManager.getCarts();
      const cartsLimit = carts.slice(0, limit);
      res.status(200).json({ carts: cartsLimit, cantidad: cartsLimit.length });
    } else {
      const carts = await cartManager.getCarts();
      res.status(200).json({ carts: carts, cantidad: carts.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); //en los get, el error es un mensaje, no un objeto
  }
});

router.get("/:cid", checkId("id"), async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await cartManager.addCart();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:cid/products/:pid",
  addProductInCartValidator,
  async (req, res) => {
    try {
      const idCart = parseInt(req.params.cid);
      const idProduct = parseInt(req.params.pid);
      const result = await cartManager.addProductInCart(idCart, idProduct);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:cid",deleteCartValidator, async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const result = await cartManager.deleteCartById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as cartsRouter };
