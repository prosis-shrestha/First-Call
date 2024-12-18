const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Location", LocationSchema);
