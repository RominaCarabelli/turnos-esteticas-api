const express = require("express");
const { getActivities } = require("../controllers/activitiesController");

const router = express.Router();

router.get("/", getActivities);

module.exports = router;