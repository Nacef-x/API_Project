const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const SensorsControllers = require("../controllers/sensors");

router.get("/", SensorsControllers.sensors_get_all);

router.post("/", checkAuth, SensorsControllers.sensors_create_sensor);

router.get("/:sensorId", SensorsControllers.sensors_get_sensor);

router.patch("/:sensorId", checkAuth, SensorsControllers.sensors_modify_sensor);

router.delete(
  "/:sensorId",
  checkAuth,
  SensorsControllers.sensors_delete_sensor
);
module.exports = router;
