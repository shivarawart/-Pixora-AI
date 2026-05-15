const briaService = require("../services/briaService");
const promptEnhancer = require("../services/promptEnhancer");
const { successResponse } = require("../utils/apiResponse");

exports.enhancePrompt = async (req, res, next) => {
  try {
    const { prompt, style } = req.body;

    const enhancedPrompt = promptEnhancer.enhance(prompt, style);

    return successResponse(res, {
      message: "Prompt enhanced successfully",
      data: {
        originalPrompt: prompt,
        enhancedPrompt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.generateStructuredPrompt = async (req, res, next) => {
  try {
    const result = await briaService.generateStructuredPrompt(req.body);

    return successResponse(res, {
      message: "Structured prompt generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateStructuredPromptDiff = async (req, res, next) => {
  try {
    const result = await briaService.generateStructuredPromptDiff(
      req.body
    );

    return successResponse(res, {
      message: "Structured prompt diff generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};