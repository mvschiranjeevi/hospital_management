const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: "",
  },
  reason: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "inProgress", "completed", "cancelled"],
    default: "scheduled",
  },
  notes: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },
});

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "appointments"
);
module.exports = Appointment;
