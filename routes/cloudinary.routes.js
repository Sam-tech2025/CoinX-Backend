// routes/cloudinary.routes.js
const express = require("express");
const { generateSignature } = require("../controller/cloudionary.controller");
const router = express.Router();

router.post("/signature", generateSignature);

module.exports = router;
