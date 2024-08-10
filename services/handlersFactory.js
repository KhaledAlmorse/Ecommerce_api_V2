const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No document For This Id: ${req.params.id}`),
        404
      );
    }
    res.status(200).json({ msg: "Delete Succesfully" });
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document For This Id: ${req.params.id}`),
        404
      );
    }
    //trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //Build
    const doucumentCounts = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(doucumentCounts)
      .limitFields()
      .sort()
      .filter()
      .search(modelName);

    const { mongooseQuery, pagenationResult } = apiFeatures;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ results: document.length, pagenationResult, data: document });
  });
