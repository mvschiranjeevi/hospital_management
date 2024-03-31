const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentTimeSchema = new Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: "",
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["free", "booked", "cancelled"],
    default: "free",
  },
});

const AppointmentTime = mongoose.model(
  "AppointmentTime",
  appointmentTimeSchema,
  "appointmentTime"
);
module.exports = AppointmentTime;
