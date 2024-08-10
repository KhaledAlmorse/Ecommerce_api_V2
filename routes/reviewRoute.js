const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductAndUseridIdToBody,
} = require("../services/reviewService");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const authService = require("../services/authService");

//mergeParams => allow as to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductAndUseridIdToBody,
    createReviewValidator,
    createReview
  )
  .get(createFilterObj, getReviews);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    updateReviewValidator,
    authService.allowedTo("user"),
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
