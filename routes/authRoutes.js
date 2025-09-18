import express from "express";
import {
  registerRetailer,
  registerDistributor,
  verifyOtp,
  login,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-retailer", registerRetailer);
router.post("/register-distributor", registerDistributor);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
