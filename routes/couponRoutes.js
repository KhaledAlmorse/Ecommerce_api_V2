const express = require("express");
const {
  createCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");

const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");

const authService = require("../services/authService");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("admin", "manger"));

router.route("/").post(createCouponValidator, createCoupon).get(getCoupons);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
