import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const bookAppointment = async (req, res) => {
    try {
      const { doctorId, patientId, day, date, timeSlot } = req.body;
  
      // Check if the time slot is already booked for the given date
      const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        day,
        date,
        timeSlot,
      });
  
      if (existingAppointment) {
        return res.status(400).json({ success: false, message: "This time slot is already booked." });
      }
  
      const appointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        day,
        date,
        timeSlot,
        status: "pending",
      });
  
      await appointment.save();
  
      res.status(201).json({ success: true, appointment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error booking appointment", error });
    }
  };
  
  export const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: "cancelled" },
        { new: true }
      );
  
      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
  
      res.status(200).json({ success: true, message: "Appointment cancelled", appointment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error cancelling appointment", error });
    }
  };
  export const deleteAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      const appointment = await Appointment.findByIdAndDelete(
        appointmentId
      );
  
      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
  
      res.status(200).json({ success: true, message: "Appointment Deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error cancelling appointment", error });
    }
  };
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor')  
      .populate('patient'); 

    if (!appointments) {
      return res.status(404).json({ success: false, message: "No appointments found" });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const approveAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: "approved" },  // Set status to approved
        { new: true }
      );
  
      if (!appointment) {
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });
      }
  
      res.status(200).json({ success: true, message: "Appointment approved", appointment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error approving appointment", error });
    }
  };

  // Assume you have middleware to extract the logged-in user's ID and role from their session or JWT
// export const getDoctorAppointments = async (req, res) => {
//     const { id} = req.params ; // Assuming req.user contains user info
    
//     try {
//       const appointments = await Appointment.find({doctor:id})
//      console.log(appointments)
      
//       if (!appointments) {
//         return res.status(404).json({ success: false, message: 'No appointments found' });
//       }
  
//       return res.status(200).json({ success: true, appointments });
//     } catch (error) {
//       console.error("Error fetching appointments", error);
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };
  
// export const getPatientAppointments = async (req, res) => {
//     const { id} = req.params ;  // Assuming req.user contains user info
    
//     try {
//       const appointments = await Appointment.find({patientId:id})
  
      
//       if (!appointments) {
//         return res.status(404).json({ success: false, message: 'No appointments found' });
//       }
  
//       return res.status(200).json({ success: true, appointments });
//     } catch (error) {
//       console.error("Error fetching appointments", error);
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };
  
// Assume you have middleware to extract the logged-in user's ID and role from their session or JWT
export const getAppointments = async (req, res) => {
  const userId = req.body.userId 

  const user = await User.findById(userId)
  
  try {
    let appointments;

    if (user?.role === 'doctor') {
      // If the logged-in user is a doctor, find appointments where they are the doctor
      appointments = await Appointment.find({ doctor: userId })
      .populate('patient')  ;
    } else if (user?.role === 'patient') {
      // If the logged-in user is a patient, find appointments where they are the patient
      appointments = await Appointment.find({ patient: userId })
      .populate('doctor')  ;
    }

    if (!appointments) {
      return res.status(404).json({ success: false, message: 'No appointments found' });
    }

    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
