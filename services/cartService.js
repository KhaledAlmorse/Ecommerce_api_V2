const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  //Calculate Total cart Price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;

  return totalPrice;
};

/**
 * Add Product To Cart
 * @router Post /api/v2/carts
 * @access private/user
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  //1- GEt Cart For Logged Uer
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // if product exist in cart , update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() == productId.toString() && item.color == color
    );
    // console.log(productIndex);
    if (productIndex > -1) {
      const cartitem = cart.cartItems[productIndex];
      cartitem.quantity += 1;
      cart.cartItems[productIndex] = cartitem;
    } else {
      //product not exist push product to cart items array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  //Calculate Total cart Price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Product added to cart successfully",
    NumOfCartitem: cart.cartItems.length,
    data: cart,
  });
});

/**
 * Get Logged Uer Cart
 * @router GEt /api/v2/carts
 * @access private/user
 */
exports.getLoggedUserCard = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(
      new ApiError(`There is No Cart For This User Id:${req.user.id}`, 404)
    );
  }

  res.status(200).json({
    status: "Success",
    NumOfCartitem: cart.cartItems.length,
    data: cart,
  });
});

/**
 *  Remove Cart item
 * @router Delete /api/v2/carts:/itemId
 * @access private/user
 */
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: "Success",
    NumOfCartitem: cart.cartItems.length,
    data: cart,
  });
});

/**
 *  Clear Logged user cart
 * @router Delete /api/v2/carts
 * @access private/user
 */
exports.ClearAllCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
