const userModel = require("../models/registerUser/registerUser");
const bcryptjs = require("bcryptjs");

exports.registerUser = async (req, res) => {
    try{
        let { name, email, passWord, rePassWord, phoneNumber } = req.body;
  
        if (!name || !email || !passWord || !rePassWord || !phoneNumber) {
          return res.status(400).json({ message: "please fill all field" });
        } else {
          if (passWord == rePassWord) {
            const hashedPassWord = await bcryptjs.hash(passWord, 10);
            const hashedRepassWord = await bcryptjs.hash(rePassWord, 10);
            passWord = hashedPassWord;
            rePassWord = hashedRepassWord;
      
            const user = await userModel({
              name: name,
              email: email,
              passWord: passWord,
              rePassWord: rePassWord,
              phoneNumber: phoneNumber,
            });
            await user.save();
            return res.status(200).json({
              success: true,
              message: "user register successfuly",
              user: user,
            });
          } else {
            return res
              .status(400)
              .json({ message: "passWord and RepassWord are not matched" });
          }
        }
    }catch(error){
        res.status(200).json({success:false,error:error.message})
    }
  
};
