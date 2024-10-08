const mongoose = require("mongoose");

const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
      required: [true, "Review Ratings Required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong To User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must Belong To Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    //Stage 1-get all reviews in specific product
    {
      $match: { product: productId },
    },
    //Stage 2-groping reviews based on productId and calc(avgRatings, ratingsQuantity)
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: result[0].avgRatings,
        ratingsQuantity: result[0].ratingsQuantity,
      },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { new: true }
    );
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post(
  "findOneAndDelete",
  { document: false, query: true },
  async function ({ product }) {
    await this.model.calcAverageRatingsAndQuantity(product);
  }
);

module.exports = mongoose.model("Review", reviewSchema);
