const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlware/validatorMiddleware");
const bcrypt = require("bcryptjs");

const User = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name Required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email alerady used by user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password Confrmation incorrect ");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is Required"),

  check("profileImage").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invaild Phone Number Only Egy _ SA Phone Numbers"),

  validatorMiddleware,
];

exports.getUserValidator = [
  //1-Create Rule
  check("id").isMongoId().withMessage(`Invalid User Id Format`),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage(`Invalid User Id Format`),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email alerady used by user"));
        }
      })
    ),
  check("profileImage").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invaild Phone Number Only Egy _ SA Phone Numbers"),
  validatorMiddleware,
];

exports.changeUserPassswordValidator = [
  check("id").isMongoId().withMessage(`Invalid User Id Format`),

  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password Is required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage(" Password Confirm Is required"),
  body("password")
    .notEmpty()
    .withMessage("You Must To Enter New Password")
    .custom(async (val, { req }) => {
      //1-verify Current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`Ther is no user for this id ${req.params.id}`);
      }

      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("Incorrect Current Password");
      }
      //2-verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("password Confrmation incorrect ");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage(`Invalid User Id Format`),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email alerady used by user"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invaild Phone Number Only Egy _ SA Phone Numbers"),
  validatorMiddleware,
];
