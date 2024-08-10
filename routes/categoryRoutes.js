const express = require("express");
const {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const {
  getCategtoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const SubCategoriesRoute = require("../routes/subCategoryRoute");
const authService = require("../services/authService");

const router = express.Router();

//Nested Route
router.use("/:categoryId/subcategories", SubCategoriesRoute);

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategtoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
