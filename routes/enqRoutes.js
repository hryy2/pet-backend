const express = require("express");
const { authMiddleware} = require("../middlewares/authMiddleware");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAllEnquiry,
  getEnquiry,
} = require("../controller/enqCtrl");

const router = express.Router();

router.post("/",  createEnquiry);
router.put("/:id", authMiddleware, updateEnquiry);
router.delete("/:id", authMiddleware, deleteEnquiry);
router.get("/", getAllEnquiry);
router.get("/:id", getEnquiry);
module.exports = router;
