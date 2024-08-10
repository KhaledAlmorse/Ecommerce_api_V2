const factory = require("./handlersFactory");

const Coupon = require("../models/couponModel");

/**
 * Create Coupon
 * @router Post /api/v2/coupons
 * @access private/admin/manger
 */
exports.createCoupon = factory.createOne(Coupon);
/**
 * get list of Coupons
 * @router GEt /api/v2/coupons
 * @access private/admin/manger
 */
exports.getCoupons = factory.getAll(Coupon);

/**
 * get Specific Coupon
 * @router Get /api/v2/coupons/:id
 * @access private/admin/manger
 */
exports.getCoupon = factory.getOne(Coupon);
/**
 * Update Coupon
 * @router Update /api/v2/coupons/:id
 * @access private/admin/manger
 */
exports.updateCoupon = factory.updateOne(Coupon);
/**
 * delete Coupon
 * @router Delete /api/v2/coupons/:id
 * @access private/admin/manger
 */
exports.deleteCoupon = factory.deleteOne(Coupon);
