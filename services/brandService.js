const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlware/uploadImageMiddlware");

const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);

    //Save Image in our DB
    req.body.image = filename;
  }

  next();
});

/**
 * Create Brand
 * @router Post /api/v2/brands
 * @access private
 */
exports.createBrand = factory.createOne(Brand);
/**
 * get list of brands
 * @router GEt /api/v2/brands
 * @access public
 */
exports.getBrands = factory.getAll(Brand);

/**
 * get Specific Brand
 * @router Get /api/v2/brands/:id
 * @access public
 */
exports.getBrand = factory.getOne(Brand);
/**
 * Update Brand
 * @router Update /api/v2/brands/:id
 * @access private
 */
exports.updateBrand = factory.updateOne(Brand);
/**
 * delete Brand
 * @router Delete /api/v2/brands/:id
 * @access private
 */
exports.deleteBrand = factory.deleteOne(Brand);
