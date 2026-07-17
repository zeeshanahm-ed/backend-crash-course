const express = require("express");
const User = require("../models/user");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validations/auth.validation");
const { handleLoginUser, handleSignupUser } = require("../../controller/auth");

const router = express.Router();

router.post("/login", validate(loginSchema), handleLoginUser);
router.post("/signup", validate(signupSchema), handleSignupUser);

module.exports = router