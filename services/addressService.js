const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 *  Add Address To user addressess list
 * @router Post /api/v2/addresses
 * @access protect/user
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  //add address To user addressess list
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Succsess",
    message: "addresses added successfully",
    data: user.addresses,
  });
});

/**
 *  Remove Address To user addressess list
 * @router Delete /api/v2/addresses/:addressId
 * @access protect/user
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  //remove address From user addressess list
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Succsess",
    message: "Address Deleted successfully",
    data: user.addresses,
  });
});

/**
 *  Get Logged user Addresses
 * @router Get /api/v2/addresses
 * @access protect/user
 */

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "Succsess",
    results: user.addresses.length,
    data: user.addresses,
  });
});
