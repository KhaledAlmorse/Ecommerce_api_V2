const factory = require("./handlersFactory");

const Review = require("../models/reviewModel");

//Nested Route
//Get /api/v2/products/:productId/reviews

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.setProductAndUseridIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};
/**
 * Create Review
 * @router Post /api/v2/reviews
 * @access private/Protect
 */
exports.createReview = factory.createOne(Review);
/**
 * get list of Reviews
 * @router GEt /api/v2/reviews
 * @access public
 */
exports.getReviews = factory.getAll(Review);

/**
 * get Specific Review
 * @router Get /api/v2/reviews/:id
 * @access public
 */
exports.getReview = factory.getOne(Review);
/**
 * Update Review
 * @router Update /api/v2/reviews/:id
 * @access private/Protect
 */
exports.updateReview = factory.updateOne(Review);
/**
 * delete Review
 * @router Delete /api/v2/reviews/:id
 * @access private/Protect
 */
exports.deleteReview = factory.deleteOne(Review);
