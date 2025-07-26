const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // slug: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   lowerCase: true,
  // },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
     required:true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required:true
  },
  sold:{
    type:Number,
    default:0,
  },
  discount: {
    type: Number,
    required:true,
  },
  images: [{
    public_id: String,
    url: String,
  },],
  // color: [{ type: mongoose.Schema.Types.ObjectId ,ref:"Color"}],
  color: [],
  tags:[],
  size:[],
  
  ratings: [{
    star: Number,
    comment:String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }],
  totalRatings:{
    // type:String,
    type:Number,
    default:0,
  }
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);