const express=require("express");
const { postProducts,getAllproducts,updateProducts,deleteProduct,getSingleProducts } = require("../controllers/productsCtrl");
const router=express.Router();

//store the product --admin
router.post("/postProduct",postProducts);
//getAllProducts --Alluser
router.get("/getAllproducts",getAllproducts);
//get single products by id 
router.get("/getSingleProducts/:_id",getSingleProducts);
//update the product
router.put("/updateProducts/:_id",updateProducts);
//delete the products api --admin
router.delete("/deleteProduct/:_id",deleteProduct);




module.exports=router;