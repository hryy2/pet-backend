const express=require("express");
const { createCategory, updateCategory, deleteCategory, getAllCategory, getCategory } = require("../controller/productCategoryCtrl");
const { authMiddleware} = require("../middlewares/authMiddleware");
const router=express.Router();

router.post('/',authMiddleware,createCategory);
router.put('/:id',authMiddleware,updateCategory);
router.delete('/:id',authMiddleware,deleteCategory);
router.get('/',getAllCategory);
router.get('/:id',getCategory);
module.exports=router