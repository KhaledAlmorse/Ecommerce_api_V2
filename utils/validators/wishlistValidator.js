const { check } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");

const Product = require("../../models/productModel");

exports.addProductToWishListValidator = [
  check("productId")
    .isArray()
    .withMessage("You must put Product id into array")
    .custom(async (val, { req }) => {
      for (const product of val) {
        const result = await Product.findOne({ _id: product });
        if (!result) {
          throw new Error(`There is no Product for this id ${product}`);
        }
      }
      return true;
    }),
  validatorMiddleware,
];
