const { generateToken } = require("../config/jwtToken");
const mongoose = require('mongoose');
const crypto = require("crypto");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
// const Coupan = require("../models/coupanModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ path: "./.env" });
const asyncHandler = require("express-async-handler");
const uniqid = require("uniqid");
const validateMongoDbId = require("../utils/validateMongoDbId");
const sendEmail = require("./emailCtrl");
validateMongoDbId;
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 检查用户是否已存在
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  try {
    // 创建新用户，并直接标记为已验证
    const newUser = await User.create({
      ...req.body,
      isVerified: true,
    });

    res.json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});


// const verifyAccount = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;
//   // Find the user by email
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error("User not found");
//   }
//   // Verify OTP
//   if (otp !== user.passwordResetToken) {
//     throw new Error("Invalid OTP");
//   }

//   // Create the account if OTP is correct
//   user.isVerified = true;
//   await user.save();

//   res.json({ message: "Account verified successfully." });
// });


//user login
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 只有 isVerified 的普通用户可以登录
  // if (findUser.role !== "user" || !findUser.isVerified) {
  //   return res.status(403).json({ error: "Not authorized" });
  // }

  const isPasswordCorrect = await findUser.isPasswordMatched(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 登录成功
  res.json({
    _id: findUser._id,
    firstName: findUser.firstName,
    lastName: findUser.lastName,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id),
  });
});

//get all user
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (err) {
    throw new Error(err);
  }
});
const getaUserDetail = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userDetail = await User.findById(_id);
    res.json(userDetail);
  } catch (err) {
    throw new Error(err);
  }
});
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await User.findById(id);
    res.json(getUser);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (err) {
    throw new Error(err);
  }
});

const updateaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked",
    });
  } catch (err) {
    throw new err();
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unBlock = User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: false,
      }
    );
    res.json({
      message: "User Unblocked",
    });
  } catch (err) {
    throw new err();
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user._id;
  const { currentPassword, newPassword } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  const isCurrentPasswordValid = await user.isPasswordMatched(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(401).json({ message: "Incorrect current password" });
  }
  user.password = newPassword;
  const updatedPassword = await user.save();
  res.json({ message: "Your password has been changed successfully" });
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("user not found with this email");
  }
  try {
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000);  
    };
    const otp = generateOTP();
    user.passwordResetToken = otp;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetURL =
    `
    <img  src="https://res.cloudinary.com/dytlgwywf/image/upload/v1712242872/fzwn8ubzt8ydxvnfj2cj.jpg" width="400" alt="secure" />
    <div style="font-size:22px" > 
    <b>Hey,</b>
    <b> Here's your OTP to log into your Lovepet account.${otp}</b>
    </div>
    `
    const data = {
      to: email,
      text: "Hey User",
      subject: "Your OTP for Forgot Password",
      htm: resetURL,
    };
    sendEmail(data);
    res.json({"message":"sent"});
  } catch (error) {
    throw new Error(error);
  }
});
// const verifyOTP = asyncHandler(async (req, res) => {
//   const { email, enteredOTP } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error("User not found with this email");
//   }
//   try {
//     if (enteredOTP !== user.passwordResetToken) {
//       throw new Error("Invalid OTP");
//     }
//     res.json({ message: "OTP verified. You can now reset your password." });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }
  if (otp !== user.passwordResetToken) {
    throw new Error("Invalid OTP");
  }
  if (user.passwordResetExpires < Date.now()) {
    throw new Error("OTP has expired");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful." });
});


const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (err) {
    throw new Error(err);
  }
});

//save user address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const address = req.body
  validateMongoDbId(_id);
  const newAddress = {
    _id: new mongoose.Types.ObjectId(),
    ...address
  };
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      { $push: { address: { $each: [newAddress], $position: 0 } } },
      { new: true }
    );
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});


const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    let addressIndex = -1;
    user.address.forEach((address, index) => {
      if (address._id.toString() === id) {
        addressIndex = index;
      }
    });
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }
    user.address.splice(addressIndex, 1);
    await user.save();
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, color, size, quantity, price } = req.body;
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId }).populate('products.productId').exec();
    if (!cart) {
      cart = await Cart.create({ userId, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(product =>
      product.productId._id.equals(productId) && product.color === color && product.size === size
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
      cart.products[existingProductIndex].price = price; // Update price if necessary
    } else {
      cart.products.unshift({ productId, color, size, quantity, price });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;  // 获取请求中的用户ID
  validateMongoDbId(_id);  // 验证ID的有效性

  try {
    // 输出用户ID，确保它是正确的
    console.log("User ID for cart lookup:", _id);

    // 查找与用户ID匹配的购物车
    const cart = await Cart.findOne({ userId: _id })
      .populate("products.productId") // 填充产品信息
      .populate("products.color"); // 填充颜色信息

    // 输出找到的购物车数据，确保它包含产品
    console.log("Cart found:", cart);

    // 如果没有找到购物车
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 如果购物车中没有产品
    if (!cart.products || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // 计算购物车总价格
    let totalPrice = 0;
    cart.products.forEach(product => {
      let discountedPrice = product.productId.price * (1 - product.productId.discount / 100);
      totalPrice += discountedPrice * product.quantity;
    });

    // 按日期排序产品
    cart.products.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 计算总价格并返回
    const cartWithTotalPrice = {
      ...cart.toObject(),
      totalPrice: Math.floor(totalPrice),
    };

    res.json(cartWithTotalPrice);
  } catch (err) {
    console.error("Error fetching user cart:", err); // 记录错误
    throw new Error(err);
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const index = cart.products.findIndex(product =>
      product.equals(id)
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    cart.products.splice(index, 1);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { COD, totalPriceAfterDiscount, address } = req.body;
  if (!COD) {
    throw new Error("Create Cash order failed");
  }
  try {
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ userId: user._id }).populate(
      "products.productId"
    ).populate("products.color");
    let newOrder = await new Order({
      products: userCart.products.map(product => ({
        product: product.productId._id,
        count: product.quantity,
        color: product.color,
        size: product.size,
        address: address
      })),
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: totalPriceAfterDiscount,
        status: "Cash On Delivery",
        createdAt: Date.now(),
        currency: "inr",
      },
      orderBy: user._id,
      orderStatus: "Cash On Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.productId._id },
          update: { $inc: { quantity: item.count, sold: +item.count } },
        },
      };
    });
    res.json({ message: "success" });
  } catch (err) {
    throw new Error(err);
  }
});

const getOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userOrder = await Order.find({ orderBy: _id })
      .populate("products.product")
      .populate("orderBy")
      .sort({ createdAt: -1 });
    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
      },
      { new: true }
    );
    res.json(updateOrder);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const userOrder = await Order.find()
      .populate("products.product")
      .populate("orderBy");
    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userOrder = await Order.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});
const getOrderByOrderId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userOrder = await Order.findOne({ _id: id }).populate(
      "products.product"
    );
    res.json(userOrder);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
  saveAddress,
  deleteAddress,
  addToCart,
  getUserCart,
  removeFromCart,
  createOrder,
  getOrder,
  updateOrderStatus,
  getAllOrder,
  getOrderByUserId,
  getaUserDetail,
  getOrderByOrderId,
  // verifyOTP,
  // verifyAccount
};
