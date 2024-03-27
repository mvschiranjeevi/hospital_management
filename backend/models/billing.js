const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  insuranceId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  billedOn: {
    type: String,
    required: true,
  },
});

const Billing = mongoose.model("Billing", billingSchema, "billing");
module.exports = Billing;
