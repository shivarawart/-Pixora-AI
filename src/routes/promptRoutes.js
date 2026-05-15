const express = require("express");

const {
  enhancePrompt,
  generateStructuredPrompt,
  generateStructuredPromptDiff,
} = require("../controllers/promptController");

const router = express.Router();

router.post("/enhance", enhancePrompt);

router.post("/structured", generateStructuredPrompt);

router.post("/structured/diff", generateStructuredPromptDiff);

module.exports = router;