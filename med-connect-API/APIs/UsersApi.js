import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { verifyAdmin } from "../middleware/VerifyToken.js";
import {
  getMessage,
  register,
  login,
  profile,
  // profileById,
  profileEdit,
  profileDelete,
  logout,
  adminProfile,
  adminProfileEdit,
  adminProfileDelete,
  getUserById,

} from "./ApiFunctions/UsersFunction.js";

const router = express.Router();

router.get("/q", getMessage);
router.post("/register", register);
router.post("/login", login);
// router.get("/profilebyid", profileById);

// Protected route for user
router.get("/profile", verifyToken, profile);
router.get("/userById", verifyToken, getUserById);
router.put("/profile-edit", verifyToken, profileEdit);
router.post("/profile-delete", verifyToken, profileDelete);
router.post("/logout", verifyToken, logout);

// protected route for admin
router.get("/admin-profile", verifyAdmin, adminProfile);
router.put("/admin-profile-edit", verifyAdmin, adminProfileEdit);
router.post("/admin-profile-delete", verifyAdmin, adminProfileDelete);

export default router;
