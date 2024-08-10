const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

/**
 * Singup
 * @router Post /api/v2/auth/singup
 * @access public
 */
exports.singup = asyncHandler(async (req, res, next) => {
  //1-Create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //2-Generate Token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * login
 * @router Post /api/v2/auth/login
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError(`Incorrect Email or Password`, 401));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc:  make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1-check if token exist , if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("you are not login, please login to access this route", 401)
    );
  }
  //2- verify token (no change happen,expire token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //3-check if user exist
  const Currentuser = await User.findById(decoded.userId);
  if (!Currentuser) {
    return next(
      new ApiError("The user that belong to this token no longer exists", 401)
    );
  }
  //4-check if user cahnge his password after token created
  if (Currentuser.passwordChangeAt) {
    const passwordChangedTimeStamps = parseInt(
      Currentuser.passwordChangeAt.getTime() / 1000,
      10
    );
    //password Created after token created
    if (passwordChangedTimeStamps > decoded.iat) {
      return next(
        new ApiError(
          "user recently change his password, please login again",
          401
        )
      );
    }
  }

  req.user = Currentuser;
  next();
});

// @desc:  Authorization[user Permission]
//["manger","admin"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you are not allow to access this route", 403));
    }
    next();
  });

/**
 * Forgot Password
 * @router Post /api/v2/auth/forgotpassword
 * @access public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1-Check if user exist(req.body.email)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user for this email: ${req.body.email}`, 404));
  }
  //2-if user exist , Generate hash resetCode random 6 digits  and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // console.log(resetCode);
  // console.log(hashResetCode);
  // Save hash password reset code into db
  user.passwordResetCode = hashResetCode;
  //Add expiration time for password reset code(10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  user.passwordResetverified = false;

  // await user.save();

  //3-sent the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Yout password reset code(valide for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetverified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending Email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

/**
 * Verify Password Reset Code
 * @router Post /api/v2/auth/verifyResetCode
 * @access public
 */
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  //1-get user based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  //2-Reset code Vaild
  user.passwordResetverified = true;

  await user.save();
  res.status(200).json({ status: "Reset Code Vaild" });
});

/**
 * Reset Password
 * @router Post /api/v2/auth/resetPassword
 * @access public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1-get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no User For This Email ${req.body.email}`)
    );
  }
  //2-check if reset code verified
  if (!user.passwordResetverified) {
    return next(new ApiError(`Reset Code Not Verified`));
  }

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetverified = undefined;

  await user.save();
  //3-if everything is okay ,generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
