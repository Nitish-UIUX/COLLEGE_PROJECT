import express from "express";
import { verifyAdmin } from "../middleware/VerifyToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

import {
  getAllProductsByCustomerId,
  addOrderProduct,
  getProductsByOrderId,
  getAllProductsByUsers,
  cancelOrder,
} from "./ApiFunctions/ProductOrderFunction.js";

const router = express.Router();

//customer routes
router.get("/ordered-products/:customer_id", verifyToken, getAllProductsByCustomerId);
router.post("/ordered-products", verifyToken, addOrderProduct);
router.post("/orderId", verifyToken, getProductsByOrderId);
router.post("/cancel-order", verifyToken, cancelOrder);

//admin routes
router.get(
  "/admin/ordered-products/:customer_id",
  verifyAdmin,
  getAllProductsByUsers
);

export default router;
