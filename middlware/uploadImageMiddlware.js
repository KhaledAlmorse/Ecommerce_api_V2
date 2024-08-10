const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //for Storage(DiskStorage engine)
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     //category-{id}-Date.now().jpg
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `Category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  //memory storage engine(Buffer)
  const multerStorage = multer.memoryStorage();

  //for Filtertion
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
