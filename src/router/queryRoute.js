const express = require("express");
const { query } = require("../controllers/queryController");
const router = express.Router();

router.post("/contact", query);

module.exports = router;
