const ProductCategory=require('../models/productCategoryModel');
const asyncHandler=require("express-async-handler")
const validateMongoDbId=require('../utils/validateMongoDbId')

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory = await ProductCategory.create(req.body);
        res.json(newCategory)
    }
    catch(err){
        throw new Errror(err)
    }
})

const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try{
        const currCategory = await ProductCategory.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
          }
        );
        res.json(currCategory)
    }
    catch(err){
        throw new Error(err)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try{
        const dltCategory = await ProductCategory.findByIdAndDelete(id);
        res.json(dltCategory)
    }
    catch(err){
        throw new Error(EvalError)
    }
})
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.query;
        let allCategory;
        if (category) {
            allCategory = await ProductCategory.find({ title: { $regex: category, $options: 'i' } });
            allCategory.sort((a, b) => {
                const indexA = a.title.toLowerCase().indexOf(category.toLowerCase());
                const indexB = b.title.toLowerCase().indexOf(category.toLowerCase());
                return indexA - indexB;
            });
        } else {
            allCategory = await ProductCategory.find().sort({ title: 1 });
        }
        res.json(allCategory);
    } catch (err) {
        throw new Error(err);
    }
});



const getCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try{
        const categoryDetail = await ProductCategory.findById(id);
        res.json(categoryDetail)
    }
    catch(err){
        throw new Error(err)
    }
})

module.exports={createCategory,updateCategory,deleteCategory,getAllCategory,getCategory}
