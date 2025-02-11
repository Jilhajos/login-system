const express = require("express");
const router = express.Router();

const { register } = require("../controllers/auth/registerController");
const { login } = require("../controllers/auth/loginController");
const { getProfile } = require("../controllers/auth/profileController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);

module.exports = router;
