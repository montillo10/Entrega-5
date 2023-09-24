import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";
//*validations middleware

class CartsMiddleware {
  constructor() {
    this.cartManager = new CartManager("carts.json");
    this.productManager = new ProductManager("products.json");
  }

  checkCartExist = async(req, res, next) =>{
    const id = parseInt(req.params.cid);
    const cart = await this.cartManager.getCartById(id);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    next();
  }
}
export { CartsMiddleware as ValidateCart};

