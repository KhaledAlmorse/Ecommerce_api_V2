const express = require("express");
const {
  singup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/authService");

const {
  singupValidator,
  loginValidator,
} = require("../utils/validators/authVaildator");

const router = express.Router();

router.post("/singup", singupValidator, singup);
router.post("/login", loginValidator, login);
router.post("/forgotpassword", forgetPassword);
router.post("/verifyResetCode", verifyPasswordResetCode);
router.put("/resetPassword", resetPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
