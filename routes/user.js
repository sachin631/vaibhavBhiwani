const express=require("express");
const { registerUser, loginUser, userLogout, tryMulter, } = require("../controllers/userCtrl");
const upload=require("../multer/multer");
const userRouter=express.Router();

//register user router 

//post user detalis router 
userRouter.post("/registerUser",registerUser);
//login api 
userRouter.post("/loginUser",loginUser);
//logout api
userRouter.get("/userLogout",userLogout);
//multer
// userRouter.post("/multer",upload.single("image"),tryMulter);

module.exports=userRouter;