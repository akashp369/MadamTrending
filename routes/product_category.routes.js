const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Multer");
const categoryController = require("../controllers/product_category.controller");
const {
  requireAdminLogin,
  requireUserLogin,
} = require("../middlewares/requireLogin");

router.post(
  "/product/category/add",
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.addProductCategory_post
);

router.all("/product/category/all", categoryController.allCategory_get);

router.all("/product/category/all1", categoryController.allCategory_get1);

router.delete(
  "/product/category/:categoryId/delete",
  requireAdminLogin,
  categoryController.deleteProductCategory_delete
);

router.put("/product/category/:categoryId/edit",upload.fields([{ name: "image", maxCount: 1 }]) , categoryController.editCategory);

module.exports = router;
