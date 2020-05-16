const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true,
  },
  mesure: { type: Number, required: true },
});
module.exports = mongoose.model("Event", eventSchema);
