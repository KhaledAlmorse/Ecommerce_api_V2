const categoryRoute = require("./categoryRoutes");
const subCategoryRoute = require("./subCategoryRoute");
const BrandRoute = require("./brandRoutes");
const ProductRoute = require("./productRoute");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoutes");
const addresstRoute = require("./addressRoutes");
const couponRoute = require("./couponRoutes");
const cartRoute = require("./cartRoutes");
const orderRoute = require("./orderRoutes");

const mountRoutes = (app) => {
  app.use("/api/v2/categories", categoryRoute);
  app.use("/api/v2/subcategories", subCategoryRoute);
  app.use("/api/v2/brands", BrandRoute);
  app.use("/api/v2/products", ProductRoute);
  app.use("/api/v2/users", userRoute);
  app.use("/api/v2/auth", authRoute);
  app.use("/api/v2/reviews", reviewRoute);
  app.use("/api/v2/wishlists", wishlistRoute);
  app.use("/api/v2/addresses", addresstRoute);
  app.use("/api/v2/coupons", couponRoute);
  app.use("/api/v2/carts", cartRoute);
  app.use("/api/v2/orders", orderRoute);
};

module.exports = mountRoutes;
