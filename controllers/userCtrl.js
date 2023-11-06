const userModel = require("../models/registerUser/registerUser");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const multer = require("multer");

exports.registerUser = async (req, res) => {
  try {
    let { name, email, passWord, rePassWord, phoneNumber,avatar } = req.body;

    if (!name || !email || !passWord || !rePassWord || !phoneNumber||!avatar) {
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
          avatar:avatar
        });console.log(user);
        await user.save();
        const token=user.getJwtToken();  
        return res.status(200).json({   
          success: true,
          message: "user register successfuly",
          user: user,
          token:token
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
        const token=loginUser.getJwtToken();
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
