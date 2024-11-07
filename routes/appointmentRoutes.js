import express from "express";
import { approveAppointment, bookAppointment, cancelAppointment, deleteAppointment, getAllAppointments, getAppointments, getDoctorAppointments } from "../controllers/appointmentController.js";
import { authenticateUser } from "../middlewares/auth.js"

const router = express.Router()

router.post("/book",authenticateUser, bookAppointment)
router.patch("/cancel/:appointmentId",authenticateUser, cancelAppointment)
router.delete("/delete/:appointmentId",deleteAppointment)
router.get("/allAppointments",getAllAppointments)
router.patch("/approve/:appointmentId", authenticateUser ,approveAppointment)
router.get("/getUserAppointment",authenticateUser , getAppointments)
router.get("/doctorAppointments/:id",getDoctorAppointments)


export default router

