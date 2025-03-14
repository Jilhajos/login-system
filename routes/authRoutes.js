const express = require("express");
const {registerUser, handleOTPlessLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/handlelogin",handleOTPlessLogin)
router.post("/register",registerUser)

module.exports = router;
