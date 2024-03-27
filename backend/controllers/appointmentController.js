const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Patient = require("../models/user");

const checkAccess = require("../middlewares/checkAccess");

router.get("/get-appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await Appointment.find({ patient: id }).populate(
      "doctor"
    );

    if (appointments.length === 0) {
      return res.json({ message: "No Appointments Booked!" });
    }

    const appointmentsWithDoctorNames = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctor);
        const doctorName = doctor ? doctor.name : "Unknown Doctor";
        return {
          ...appointment._doc,
          doctorName: doctorName,
        };
      })
    );
    console.log(appointmentsWithDoctorNames);
    res.json(appointmentsWithDoctorNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-appointment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await Appointment.find({ doctor: id });

    if (appointments.length === 0) {
      return res.json({ message: "No Appointments Booked!" });
    }

    // Use Promise.all to fetch all patient names in parallel
    const appointmentsWithPatientName = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await Patient.findById(appointment.patient).exec(); // Assuming `patient` is the correct field name on the appointment object
        console.log(patient);
        // Clone the appointment object and add patientName to it
        return {
          ...appointment.toObject(),
          patientName: patient ? patient.userName : "Unknown",
        }; // Assuming `name` is the field on the patient object
      })
    );

    return res.json(appointmentsWithPatientName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-appointment", async (req, res) => {
  console.log(req.body);
  const {
    doctor,
    patient,
    appointmentDate,
    reason,
    phone,
    email,
    time,
    gender,
  } = req.body;

  try {
    const userId = req.userId;

    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      reason,
      phone,
      email,
      time,
      gender,
    });

    const savedAppointment = await newAppointment.save();
    res.status(200).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
