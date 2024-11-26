import express from "express";
import { verifyAdmin } from "../middleware/VerifyToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

import {    getAllProducts, 
            getProductById, 
            getProductByArrayOfIds,
            addTocart,
            removeFromCart,
            addProduct,
            getCart,
            updateProduct, 
            deleteProduct, 
            buyProduct,
            cancelProduct} from "./ApiFunctions/ProductFunction.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:product_id", getProductById);
router.post("/productbyarray", getProductByArrayOfIds);
router.post("/addtocart/:product_id", addTocart);
router.get("/cart", getCart);
router.delete("/removefromcart/:product_id", removeFromCart);

// Protected route for admin
router.post("/product",verifyAdmin, addProduct);
router.put("/product/:product_id", verifyAdmin, updateProduct);
router.delete("/product/:product_id", verifyAdmin, deleteProduct);

// Protected route for user
router.post("/buyproduct", verifyToken, buyProduct);
router.put("/cancelproduct", verifyToken, cancelProduct);



export default router;
