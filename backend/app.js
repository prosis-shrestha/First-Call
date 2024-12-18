const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const socketio = require("socket.io");
const Location = require("./models/Location");
const Driver = require("./models/Driver");

const server = http.createServer(app);
const PORT = process.env.PORT;

dotenv.config();
app.use(cors());

app.get("/api/drivers/:dname", async (req, res) => {
  try {
    const driver = await Driver.findOne({ dname: req.params.dname });
    res.json(driver);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", function (socket) {
  socket.on("send-location", async function (data) {
    try {
      const location = await Location.findOneAndUpdate(
        { name: data.name },
        {
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(),
        },
        { upsert: true, new: true } // Create if not exists  //new data instantly
      );

      io.emit("new-location", location);
    } catch (error) {
      console.error("Location update error:", error);
    }
  });

  socket.on("send-dlocation", async function (data) {
    try {
      const location = await Driver.findOneAndUpdate(
        { dname: data.dname },
        {
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(),
        },
        { upsert: true, new: true }
      );

      io.emit("new-dlocation", location);
    } catch (error) {
      console.error("Location update error:", error);
    }
  });

  socket.on("driver-disconnect", async function (driverName) {
    try {
      io.emit("driver-left", driverName);
    } catch (error) {
      console.error("Driver disconnection error:", error);
    }
  });

  socket.on("driver-inactive", async function (driverName) {
    try {
      const driverInfo = await Driver.findOneAndUpdate(
        { dname: driverName },
        {
          timestamp: new Date(),
          isActive: false,
        },
        { new: true }
      );
      io.emit("driver-unavailable", driverInfo);
    } catch (error) {
      console.error("Driver disconnection error:", error);
    }
  });

  socket.on("driver-active", async function (driverName) {
    try {
      const driverInfo = await Driver.findOneAndUpdate(
        { dname: driverName },
        {
          timestamp: new Date(),
          isActive: true,
        },
        { new: true }
      );
      io.emit("driver-available", driverInfo);
    } catch (error) {
      console.error("Driver disconnection error:", error);
    }
  });

  socket.on("user-call", function (datas) {
    io.emit("call-receive", datas);
  });

  socket.on("call-ride-complete", function (driverName) {
    io.emit("ride-complete", driverName);
  });
});

mongoose
  .connect(process.env.mongoDb)
  .then(() => {
    console.log("App connected to database");
    server.listen(process.env.PORT, (err) => {
      err && console.log(err);
      console.log(`Servers active on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
