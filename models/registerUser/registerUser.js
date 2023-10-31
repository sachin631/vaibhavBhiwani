const mongoose = require("mongoose");

const registerUserSchema=new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter you name"],
  },
  email: {
    type: String,
    required: [true, " please enter email "],
  },
  phoneNumber:{
    type:String,
    required:[true,"please enter your phone Number"]
  },
  passWord: {
    type: String,
    required: [true, "please Enter passWord"],
  },
  rePassWord:{
    type:String,
    required:[true,"please enter rePassword"]
  },
  createdAt:{
    type:Date,
    defualt:Date.now
  }
});
const userModel=new mongoose.model("registerUserSchema",registerUserSchema); 
module.exports=userModel;
