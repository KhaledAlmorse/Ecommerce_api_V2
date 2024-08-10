const express = require("express");
const {
  addProductToCart,
  getLoggedUserCard,
  removeSpecificCartItem,
  ClearAllCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCard)
  .delete(ClearAllCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
