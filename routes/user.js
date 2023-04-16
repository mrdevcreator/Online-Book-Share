const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const loginoutControllers = require("../controllers/login&logoutControllers");

router.post("/register", userController.register);

router.patch(
  "/updateUser",
  loginoutControllers.requireUserLogin,
  userController.Userupdate
);
router.get(
  "/profile",
  loginoutControllers.requireUserLogin,
  userController.UserbyId
);
router.get(
  "/wishlist",
  loginoutControllers.requireLogin,
  userController.wishlist
);
router.post(
  "/wishlist",
  loginoutControllers.requireUserLogin,
  userController.addwish
);

router.post(
  "/addBookRequest",
  loginoutControllers.requireUserLogin,
  userController.bookreq
);

router.get(
  "/profileBookReq",
  loginoutControllers.requireUserLogin,
  userController.seeBookReq
);

router.get("/book/:id", userController.viewBookbyId);
router.get("/book", userController.bookList);
router.get(
  "/profileBooks",
  loginoutControllers.requireUserLogin,
  userController.profileBooks
);

router.get("/search", userController.searchBook);

router.post(
  "/borrow/:bookId",
  loginoutControllers.requireUserLogin,
  userController.borrow
);

router.get(
  "/borrowProfile",
  loginoutControllers.requireUserLogin,
  userController.profileBorrows
);

router.delete(
  "/cancelBorrow",
  loginoutControllers.requireUserLogin,
  userController.cancelborrowreq
);

router.patch(
  "/upborrowstatus",
  loginoutControllers.requireUserLogin,
  userController.upborrowstatus
);
router.patch(
  "/upendDate",
  loginoutControllers.requireUserLogin,
  userController.upendDate
);
router.post(
  "/exchange/:bookId",
  loginoutControllers.requireUserLogin,
  userController.exchange
);

router.patch(
  "/upexchangeDate",
  loginoutControllers.requireUserLogin,
  userController.upExchangeDate
);

router.get(
  "/exchangeProfile",
  loginoutControllers.requireUserLogin,
  userController.profileExchanges
);

router.patch(
  "/exStatusUse1",
  loginoutControllers.requireUserLogin,
  userController.statusUser1
);
router.patch(
  "/exStatusUse2",
  loginoutControllers.requireUserLogin,
  userController.statusUser2
);

router.delete(
  "/cancelExchange",
  loginoutControllers.requireUserLogin,
  userController.cancelExchange
);

module.exports = router;
