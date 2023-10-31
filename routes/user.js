const express=require("express");
const { registerUser } = require("../controllers/userCtrl");
const userRouter=express.Router();

//register user router 

//post user detials router 
userRouter.post("/registerUser",registerUser);
//

module.exports=userRouter;