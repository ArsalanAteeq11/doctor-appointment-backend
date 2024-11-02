import express from "express";
import {
  deleteUser,
  editProfile,
  getAllDoctors,
  getAllPatients,
  getAllUsers,
  getUserById,
  login,
  register,
  verifyOTP,
} from "../controllers/userController.js"
import multer from "multer"
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination:"uploads",
  filename:(req,file,cb)=>{
    return cb(null,`${Date.now()}${file.originalname}`)
  }
})

const upload = multer({storage:storage})

router.post("/register", register);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);
router.post("/editprofile",upload.single("image"),authenticateUser,editProfile)
router.get("/allusers", getAllUsers);
router.get("/alldoctors", getAllDoctors);
router.get("/allpatients", getAllPatients);
router.get("/getuser/:id", getUserById);
router.delete("/delete/:id",deleteUser)

export default router;
