const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "pleaser Enter name"],
  },
  price: {
    type: Number,
    required: [true, "please enter price of the products"],
    max: [100000, "length of the price not should be more then 5 charchter"],
  },
  ratings: {
    type: Number,
    default: 0,
  },

  images: [
    {
      public_id: {
        type: String,
        required: [true, "please enter cloudnary id of the images"],
      },
      url: {
        type: String,
        required: [true, "please enter  the url of the images"],
      },
    },
  ],

  category: {
    type: String,
    required: [true, "please enter category of the products"],
  },
  stock: {
    type: Number,
    required: [true, "please enter number of stock of the products"],
    maxLength: 5,
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  review: [
    {
      name: {
        type: String,
        required: [true, "please enter name of person who gave ratings"],
      },
      rating: {
        type: Number,
        required: [true, "please gave rating"],
      },
      message: {
        type: String,
        required: [true, "please enetr the message"],
      },
    },
  ],
  // user:{
  //   type:mongoose.Schema.ObjectId,
  //   ref:"User",
  //   required:[true,"enter user id"]
  // },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

const ProductModel = new mongoose.model("products", schema);
module.exports = ProductModel ;



