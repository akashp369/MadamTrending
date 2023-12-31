const express = require("express");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const productController = require("../controllers/product.controller");
const router = express.Router();
const upload = require("../middlewares/Multer");
router.get("/product/all", productController.allProducts_get);
router.get("/product/:productId", productController.getParticularProduct_get);
router.get("/product/random/:limit", productController.randomProducts_get);
router.post("/product/filter", productController.filterProducts_post);
router.post( 
  "/admin/product/add",
  // requireAdminLogin,
  upload.fields([{ name: "image", maxCount: 6 }]),
  productController.addProduct_post
);
router.post( 
  "/admin/product/addsubImage/:productId",
  upload.fields([{ name: "image", maxCount: 5 }]),
  productController.updateSubImage
);
router.put(
  "/admin/product/:productId/edit",
  upload.fields([{ name: "image", maxCount: 6 }]), 
  productController.editProduct_post
);
router.get("/products/searchproduct",productController.searchProduct);
router.delete(
  "/admin/product/:productId/delete",
  productController.deleteProduct_delete
);
router.get("/product/search/paginated",productController.paginatedSearch);


module.exports = router;
 