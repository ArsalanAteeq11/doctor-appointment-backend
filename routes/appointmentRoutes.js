import express from "express";
import { approveAppointment, bookAppointment, cancelAppointment, deleteAppointment, getAllAppointments, getDoctorAppointments, getPatientAppointments } from "../controllers/appointmentController.js";
// import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router()

router.post("/book",bookAppointment)
router.patch("/cancel/:appointmentId",cancelAppointment)
router.delete("/delete/:appointmentId",deleteAppointment)
router.get("/allAppointments",getAllAppointments)
router.patch("/approve/:appointmentId",approveAppointment)
router.get("/doctorAppointments/:id",getDoctorAppointments)
router.get("/patientAppointments/:id",getPatientAppointments)

export default router

