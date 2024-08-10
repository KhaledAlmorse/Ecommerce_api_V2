const mongoose = require("mongoose");

//1-create schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name Required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too Short Brand Name"],
      maxlength: [32, "Too Long Brand Name"],
    },
    // A and B ==> a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASED_URL}/Brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
//findOne, findAll, Update
BrandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
//Create
BrandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

//2-craete model
module.exports = mongoose.model("Brand", BrandSchema);
