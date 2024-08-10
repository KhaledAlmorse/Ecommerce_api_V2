const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");

const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  //1-Create Rule
  check("id").isMongoId().withMessage(`Invalid Review Id Format`),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating value Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value Must be betwwen 1 to 5"),
  check("user").isMongoId().withMessage(`Invalid Review Id Format`),
  check("product")
    .isMongoId()
    .withMessage(`Invalid Review Id Format`)
    .custom((val, { req }) =>
      Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("you already created a review before ")
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage(`Invalid Review Id Format`)
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`no Review for this id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allow to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      // Check review ownership before delete
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
