const briaService = require("../services/briaService");
const { successResponse } = require("../utils/apiResponse");

exports.generateImage = async (req, res, next) => {
  try {
    const result = await briaService.generateImage(req.body);

    return successResponse(res, {
      message: "Image generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.refineImage = async (req, res, next) => {
  try {
    const result = await briaService.refineImage(req.body);

    return successResponse(res, {
      message: "Image refined successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateVariations = async (req, res, next) => {
  try {
    const result = await briaService.generateVariations(req.body);

    return successResponse(res, {
      message: "Variations generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};