import fs, { cp } from "fs";
import path from "path";
import { __dirname } from "../utils/utils.js";

class ProductManager {
  constructor(FileName) {
    this.path = path.join(__dirname,`/files/${FileName}` );
  }
  getPath() {
    return this.path;
  }

  asignId(products) {
    let id = 1;
    if (products.length > 0) {
      id = products[products.length - 1].id + 1;
    }
    return id;
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
    } catch (error) {
      throw error;
    }
  }

  async fileExists() {
    try {
      await fs.promises.access(this.path, fs.constants.F_OK); //verifico si existe el archivo
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {

    try {
      if (this.fileExists()) {
        const dataProducts = await fs.promises.readFile(this.path, "utf-8");
        if (dataProducts.length === 0) {
          return [];
        }
        const products = JSON.parse(dataProducts);
        return products;
      } else {
        throw new Error("File not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {

    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const product = products.find(product => product.id == id);
        if (product) {
          return product;
        } else {
          console.error("Product not found");
          return false;
        }
      } else {
        throw new Error("File not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async addProduct(product) {

    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const newId = this.asignId(products);
        
        const newProduct = {
            id: newId,
            status: true,
            ...product,
            };

        products.push(newProduct);
        await this.saveProducts(products);
        console.log("Product added successfully");
        return "Product added successfully";

      } else {
        throw new Error("File not found");
      }
    } catch (error) {
      throw error;
    }
  }


  async updateProductById(id,updateProduct) {

    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const indexProduct = products.findIndex((product) => {return product.id === id});
        products[indexProduct] = {...products[indexProduct], ...updateProduct};
        await this.saveProducts(products);
        console.log("Product updated successfully");
        return "Product updated successfully";

      } else {
        throw new Error("File not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {

    try {
      if (this.fileExists()) {
        const products = await this.getProducts();
        const indexProduct = products.findIndex(product => product.id === id);
        products.splice(indexProduct,1);
        await this.saveProducts(products);
        console.log("Product deleted successfully");
        return"Product deleted successfully";

      } else {
        throw new Error("File not found");
      }
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;
