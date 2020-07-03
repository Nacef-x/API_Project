const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true,
  },
  mesure: { type: Number, required: true },
  //TODO: add time
  time: { type: Date, required: true },
});
module.exports = mongoose.model("Event", eventSchema);
