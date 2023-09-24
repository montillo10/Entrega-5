import { Router } from "express";
import { checkId,checkLimit } from "../utils/validations.js";
import ProductManager from "../dao/ProductManager.js";
import { ValidateProduct } from "../middlewares/product.middleware.js";


const router = Router();
const productManager = new ProductManager("products.json");
const validateProduct = new ValidateProduct();

//*validations middleware
//array de middlewares
 const addProductValidator = [validateProduct.checkParametres, validateProduct.checkCodeToAdd]; 
 const updateProductValidator = [checkId('pid'), validateProduct.checkParametres, validateProduct.checkCodeToUpdate];
 const deleteProductValidator = [checkId('pid'), validateProduct.checkProductExist];

//*----------------------routes---------------------------

router.get("/",checkLimit, async(req, res) => {
    try{
        const limit = parseInt(req.query.limit);
        if(limit){
            const products = await productManager.getProducts();
            const productsLimit = products.slice(0, limit);
            res.status(200).json({products : productsLimit, cantidad: productsLimit.length});
        }
        else{
            const products = await productManager.getProducts();
            res.status(200).json({products : products, cantidad: products.length});
        }
    }catch(error){
        res.status(500).json({error: error.message}) //en los get, el error es un mensaje, no un objeto
    }
});

router.get("/:pid", checkId('pid'), async (req, res) => {
    try{
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});

router.post("/", addProductValidator, async (req, res) => {
    try{
        const product = req.body;
        const result = await productManager.addProduct(product);
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});
  

router.put("/:pid",updateProductValidator, async (req, res) => {
    try{
        const id = parseInt(req.params.pid);
        const product = req.body;
        const result = await productManager.updateProductById(id, product);
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});

router.delete("/:pid",deleteProductValidator, async (req, res) => {
    try{
        const id = parseInt(req.params.pid);
        const result = await productManager.deleteProductById(id);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error.message})
    }
});
export {router as productsRouter};

