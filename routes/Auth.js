const router = require("express").Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const { signup, login } = require("../services/authServices");

// LOGIN
router.post("/login", loginValidator, login);

// REGISTRATION
router.post("/register", signupValidator, signup);

module.exports = router;
