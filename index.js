//core Module
const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlware/errorMiddlware");
const dbConnection = require("./config/database");

//Routers
const mountRoutes = require("./routes");

//connect with database
dbConnection();

//Express app
const app = express();

//enable other domain to access your application
app.use(cors());
app.options("*", cors());

//compress all response
app.use(compression());

//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);
app.get("/", (req, res) => {
  res.send("<h1>صلي علي النبي كدا</br></br> 😎😂 متجيش عشان مفيش الالا </h1>");
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
