const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
  occupancy: {
    type: Number,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema, "rooms");
module.exports = Room;
