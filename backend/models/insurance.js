const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({
  insuranceId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  policyNo: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  coverage: {
    type: String,
    required: true,
  },
});

const Insurance = mongoose.model("Insurance", insuranceSchema, "insurance");
module.exports = Insurance;
