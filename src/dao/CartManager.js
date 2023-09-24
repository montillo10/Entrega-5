import path from "path";
import fs from "fs";
import { __dirname } from "../utils/utils.js";

//* IMPORTANTE: LAS VALIDACIONES DEBEN SER HECHAS EN EL ROUTER, NO EN EL DAO

class CartManager {
  constructor(FileName) {
    this.path = path.join(__dirname, `/files/${FileName}`);
    }

  getPath() {
    return this.path;
  }

  asignId(carts) {
    let id = 1;
    if (carts.length > 0) {
      id = carts[carts.length - 1].id + 1;
    }
    return id;
  }

  async saveCarts(carts) {
    try{
        await fs.promises.writeFile(this.path,JSON.stringify(carts, null, "\t"));
    }catch(error){
      throw error;
    }

  }

  async fileExists() {
    try{
      await fs.promises.access(this.path, fs.constants.F_OK); 
      return true;  //si el archivo existe, retorno true
    }catch(error){
      if(error.code === "ENOENT"){
        return false; //si el archivo no existe, retorno false
      }
      throw error;
    }
  }

  /**
  ** Validations:
  * File not found
  * File empty
  */

  async getCarts() {

     try{
        if(this.fileExists()){ 
            const dataCarts = await fs.promises.readFile(this.path, "utf-8");
            if (dataCarts.length === 0) {
              return [];
            }
            const carts = JSON.parse(dataCarts);
            return carts;
        }else{
            throw new Error("File not found");
        }
     }catch(error){
       throw error;
     }
  }

  /**
  ** Validations:
  * File not found
  * Invalid Parametres (number: idProduct)
  * Product not found
  */

  async getCartById(id) {

     try{
        if(this.fileExists()){
          console.log("id in CartManager: ", id);
            const carts = await this.getCarts();
            const indexCart = carts.findIndex((cart) => {return cart.id === id});
            console.log("indexCart in CartManager: ", indexCart);
            return carts[indexCart];
        }else{
            throw new Error("File not found");
        }
     }catch(error){
       throw error;
     }
  }
  
  /**
  ** Validations:
  * File not found
  * Invalid Parametres (string: title, description, thumbnail, code)
  * Invalid Parametres (number: price, stock)
  * invalid Parametres (price and stock must be greater than 0)
  * Code already exists
  */

  async addCart() {


     try{
        if(this.fileExists()){
            const carts = await this.getCarts();
            const newId = this.asignId(carts);
            const newCart = {
                id: newId,
                products: []
            };
            carts.push(newCart);
            await this.saveCarts(carts);
            console.log("Cart added successfully\n", newCart);
            return newCart;
        }
        else{
            throw new Error("File not found");
        }
            
     }catch(error){
       throw error;
     }
  }

  async addProductInCart(idCart, idProduct) {
    try{
      if(this.fileExists()){
        const carts = await this.getCarts();
        const indexCart = carts.findIndex((cart) => {return cart.id === idCart}); //busco el indice del carrito, si existe, retorno el indice
        const indexProductInCart = carts[indexCart].products.findIndex((product) => {return product.id === idProduct}); //busco si el producto ya existe en el carrito, si existe, retorno el indice
        if (indexProductInCart === -1) { //si no existe, y el carrito está vacío, agrego el producto
          carts[indexCart].products.push({
            id: idProduct,
            quantity: 1
          });
        }
        else{ //si existe, aumento la cantidad del producto
          carts[indexCart].products[indexProductInCart].quantity++;
        }

        await this.saveCarts(carts);

        console.log("Product added successfully\n", carts[indexCart]);
        return "Product added successfully"+ carts[indexCart];
      }else{
        throw new error("File not found");
      }
    }catch(error){
      throw error;
    }
  }
  
  /**
  ** Validations:
  * File not found
  * Invalid Parametres (number: idDelete)
  * Product not found
  */

  async deleteCartById(id) {

     try{
        if(this.fileExists()){
            const carts = await this.getCarts();
            const indexCart = carts.findIndex((cart) => {return cart.id === id});
            carts.splice(indexCart, 1);
            await this.saveCarts(carts);
            console.log("Cart deleted successfully");
            return "Cart deleted successfully";
        }
        else{
            throw new Error("File not found");
        }
     }catch(error){
       throw error;
     }
  }
}

export default CartManager;

