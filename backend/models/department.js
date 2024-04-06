const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  departmentId: {
    type: String,
    required: false,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  head: {
    type: String,
    // ref: "Doctor",
  },
  staff: [{
    type: String,
    // ref: "Nurse",
  }],
});

const Department = mongoose.model("Department", departmentSchema, "departments");
module.exports = Department;
