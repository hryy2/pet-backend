const validateMongoDbId = require("../utils/validateMongoDbId");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Brand.create(req.body);
    res.json(newCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const currCategory = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(currCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const dltCategory = await Brand.findByIdAndDelete(id);
    res.json(dltCategory);
  } catch (err) {
    throw new Error(EvalError);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Brand.find();
    res.json(allCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const categoryDetail = await Brand.findById(id);
    res.json(categoryDetail);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
};
