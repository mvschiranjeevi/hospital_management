const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  validity: {
    type: Date,
    required: true,
  },
  outOfThePocket: {
    type: Number,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  }
});

const Insurance = mongoose.model("Insurance", insuranceSchema, "insurance");
module.exports = Insurance;
