const express = require("express")
const { getMetrics } = require("../controllers/metrics")

const router = express.Router()

//Routes
router.get("/", getMetrics)

module.exports = router