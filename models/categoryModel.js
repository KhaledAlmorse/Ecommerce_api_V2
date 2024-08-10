const mongoose = require("mongoose");

//1-create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name Required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too Short Category Name"],
      maxlength: [32, "Too Long Category Name"],
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
    const imageUrl = `${process.env.BASED_URL}/Categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//findOne, findAll, Update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
//Create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

//2-craete model
module.exports = mongoose.model("Category", categorySchema);
