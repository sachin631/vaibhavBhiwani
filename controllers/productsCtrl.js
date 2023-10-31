const productModel = require("../models/products/products");
const apiFeatures = require("../utils/apiFeatures");

//post product //admmin
exports.postProducts = async (req, res) => {
  try {
    const {
      name,
      price,
      ratings,
      category,
      stock,
      numOfReviews,
      review,
      images,
    } = req.body;
    const response = new productModel({
      name: name,
      price: price,
      ratings: ratings,
      category: category,
      stock: stock,
      numOfReviews: numOfReviews,
      review: review,
      images: images,
    });
    const result = await response.save();
    res.status(200).json({
      success: true,
      message: "products store sucessfuly in mongodb",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "internal server error",
    });
  }
};

//getALlProducts //All users ;
exports.getAllproducts = async (req, res) => {
  try {
    console.log(req.query);
  //  const api=new apiFeatures(productModel.find({}),req.query);
    const api=new apiFeatures(productModel.find(),req.query).search();
    // const result = await productModel.find({});
    const result=await api.query
    
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message,
      message: "products not found",
    });
  }
};
//get single products based on particular id
exports.getSingleProducts = async (req, res) => {
  try {
    const _id = req.params;

    const data = await productModel.findOne({ _id: _id });

    res.status(200).json({ products: data, success: true });
  } catch (error) {
    res.status(400).json({ message: "product not found", success: false });
  }
};

//update the products based on id
exports.updateProducts = async (req, res) => {
  try {
    const _id = req.params._id;
    const {
      name,
      price,
      ratings,
      category,
      stock,
      numOfReviews,
      review,
      images,
    } = req.body;
    const result = await productModel.findByIdAndUpdate(
      { _id: _id },
      {
        name: name,
        price: price,
        ratings: ratings,
        category: category,
        stock: stock,
        numOfReviews: numOfReviews,
        review: review,
        images: images,
      },
      { new: true }
    );
    await result.save();
    res.status(200).json({ success: true, message: "updated successfuly" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//delete the products api
exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await productModel.findByIdAndDelete({ _id: _id });

    res.status(200).json({
      message: "product is deleted successfuly",
      success: true,
      result: data,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "product not deleted", success: false, error: error });
  } 
};

//
