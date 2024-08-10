const express = require("express");
const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../services/wishlistService");

const {
  addProductToWishListValidator,
} = require("../utils/validators/wishlistValidator");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);
router.use(authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToWishListValidator, addProductToWishList)
  .get(getLoggedUserWishList);
router.delete("/:productId", removeProductFromWishList);
module.exports = router;
