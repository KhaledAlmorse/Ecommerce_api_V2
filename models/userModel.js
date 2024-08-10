const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetverified: Boolean,

    // passwordConfirm: {
    //   type: String,
    //   required: [true, "Password Confirm is required"],
    // },
    phone: String,
    profileImage: String,

    role: {
      type: String,
      enum: ["admin", "manger", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    //child reference
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  //Hashing user bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
