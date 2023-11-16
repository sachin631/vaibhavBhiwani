const userModel = require("../models/registerUser/registerUser");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const multer = require("multer");
const tokenModel = require("../models/token/tokenModel");
const crypto = require("crypto");
const { sendMail } = require("../middleware/nodemailer");

exports.registerUser = async (req, res) => {
  try {
    let { name, email, passWord, rePassWord, phoneNumber, avatar } = req.body;

    if (
      !name ||
      !email ||
      !passWord ||
      !rePassWord ||
      !phoneNumber ||
      !avatar
    ) {
      return res.status(400).json({ message: "please fill all field" });
    } else {
      if (passWord == rePassWord) {
        // const hashedPassWord = await bcryptjs.hash(passWord, 10);
        // const hashedRepassWord = await bcryptjs.hash(rePassWord, 10);
        // passWord = hashedPassWord;
        // rePassWord = hashedRepassWord;

        const user = await userModel({
          name: name,
          email: email,
          passWord: passWord,
          rePassWord: rePassWord,
          phoneNumber: phoneNumber,
          avatar: avatar,
        });
        console.log(user);
        await user.save();
        const token = user.getJwtToken();
        return res.status(200).json({
          success: true,
          message: "user register successfuly",
          user: user,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "passWord and RepassWord are not matched" });
      }
    }
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
};

//login  user details
exports.loginUser = async (req, res) => {
  const { email, passWord } = req.body;
  if (!email || !passWord) {
    return res.status(200).json({ message: "please enter email and passWord" });
  } else {
    const loginUser = await userModel.findOne({ email: email });

    if (loginUser) {
      const comaprePassWord = await bcryptjs.compare(
        passWord,
        loginUser.passWord
      );

      if (comaprePassWord) {
        // const token = jsonwebtoken.sign(
        //   { _id: loginUser._id },
        //   process.env.SECRETKEY
        // );
        const token = loginUser.getJwtToken();
        res.cookie("vaibhavBhiwaniCookie", token, {
          expiresIn: "2d",
          httpOnly: false,
        });

        return res.status(200).json({
          success: true,
          message: "login successfully",
          loginUser: loginUser,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "check your email or passWord " });
      }
    } else {
      return res.status(400).json({ message: "user not registered" });
    }
  }
};

// user logout api
exports.userLogout = async (req, res) => {
  try {
    res.cookie("vaibhavBhiwaniCookie", null, {
      expiresIn: new Date(Date.now()),
      httpOnly: false,
    });
    return res
      .status(400)
      .json({ message: "logout successfuly ", success: true });
  } catch (err) {
    return res.status(400).json({ message: "try again", success: false });
  }
};

//token store and send on email  api
exports.tokenCtrl = async (req, res) => {
  try {
    //find user based on email when user click on reset password then go to enter you email page to send otp
    const { email } = req.body;
    const findUser = await userModel.findOne({ email: email });
    if (findUser) {
      findIfAlreadyToken = await tokenModel.findOne({ userId: findUser._id });

      if (!findIfAlreadyToken) {
        const newtoken = await new tokenModel({
          userId: findUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        await newtoken.save();
        let link = `http://localhost:8080/passWord-reset/${findUser._id}/${newtoken.token}`;
        console.log(link);
        // let link={`${req.host}/s`}
        await sendMail(email, "reset your PassWord valid for 1 hours", link);
        return res.status(200).json({
          success: true,
          message: "token generated successfuly and active for 3600 second",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "token is already active for 1 hour please check you email",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "email is not valid please enter vaild email id ",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error, success: false });
  }
};

//reset passWord when click on above url send on email //type is http://localhost:8080/passWord-reset/id/token
exports.resetPassWord = async (req, res) => {
  try {
    let { _id } = req.params;
    let user = await userModel.findOne({ _id: _id });
    if (user) {
      let token = await tokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (token) {
        user.passWord = req.body.passWord;
        user.rePassWord = req.body.rePassWord;
        await user.save();
        console.log(token);
        await token.deleteOne({ _id: token._id });

        return res.status(200).json({ message: "token is store successfully" });
      } else {
        return res.status(401).json({
          success: false,
          message: "token not found or expired, try again to reset",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: " token expires or user not found on this token",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//getParticular user details after login so user can access his details for checking and updation of profile
exports.particularUserDetails = async (req, res) => {
  try {
    const findDetailsOfLoginUser = await userModel.findOne({ _id: req.user });
    console.log(req.user);
    res
      .status(200)
      .json({ success: true, findDetailsOfLoginUser: findDetailsOfLoginUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

//update the passWord of login user
exports.updateUserPassWord = async (req, res) => {
  try {
    const { passWord, rePassWord } = req.body;
    if (!passWord && !rePassWord) {
      return res
        .status(401)
        .json({
          message: "Please enter the passWord and rePassWord value",
          success: false,
        });
    }

    const user = await userModel.findOne({ _id: req.user });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the password fields
    user.passWord = passWord;
    user.rePassWord = rePassWord;
    // Mark rePassWord as modified
    user.markModified("rePassWord");

    // Save the user
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "passWord Updated Successfully",
        user: user,
      });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//update profile of login user like name and emails
exports.profileUpdate = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res
        .status(401)
        .json({
          message: "please enter name and emails fields",
          success: false,
        });
    }
    let updatedUser = await userModel.findByIdAndUpdate(
      req.user,
      { name: name, email: email },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "user updated successfully",
        updatedUser: updatedUser,
      });
  } catch (error) {
    res
      .status(200)
      .json({ message: "something went wrong try again", success: false });
  }
};

// get all user details for admin
exports.getUserDataForAdmin = async (req, res) => {
  try {
    const user = await userModel.find({});
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    res
      .status(200)
      .json({ message: "something went wrong try again", success: false });
  }
};
//get particular user detials for --admin
exports.particularUserDetialsForAdmin = async (req, res) => {
  try {
    const user = await userModel.findById(req.params);
    if (user) {
      return res.status(200).json({ success: true, user: user });
    } else {
      return res
        .status(401)
        .json({ message: "user not found", success: false });
    }
  } catch (error) {
    res
      .status(200)
      .json({ message: "something went wrong try again", success: false });
  }
};
//update admin role of the user --admin
exports.updateIsAdminRole = async (req, res) => {
  try {
    const isAdmin = req.body.isAdmin;
    console.log(req.params);
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params,
      { isAdmin: isAdmin },
      { new: true }
    );
    console.log(updatedUser);
    return res
      .status(200)
      .json({
        success: true,
        updatedUser: updatedUser,
        message: "role updated successFuly",
        new: true,
      });
  } catch (error) {
    res
      .status(200)
      .json({
        message: "something went wrong try again",
        success: false,
        error: error.message,
      });
  }
};
//delete particular user by admin --admin
exports.deleteParticularUser = async (req, res) => {
  try {
    let user=await userModel.findById(req.params);
    if(!user){
      return res.status(401).json({success:true,message:"user not found "});

    }
   let deletedUser= await user.deleteOne({_id:user._id});
    
    res
      .status(200)
      .json({
        message: "user deleted Successfully ",
        success: true,
        deletedUser: deletedUser,
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: "something went wrong", success: false, error: error });
  }
};

//try multer to uppload images
exports.tryMulter = async (req, res) => {
  try {
    console.log("sachin");
    console.log(req.body);
    console.log(req.file);
  } catch (err) {
    console.log(err);
  }
};

//2:30
