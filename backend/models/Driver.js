const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  dname: { type: String, unique: true },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Driver", DriverSchema);
