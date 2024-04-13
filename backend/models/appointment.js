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
  appointmentTimeId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ["scheduled", "inProgress", "completed", "cancelled"],
    default: "scheduled",
  },
  notes: {
    type: String,
  },
});

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "appointments"
);
module.exports = Appointment;
