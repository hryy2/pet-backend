const express = require("express");
const { authMiddleware} = require("../middlewares/authMiddleware");
const { createBrand, updateBrand, deleteBrand, getAllBrand, getBrand } = require("../controller/brandCtrl");
 
const router = express.Router();

router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.delete("/:id", authMiddleware, deleteBrand);
router.get("/", getAllBrand);
router.get("/:id", getBrand);
module.exports = router;
