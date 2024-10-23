const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  profileController,
  logoutController,
} = require("../controllers/auth.controllers");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", profileController);
router.post("/logout", logoutController);

module.exports = router;
