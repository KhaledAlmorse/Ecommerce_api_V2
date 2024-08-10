const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCaregory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategtoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authService = require("../services/authService");

// const router = express.Router({ mergeParams: true });
//mergeParams => allow as to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategtoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCaregory
  );
module.exports = router;
