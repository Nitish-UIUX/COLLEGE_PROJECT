import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  getFaq,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
} from "./ApiFunctions/FaqFunction.js";

const router = express.Router();

router.get("/faq", getFaq);
router.get("/faq/:faq_id", getFaqById);

// Protected route
router.post("/faq",  addFaq);
router.put("/faq/:faq_id", verifyToken, updateFaq);
router.delete("/faq/:faq_id", verifyToken, deleteFaq);

export default router;
// In the above snippet, we have defined the routes for the FAQs API. We have used the getFaq, getFaqById, addFaq, updateFaq, and deleteFaq functions from the FaqFunction.js file to handle the API requests.
