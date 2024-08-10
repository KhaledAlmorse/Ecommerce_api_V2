const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlware/uploadImageMiddlware");

const Category = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    //Save Image in our DB
    req.body.image = filename;
  }

  next();
});

/**
 * Create Category
 * @router Post /api/v2/categories
 * @access private
 */
exports.createCategory = factory.createOne(Category);

/**
 * get list of Categories
 * @router GEt /api/v2/categories
 * @access public
 */
exports.getCategories = factory.getAll(Category);

/**
 * get Specific Category
 * @router Get /api/v2/categories/:id
 * @access public
 */
exports.getCategory = factory.getOne(Category);

/**
 * Update Category
 * @router Update /api/v2/categories/:id
 * @access private
 */

exports.updateCategory = factory.updateOne(Category);

/**
 * delete Category
 * @router Delete /api/v2/categories/:id
 * @access private
 */
exports.deleteCategory = factory.deleteOne(Category);
