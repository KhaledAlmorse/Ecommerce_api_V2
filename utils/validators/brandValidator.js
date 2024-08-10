const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");

exports.getBrandValidator = [
  //1-Create Rule
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too Long Brand Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  validatorMiddleware,
];
