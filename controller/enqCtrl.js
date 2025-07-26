const validateMongoDbId = require("../utils/validateMongoDbId");
const asyncHandler = require("express-async-handler");
const Enquiry = require("../models/enqModel");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Enquiry.create(req.body);
    res.json(newCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const currCategory = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(currCategory);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const dltCategory = await Enquiry.findByIdAndDelete(id);
    res.json(dltCategory);
  } catch (err) {
    throw new Error(EvalError);
  }
});

const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Enquiry.find();
    res.json(allCategory);
  } catch (err) {
    throw new Error(err);
  }
});
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const categoryDetail = await Enquiry.findById(id);
    res.json(categoryDetail);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAllEnquiry,
  getEnquiry,
};
