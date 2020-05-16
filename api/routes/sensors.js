const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ dest: "uploads/" });

const Sensor = require("../models/sensor");

router.get("/", (req, res, next) => {
  Sensor.find()
    .select("name description _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        sensors: docs.map((doc) => {
          return {
            name: doc.name,
            description: doc.description,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http/sensors/" + doc._id,
            },
          };
        }),
      };
      //if (docs.length > 0) {
      res.status(200).json(response);
      /*} else {
        res
          //.status(404)
          .json({
            message: "No data",
          });
      }*/
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("sensorData"), (req, res, next) => {
  console.log(req.file);
  const sensor = new Sensor({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
  });
  sensor
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "created sensor",
        createdSensor: {
          name: result.name,
          description: result.description,
          _id: result._id,
          request: {
            type: "GET",
            url: "http/sensors/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/:sensorId", (req, res, next) => {
  const id = req.params.sensorId;
  Sensor.findById(id)
    .select("name description _id")
    .exec()
    .then((docs) => {
      console.log("from DB", docs);
      if (docs) {
        res.status(200).json({
          sensor: docs,
          request: {
            type: "GET",
            url: "http/sensors/" + docs._id,
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "no valid entry found for provided ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });

  /* switch (id) {
    case "HeartRate":
      res.status(200).json({
        message: "this is HeartRate",
      });
      break;
    case "Acceleration":
      res.status(200).json({
        message: "this is Acceleration",
      });
      break;
    case "Temperature":
      res.status(200).json({
        message: "this is Temperature",
      });
      break;
  }*/
});

router.patch("/:sensorId", (req, res, next) => {
  const id = req.params.sensorId;
  const updateOperations = {};
  for (const Operations of req.body) {
    updateOperations[Operations.propName] = Operations.value;
  }
  Sensor.update({ _id: id }, { $set: updateOperations })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "sensor updated",
        request: {
          type: "GET",
          url: "http/sensors/" + id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.delete("/:sensorId", (req, res, next) => {
  const id = req.params.sensorId;
  Sensor.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "sensor deleted",
        request: {
          type: "POST",
          url: "http/sensors/",
          body: { name: "String", description: "String" },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});
module.exports = router;
