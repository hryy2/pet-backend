const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },// 关联 User 表
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);
