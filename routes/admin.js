const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const loginoutControllers = require("../controllers/login&logoutControllers");
// Routes
router.get(
  "/admin/users",
  loginoutControllers.requireAdminLogin,
  adminController.viewUser
);
router.get(
  "/admin/users/:id",
  loginoutControllers.requireAdminLogin,
  adminController.viewUserbyId
);
router.post(
  "/admin/users",
  loginoutControllers.requireAdminLogin,
  adminController.create
);
router.patch(
  "/veifyUser",
  loginoutControllers.requireAdminLogin,
  adminController.verifyUser
);
router.delete(
  "/wishlist",
  loginoutControllers.requireAdminLogin,
  adminController.removeWish
);

router.post(
  "/addBook",
  loginoutControllers.requireAdminLogin,
  adminController.addBook
);

router.patch(
  "/Book/:id",
  loginoutControllers.requireAdminLogin,
  adminController.updateBook
);

router.delete(
  "/Book/:id",
  loginoutControllers.requireAdminLogin,
  adminController.delBook
);

router.get(
  "/allBook",
  loginoutControllers.requireAdminLogin,
  adminController.seeallBook
);

router.get(
  "/borrows",
  loginoutControllers.requireAdminLogin,
  adminController.borrowInfos
);
router.get(
  "/exchanges",
  loginoutControllers.requireAdminLogin,
  adminController.exchangeInfos
);

module.exports = router;
