const express = require("express");

const {
  generateImage,
  refineImage,
  generateVariations,
} = require("../controllers/imageController");

const router = express.Router();

router.post("/generate", generateImage);

router.post("/refine", refineImage);

router.post("/variations", generateVariations);

module.exports = router;