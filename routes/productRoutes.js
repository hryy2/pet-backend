const express = require("express");

const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages, deleteImages, getProductById} = require("../controller/productCtrl");
const {authMiddleware}=require('../middlewares/authMiddleware');
const { searchProducts } = require("../controller/productCtrl");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/id/:id", getProductById); // ✅ 新增：通过 id 获取商品
router.get("/search", searchProducts);  // 新增：搜索商品
// router.get("/:slug",getaProduct)
router.post('/upload',authMiddleware,uploadPhoto.array('images',5),productImgResize,uploadImages);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/:slug", authMiddleware, updateProduct);
router.post("/", authMiddleware, createProduct);
router.get("/",getAllProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.delete("/deleteImages/:id", authMiddleware, deleteImages);
module.exports = router;
