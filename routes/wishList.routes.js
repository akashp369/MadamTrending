const router=require("express").Router();
const { test, getWishList, addToWishList, moveToCart } = require("../controllers/wishListController");
const { requireUserLogin } = require("../middlewares/requireLogin");



router.get("/api/wishlist/test",test);
router.get("/api/wishlist/getwishlist",requireUserLogin,getWishList);
router.post("/api/wishlist/product/:productId/:type",requireUserLogin,addToWishList);
router.post("/api/wishlist/moveproduct/:productId",requireUserLogin,moveToCart);

module.exports=router;