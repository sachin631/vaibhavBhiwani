const express=require("express");
const { registerUser, loginUser, userLogout, tryMulter, tokenCtrl, resetPassWord, } = require("../controllers/userCtrl");
const upload=require("../multer/multer");
const userRouter=express.Router();

//register user router 

//post user detalis router 
userRouter.post("/registerUser",registerUser);
//login api 
userRouter.post("/loginUser",loginUser);
//logout api
userRouter.get("/userLogout",userLogout);
//token storing and send Email routing for password reset.
userRouter.post("/tokenReset",tokenCtrl);
//update password behalf on above sending url 
userRouter.put("/passWord-reset/:_id/:token",resetPassWord);
//multer
// userRouter.post("/multer",upload.single("image"),tryMulter);

module.exports=userRouter;