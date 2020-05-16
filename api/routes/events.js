const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/event");
const Sensor = require("../models/sensor");

router.get("/", (req, res, next) => {
  Event.find()
    .select("sensor mesure _id")
    //.populate("sensor")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        events: docs.map((doc) => {
          return {
            _id: doc._id,
            sensor: doc.sensor,
            mesure: doc.mesure,
            request: {
              type: "GET",
              url: "/events/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/", (req, res, next) => {
  Sensor.findById(req.body.sensorId)
    .then((sensor) => {
      if (!sensor) {
        return res.status(404).json({
          message: "Sensor not found",
        });
      }
      const event = new Event({
        _id: mongoose.Types.ObjectId(),
        mesure: req.body.mesure,
        sensor: req.body.sensorId,
      });
      return event.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Event stored",
        createdEvent: {
          _id: result._id,
          sensor: result.sensor,
          mesure: result.mesure,
        },
        request: {
          type: "GET",
          url: "/events/" + result._id,
        },
      });
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({
        //message: "Sensor not found",
        error: error,
      });
    });
});

router.get("/:eventsId", (req, res, next) => {
  Event.findById(req.params.eventsId)
    .exec()
    .then((event) => {
      res.status(200).json({
        event: event,
        request: {
          type: "GET",
          url: "/events/",
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});
/* const id = req.params.eventsId;
  res.status(200).json({
    message: `data of ${id}`,
    eventsId: req.params.eventsId,
  });
});*/

router.delete("/:eventsId", (req, res, next) => {
  Event.remove({ _id: req.params.eventsId })
    .exec()
    .then((result) => {
      if (!_id) {
        return res.status(404).json({
          message: "Event not found",
        });
      }
      res.status(200).json({
        message: "Event deleted",
        request: {
          type: "POST",
          url: "/events/",
          body: { sensorId: "ID", mesure: "Number" },
        },
      });
    })
    .catch();
});

module.exports = router;
