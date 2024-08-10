const slugify = require("slugify");

const { check } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage(`Invalid Coupon Id Format`),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name Required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateCouponValidator = [
  check("id").isMongoId().withMessage(`Invalid Coupon Id Format`),
  validatorMiddleware,
];
exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage(`Invalid Coupon Id Format`),
  validatorMiddleware,
];
