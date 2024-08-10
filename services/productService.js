const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const { uploadMixOfImages } = require("../middlware/uploadImageMiddlware");

const factory = require("./handlersFactory");
const Product = require("../models/productModel");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  //1- image Processing For Image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `Product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    //Save Image in our DB
    req.body.imageCover = imageCoverFileName;
  }
  //2- image Processing For Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `Product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1400)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        //Save Image in our DB
        req.body.images.push(imageName);
      })
    );
    next();
  }
});
/**
 * Create product
 * @router Post /api/v2/products
 * @access private
 */
exports.createProduct = factory.createOne(Product);

/**
 * get list of product
 * @router GEt /api/v2/products
 * @access public
 */
exports.getProducts = factory.getAll(Product, "Products");

/**
 * get Specific product
 * @router Get /api/v2/products/:id
 * @access public
 */
exports.getProduct = factory.getOne(Product, "reviews");

/**
 * Update Product
 * @router Update /api/v2/products/:id
 * @access private
 */
exports.updateProduct = factory.updateOne(Product);
/**
 * delete Category
 * @router Delete /api/v2/categories/:id
 * @access private
 */
exports.deleteProduct = factory.deleteOne(Product);
