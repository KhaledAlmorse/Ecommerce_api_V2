const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

/**
 * Create Cash Order
 * @router Post /api/v2/orders/cartId
 * @access private/user
 */

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1-get card depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(
        `There is no cartitems for this id:${req.params.cartId}`,
        404
      )
    );
  }
  //2-get order price depend on cart price("check if coupon apply")
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3-create order with default paymentMethod cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  //4-after creating order,decrement product quantity,increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});

    //5-clear card depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "Success", data: order });
});

/**
 * Get All Order
 * @router Get /api/v2/orders
 * @access private/Admin
 */
exports.filterOrderForLogeedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObj = { user: req.user._id };
  next();
});

exports.findAllOrders = factory.getAll(Order);

/**
 * Get Specific Order
 * @router Get /api/v2/orders/orderId
 * @access private/Admin
 */
exports.findSpecificOrder = factory.getOne(Order);

/**
 * Update order Paid to true
 * @router Put /api/v2/orders/:id/pay
 * @access private/Admin
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`Ther is no order for this id:${req.params.id}`, 404)
    );
  }

  //Updated
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({ status: "Success", data: updatedOrder });
});

/**
 * Update order delivered to true
 * @router Put /api/v2/orders/:id/deliver
 * @access private/Admin
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`Ther is no order for this id:${req.params.id}`, 404)
    );
  }

  //Updated
  order.isDelivered = true;
  order.deliverAt = Date.now();

  const updatedOrder = await order.save();

  res.status(201).json({ status: "Success", data: updatedOrder });
});

/**
 * Get checkout out session from stripe and sent it as a response
 * @router Get /api/v2/orders/checkout-session/cartId
 * @access private/user
 */
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1-get card depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(
        `There is no cartitems for this id:${req.params.cartId}`,
        404
      )
    );
  }
  //2-get order price depend on cart price("check if coupon apply")
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    //  Create order
    console.log("created order here.....");
    // createCardOrder(event.data.object);
  }

  // res.status(200).json({ received: true });
});
