import express from "express";
import {
  getAllDoctors,
  getAllPatients,
  getAllUsers,
  getUserById,
  login,
  register,
  verifyOTP,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);
router.get("/allusers", getAllUsers);
router.get("/alldoctors", getAllDoctors);
router.get("/allpatients", getAllPatients);
router.get("/getuser/:id", getUserById);

export default router;
