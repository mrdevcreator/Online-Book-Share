const express = require("express");
const router = express.Router();
const loginoutControllers = require("../controllers/login&logoutControllers");

router.use(loginoutControllers.session);
// router.get("/protected", loginoutControllers.requireLogin);
// router.get("/adminprotected", loginoutControllers.requireAdminLogin);
router.get("/login", loginoutControllers.loginpage);
router.post("/login", loginoutControllers.login);
router.get(
  "/logout",
  loginoutControllers.requireLogin,
  loginoutControllers.logout
);

module.exports = router;
