const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPassswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userVaildator");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/updateMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

router.use(authService.allowedTo("admin"));

router.put("/cahngePassword/:id", changeUserPassswordValidator, changePassword);

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(authService.allowedTo("admin"), getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
