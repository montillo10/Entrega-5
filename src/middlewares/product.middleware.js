import ProductManager from "../dao/ProductManager.js";

//*validations middleware

class ProductMiddleware {
  constructor() {
    this.productManager = new ProductManager("products.json");
  }

  /**
  ** Validations checkParametres: (in order)
  * Empty params (title, description, thumbnail, code, price, stock)
  * Invalid Parametres String (title, description, thumbnail, code, category)
  * Invalid Parametres Number (price, stock)
  * invalid Parametres (price must be greater than 0. Stock must be greater or equal than 0)
  ** Importante: thumbnail ES opcional. id autoincremental (no se puede modificar), status es por defecto true.
  */

  checkParametres = (req, res, next) => {
    try {
      const product = req.body;
      
      console.log("product in checkParametres: ", product);

      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.stock ||
        !product.category
      )
       {
        return res
          .status(400)
          .json({ error: "Invalid parameters: all fields must be filled" });
      }
      if (
        typeof product.title !== "string" ||
        typeof product.description !== "string" ||
        typeof product.code !== "string" ||
        typeof product.category !== "string"
      ) {
       
        return res
          .status(400)
          .json({
            error:
              "Invalid parameters title, description, code, category must de characters",
          });
      }
      if (
        typeof product.price !== "number" ||
        typeof product.stock !== "number"
      ) {
        
        return res
          .status(400)
          .json({ error: "Invalid parameters: price, stock must be numbers" });
      }
      if (product.price <= 0 || product.stock < 0) {
       
        return res
          .status(400)
          .json({
            error:
              "Invalid parameters: price must be greater than 0, stock must be greater or equal than 0",
          });
      }
      if (product.status && typeof product.status !== "boolean") {
       
        return res
          .status(400)
          .json({ error: "Invalid parameters: status must be boolean" });
      }
      if (product.thumbnail && typeof product.thumbnail !== "string") {
       
        return res
          .status(400)
          .json({ error: "Invalid parameters: thumbnail must be string" });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
    
  /**
  ** Validations checkCodeToAdd: (in order)
  * Code already exists
  */
  checkCodeToAdd = async (req, res, next) => {

    try {

      const code = req.body.code;
      const products = await this.productManager.getProducts();
      const productExists = products.some((product) => product.code === code);

      if (productExists) {
        return res
          .status(400)
          .json({ error: "Invalid parameters: code already exists" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
  ** Validations checkCodeToUpdate: (in order)
  * Code already exists
  */
  checkCodeToUpdate = async (req, res, next) => {

    try {
      const idUpdate = parseInt(req.params.pid); //id ya fue validado en el checkId
      const products = await this.productManager.getProducts();
      
      // 1º: Primero verificamos si el producto ya existe dentro del arreglo, si existe, obtenemos el índice del producto
      const indexProductFound = products.findIndex(
        (product) => product.id === idUpdate
      );
      
      if (indexProductFound === -1) {
        return res
          .status(400)
          .json({ error: "Invalid parameters: product not found" });
      }
      // 2º: Si el producto existe, verificamos si el código del producto es igual al código que se quiere actualizar
      // IMPORTANTE: si el código del producto es igual al código que se quiere actualizar, elimino el código del producto.
      const code = req.body.code;

      if (products[indexProductFound].code === code) {
        delete products[indexProductFound].code; //si es igual, borramos el código del producto
      }

      //3º Ahora comparamos que el código que se quiere actualizar no exista en otro producto
      // IMPORTANTE: Para esta entrega, NO se asumira que el código del producto es único al cargar el archivo, por lo que se debe verificar que el código no exista en otro producto.
      const codeExists = products.some((product) => product.code === code);
      if (codeExists) {
        return res
          .status(400)
          .json({ error: "Invalid parameters: code already exists" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  checkProductExist = async (req, res, next) => {
    const id = parseInt(req.params.pid);
    const product = await this.productManager.getProductById(id);
    if (!product) {
      return res
        .status(400)
        .json({ error: "Invalid parameters: product not found" });
    }
    next();
  };
}

export { ProductMiddleware as ValidateProduct };
