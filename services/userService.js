const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlware/uploadImageMiddlware");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    //Save Image in our DB
    req.body.profileImage = filename;
  }

  next();
});

/**
 * Create User
 * @router Post /api/v2/users
 * @access private
 */
exports.createUser = factory.createOne(User);
/**
 * get list of Users
 * @router GEt /api/v2/users
 * @access private
 */
exports.getUsers = factory.getAll(User);

/**
 * get Specific User
 * @router Get /api/v2/users/:id
 * @access private
 */
exports.getUser = factory.getOne(User);
/**
 * Update User
 * @router Update /api/v2/users/:id
 * @access private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document For This Id: ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document For This Id: ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});
/**
 * delete User
 * @router Delete /api/v2/users/:id
 * @access private
 */
exports.deleteUser = factory.deleteOne(User);

/**
 * Get Logged User Data
 * @router GEt /api/v2/users/getMe
 * @access private/protect
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * Update Logged User Data(Password)
 * @router Put /api/v2/users/updateMyPassword
 * @access private/protect
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //Update User Password based on(req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //Generate Tokent
  const token = createToken(req.user._id);
  res.status(200).json({ data: user, token });
});

/**
 * Update Logged User Data(withoutPassword,role)
 * @router Put /api/v2/users/updateMe
 * @access private/protect
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      active: req.body.active,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

/**
 * Deactivate Logged User
 * @router Delete /api/v2/users/deletMe
 * @access private/protect
 */

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Deactivate Success" });
});
