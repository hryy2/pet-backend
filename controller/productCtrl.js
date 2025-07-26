const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify=require("slugify")
const User = require("../models/userModel");
const validateMongoDbId=require('../utils/validateMongoDbId')
 const {cloudinaryUploadImg, cloudinaryDeleteImg}=require('../utils/cloudinary')
 const fs=require('fs')
const createProduct = asyncHandler(async (req, res) => {
  try {
    if(req.body.title){
        req.body.slug=slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new error(error);
  }
});

const updateProduct=asyncHandler(async(req,res)=>{
  const { slug } = req.params;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
      const updateProduct = await Product.findOneAndUpdate({ slug: slug },req.body,{new:true,})
            res.json(updateProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteProduct=await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    }
    catch(error){
        throw new Error(error);
    }
})

const getaProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const findProduct = await Product.findOne({slug:slug}).populate("color");
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}); // 无过滤条件
    const totalPages = 1; // 简单写死

    res.status(200).json({
      success: true,
      data: {
        product,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});


 
// const getAllProduct = asyncHandler(async (req, res) => {
//   try {
//     const queryObj = {};
    
//     // Handle filters with operators like gte/lte
//     if (req.query['totalRatings[gte]']) {
//       queryObj.totalRatings = { $gte: parseFloat(req.query['totalRatings[gte]']) };
//     }

//     if (req.query['discount[gte]']) {
//       queryObj.discount = { $gte: parseFloat(req.query['discount[gte]']) };
//     }

//     if (req.query['price[gte]'] || req.query['price[lte]']) {
//       queryObj.price = {};
//       if (req.query['price[gte]']) {
//         queryObj.price.$gte = parseFloat(req.query['price[gte]']);
//       }
//       if (req.query['price[lte]']) {
//         queryObj.price.$lte = parseFloat(req.query['price[lte]']);
//       }
//     }

//     // Color (handled as array in frontend)
//     if (req.query.color) {
//       // query.color can be either a string or an array
//       const colors = Array.isArray(req.query.color) ? req.query.color : [req.query.color];
//       queryObj.color = { $in: colors };
//     }

//     let query = Product.find(queryObj);

//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = 8;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     const product = await query;
//     const totalProducts = await Product.countDocuments(queryObj);
//     const totalPages = Math.ceil(totalProducts / limit);

//     res.status(200).json({
//       success: true,
//       data: {
//         product,
//         totalPages,
//       },
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error("Server error");
//   }
// });


// controllers/productCtrl.js
const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;  // 获取查询参数

  if (!query) {
    return res.status(400).json({ message: 'Please provide a search query' });
  }

  try {
    // 使用正则表达式进行模糊匹配
    const products = await Product.find({
      title: { $regex: query, $options: 'i' },  // 'i'表示不区分大小写
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    throw new Error(error);
  }
});



const addToWishList=asyncHandler(async(req,res)=>{
  
   const { _id } = req.user;
   const { prodId } = req.body;
   try {
     const user = await User.findById(_id);
     const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
     if (alreadyadded) {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $pull: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     } else {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $push: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     }
   } catch (error) {
     throw new Error(error);
   }
})

const rating=asyncHandler(async(req,res)=>{
  const {_id}=req.user;
  const {star,prodId,comment}=req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );
    if (alreadyRated) {
        const updateRating = await Product.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
    }
    else{
      const rateProduct=await Product.findByIdAndUpdate(prodId,{
        $push:{
          ratings:{
            star:star,
            comment:comment,
            postedBy:_id
          }
        }
      },{new:true})
    }
    const getAllRating=await Product.findById(prodId);
    let totalRating =getAllRating.ratings.length;

    let ratingsum = getAllRating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRatings: actualRating,
      },
      { new: true }
    ) ;
    res.json(finalproduct);
  } catch (err) {
    throw new Error(err);
  }
})

const uploadImages=asyncHandler(async(req,res)=>{
  try{
const uploader = async (path) => {
  const newpath = await cloudinaryUploadImg(path, "images");
  return newpath;
};
const urls=[];
const files=req.files;
for(const file of files){
  const {path}=file;
  const newpath=await uploader(path);
  urls.push(newpath)
}
const images=urls.map((file)=>{
  return file
}
)
res.json(images)
  } 
  catch(err){
    throw new Error(err)
  }
})
const deleteImages=asyncHandler(async(req,res)=>{
  const {id}=req.params
  try{
  const deleted=cloudinaryDeleteImg(id,"images");
  res.json({message:"deleted"})
  } 
  catch(err){
    throw new Error(err)
  }
})
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ message: 'Invalid product IDIDID' });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    throw new Error("Invalid product ID");
  }
});


module.exports = { searchProducts, createProduct,getaProduct,getAllProduct,updateProduct,deleteProduct,addToWishList,rating,uploadImages,deleteImages,getProductById };
