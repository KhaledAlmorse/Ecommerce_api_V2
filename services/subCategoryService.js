const factory = require("./handlersFactory");
const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
/**
 * Create SubCategory
 * @router Post /api/v2/subcategories
 * @access private
 */
exports.createSubCategory = factory.createOne(SubCategory);

//Nested Route
//Get /api/v2/categories/:categoryId/subcategories

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
/**
 * Get All SubCategories
 * @router Get /api/v2/subcategories
 * @access Public
 */
exports.getSubCategories = factory.getAll(SubCategory);

/**
 * Get Specific SubCategory
 * @router Get /api/v2/subcategories/:id
 * @access Public
 */
exports.getSubCategory = factory.getOne(SubCategory);
/**

/**
 * Get Upadte SubCategory
 * @router Put /api/v2/subcategories/:id
 * @access Public
 */

exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * Get Delete SubCategory
 * @router Delete /api/v2/subcategories/:id
 * @access Public
 */

exports.deleteSubCaregory = factory.deleteOne(SubCategory);
