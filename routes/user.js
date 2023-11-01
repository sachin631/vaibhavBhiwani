const express=require("express");
const { registerUser, loginUser, userLogout } = require("../controllers/userCtrl");
const userRouter=express.Router();

//register user router 

//post user detalis router 
userRouter.post("/registerUser",registerUser);
//login api 
userRouter.post("/loginUser",loginUser);
//logout api
userRouter.get("/userLogout",userLogout);

module.exports=userRouter;