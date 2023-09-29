const express = require("express");
const {
  requireAdminLogin,
  requireUserLogin,
} = require("../middlewares/requireLogin");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/admin/user/all", userController.allusers_get);

router.post(
  "/admin/user/:userId/block/:blockStatus",
  requireAdminLogin,
  userController.blockUser_post
);
router.delete(
  "/admin/user/:userId/delete",
  requireAdminLogin,
  userController.deleteUser_delete
);

router.post(
  "/user/address/update",
  requireUserLogin,
  userController.updateUserAddress_post
); 

router.post(
  "/user/address/delete",
  requireUserLogin,
  userController.updateUserAddress_post1
); 

router.post(
  "/user/news",
  userController.newsPost
); 

router.get(
  "/user/getNews",
  userController.getNews
); 

module.exports = router;
