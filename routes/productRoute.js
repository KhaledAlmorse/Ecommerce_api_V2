const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImage,
} = require("../services/productService");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValiditor");

const authService = require("../services/authService");
const ReviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", ReviewRoute);

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
