const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLogeedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router
  .route("/checkout-session/:cartId")
  .get(authService.allowedTo("user"), checkoutSession);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manger"),
    filterOrderForLogeedUser,
    findAllOrders
  );
router.route("/:id").get(findSpecificOrder);

router
  .route("/:id/pay")
  .put(authService.allowedTo("admin", "manger"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authService.allowedTo("admin", "manger"), updateOrderToDelivered);

module.exports = router;
