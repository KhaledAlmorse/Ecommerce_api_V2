const slugify = require("slugify");

const { check } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");

exports.getSubCategtoryValidator = [
  //1-Create Rule
  check("id").isMongoId().withMessage(`Invalid SubCategory Id Format`),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name Required")
    .isLength({ min: 2 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Long SubCategory Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage(`Invalid SubCategory Id Format`),
  check("name")
    .notEmpty()
    .withMessage("SubCategory name Required")
    .isLength({ min: 3 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Long SubCategory Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  // check("category").isMongoId().withMessage(`Invalid SubCategory Id Format`),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage(`Invalid SubCategory Id Format`),
  validatorMiddleware,
];
