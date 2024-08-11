//core Module
const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlware/errorMiddlware");
const dbConnection = require("./config/database");

//Routers
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/orderService");

//connect with database
dbConnection();

//Express app
const app = express();

//enable other domain to access your application
app.use(cors());
app.options("*", cors());

//compress all response
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// To remove data (applay santization)
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 50 requests
  message:
    "Too many account created from this ip, please try again after an 15 mins ",
});
// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Mount Routes
mountRoutes(app);
app.get("/", (req, res) => {
  res.send("<h1>صلي علي النبي كدا</h1>");
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this router :${req.originalUrl}`, 400));
});

//Global error handling middlware((inside express) (middlware 4 parm))
app.use(globalError);

const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`App Runnig on port ${PORT}`);
});

// global handel rejection error(outside Express)
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors ${err.name} || ${err.message}`);
  server.close(() => {
    console.log(`Shutting down......`);
    process.exit(1);
  });
});
