const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../models/appointment");
const Time = require("../models/appiontmentTime");
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
        const time = await Time.findById(appointment.appointmentTimeId);

        const doctorName = doctor ? doctor.name : "Unknown Doctor";
        return {
          ...appointment._doc,
          doctorName: doctorName,
          timeDetails: time,
        };
      })
    );
    res.json(appointmentsWithDoctorNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-appointment/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    // Find the appointment to get the appointmentTimeId
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the status of the Time document to "free"
    await Time.findByIdAndUpdate(appointment.appointmentTimeId, {
      $set: { status: "free" },
    });

    // Option 1: Delete the appointment document
    await Appointment.findByIdAndDelete(appointmentId);

    res.json({ message: "Appointment cancelled and time slot freed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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
  const { doctor, patient, appointmentTimeId, reason } = req.body;
  console.log({ doctor, patient, appointmentTimeId, reason });
  try {
    const userId = req.userId;
    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentTimeId,
      reason,

    });

    const savedAppointment = await newAppointment.save();
    await Time.findByIdAndUpdate(
      appointmentTimeId,
      { $set: { status: "booked" } },
      { new: true }
    );
    res.status(200).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  // Month is 0-indexed, add 1 for correct month and pad with 0 if needed
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

router.get("/get-appointment-time/:id", async (req, res) => {
  console.log('hit!')
  const { id } = req.params;
  try {
    // Get today's date in UTC in "YYYY-MM-DD" format for comparison
    const todayStr = getLocalDateString();

    const appointments = await Time.find({
      doctor: id,
      status: { $ne: "deleted" },
      date: { $gte: todayStr }, // Fetch appointments for today or future
    }).populate("doctor");

    if (appointments.length === 0) {
      return res.json({ message: "No Future Appointments Found!" });
    }

    res.json({ appointments: appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-appointment-time", async (req, res) => {
  // If you're receiving an array of appointment times in the request
  const { appointments } = req.body;

  try {
    // Validate the structure of each appointment time if necessary
    const validatedAppointments = appointments.map(
      ({ doctor, date, time, fee }) => {
        // Validation logic here (optional)
        return { doctor, date, time, fee };
      }
    );

    // Save the validated appointment times to the database
    const savedTimes = await Time.insertMany(validatedAppointments);

    res.status(200).json(savedTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-appointment/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Time.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/available-times/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query; // Assuming the date is passed as a query parameter
  console.log(date);

  try {
    const appointmentTimes = await Time.find({
      date: date,
      doctor: doctorId,
      status: "free",
    }).populate("doctor");
    console.log(appointmentTimes);
    // Check if any appointment times were found
    if (!appointmentTimes.length) {
      return res.status(200).send([]);
    }

    res.json(appointmentTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
