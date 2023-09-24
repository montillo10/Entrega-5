import ProductManager from "../dao/ProductManager.js";
import { Router } from "express";

const router = Router();
const productManager = new ProductManager("products.json");

//*validations middleware

const addProductValidator = async(req, res, next) => {
    /**
     ** Validations: (in order)
     * Empty params (title, description, thumbnail, code, price, stock)
     * Invalid Parametres String (title, description, thumbnail, code, category)
     * Invalid Parametres Number (price, stock)
     * invalid Parametres (price must be greater than 0. Stock must be greater or equal than 0)
     * Code already exists 
     * File not found (validations in ProductManager.js)
     */
    try{
        const product = req.body;

        if(!product.title || !product.description || !product.code || !product.price  || !product.stock || !product.category ){     
            return res.status(400).json({error: 'Invalid parameters: all fields must be filled'}); 
        }
        if(typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'string' || typeof product.category !== 'string'){
            return res.status(400).json({error: 'Invalid parameters title, description, code, category must de characters'}); 
        }
        if(typeof product.price !== 'number' || typeof product.stock !== 'number'){
            return res.status(400).json({error: 'Invalid parameters: price, stock must be numbers'});
        }
        if(product.price <= 0 || product.stock < 0){
            return res.status(400).json({error: 'Invalid parameters: price must be greater than 0, stock must be greater or equal than 0'}); 
        }

        //** Validaciones de Código para el add: 
        // Comparamos que el código que se quiere agregar no exista en otro producto	

        const code = req.body.code;
        const products = await productManager.getProducts();
        const productExists = products.some(product => product.code === code);

        if(productExists){  
            return res.status(400).json({error: 'Invalid parameters: code already exists'}); 
        }

        next();
    } catch (error){
        res.status(500).json({error: error.message})
    }
    
};

const updateProductValidator = async(req, res, next) => {
    /**
     ** Validations (in order):
     * Empty params (title, description, thumbnail, code, price, stock, id)
     * Invalid Parametres String (title, description, thumbnail, code, category)
     * Invalid Parametres Number (price, stock)
     * invalid Parametres (price > 0, stock >= 0)
     * Code already exists
     * File not found (validations in ProductManager.js)
     */
    try{
        const product = req.body;
        const idUpdate = req.params.pid; //id ya fue validado en el checkId


        if(!product.title || !product.description || !product.code || !product.price  || !product.stock || !product.category || !id){    
            return res.status(400).json({error: 'Invalid parameters: all fields must be filled'}); 
        }
        if(typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'string' || typeof product.category !== 'string'){
            return res.status(400).json({error: 'Invalid parameters title, description, code, category must de characters'}); 
        }
        if(typeof product.price !== 'number' || typeof product.stock !== 'number' || typeof id !== 'number'){
            return res.status(400).json({error: 'Invalid parameters: price, stock must be numbers'});
        }
        if(product.price <= 0 || product.stock < 0 || id < 0){
            return res.status(400).json({error: 'Invalid parameters: price must be greater than 0, stock must be greater or equal than 0, id must be greater than 0,'}); 
        }

         //** Validaciones de Código para el update: 
         // 1º: Primero verificamos si el producto ya existe dentro del arreglo, si existe, obtenemos el índice del producto

        const products = await productManager.getProducts();
        const indexProductFound = productManager.findIndexProduct(product =>{product.id === idUpdate});

        if(indexProductFound === -1){
            return res.status(400).json({error: 'Invalid parameters: product not found'});
        }
        // 2º: Si el producto existe, verificamos si el código del producto es igual al código que se quiere actualizar
        // IMPORTANTE: si el código del producto es igual al código que se quiere actualizar, elimino el código del producto.
        
        if(products[indexProductFound].code === product.code){
            delete products[indexProductFound].code; //si es igual, borramos el código del producto
        }

        //3º Ahora comparamos que el código que se quiere actualizar no exista en otro producto	
        const codeExists = products.some(product => product.code === product.code);
        if(codeExists){
            return res.status(400).json({error: 'Invalid parameters: code already exists'});
        }

        next();

    }catch (error) {
        res.status(500).json({error: error.message})
    }
}

const checkId = (req, res, next) => { 
    //* IMPORTANTE: siempre es el primer middleware que se ejecuta (cuando se hace un get, put o delete)
    /**
     ** Validations:
     * Empty params (id)
     * Invalid Parametres (number: idProduct)
     * File not found (validations in ProductManager.js)
     */

    const id = req.params.id;
    if(!id){
        return res.status(400).json({error: 'Invalid parameters: id is required'}); 
    }
    if(typeof id !== 'number'){
        return res.status(400).json({error: 'Invalid parameters: id must be a number'}); 
    }
    if(id < 0){
        return res.status(400).json({error: 'Invalid parameters: id must be greater than 0'}); 
    }
    next();
}

//*routes

router.get("/", async (req, res) => {
    try{
        const limit = parseInt(req.query.limit);
        if(limit && limit > 0 && typeof limit === "number"){
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

router.get("/:id", checkId, async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const product = await productManager.getProductById(id);
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});

router.post("/", addProductValidator,async (req, res) => {
    try{
        const product = req.body;
        const result = await productManager.addProduct(product);
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});

router.put("/:id",checkId,updateProductValidator, async (req, res) => {
    try{
        const id = req.params.id;
        const product = req.body;
        const result = await productManager.updateProduct(id, product);
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error: error.message})
    }
});

router.delete("/:id",checkId, async (req, res) => {
    try{
        const id = req.params.id;
        const result = await productManager.deleteProduct(id);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error.message})
    }
});
export {router as productsRouter};




//Códigos de validación para el add y update de productos, se encuentran en el archivo src/routes/products.router.js

