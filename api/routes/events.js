const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const EventsController = require("../controllers/events");

router.get("/", checkAuth, EventsController.events_get_all);

router.post("/", checkAuth, EventsController.events_post_event);

router.get("/:eventsId", checkAuth, EventsController.events_get_event);
/* const id = req.params.eventsId;
  res.status(200).json({
    message: `data of ${id}`,
    eventsId: req.params.eventsId,
  });
});*/

router.delete("/:eventsId", checkAuth, EventsController.events_delete_event);

module.exports = router;
