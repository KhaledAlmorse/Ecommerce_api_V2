const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 *  Add Product To Wishlist
 * @router Post /api/v2/wislists
 * @access protect/user
 */

exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  //add product to wishlist if product not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Succsess",
    message: "Product added successfully To Wishlist",
    data: user.wishlist,
  });
});

/**
 *  Remove Product from Wishlist
 * @router Delete /api/v2/wislists/:id
 * @access protect/user
 */
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  //remove product from wishlist if product not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Succsess",
    message: "Product Deleted successfully From Wishlist",
    data: user.wishlist,
  });
});

/**
 *  Get Logged user Wishlist
 * @router Get /api/v2/wislists
 * @access protect/user
 */

exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Succsess",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
