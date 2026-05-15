const { STYLE_PRESETS } = require("../utils/constants");

class PromptEnhancer {
  enhance(prompt = "", style = "realistic") {
    const selectedStyle =
      STYLE_PRESETS[style] || STYLE_PRESETS.realistic;

    return `
${prompt},
${selectedStyle}
`.replace(/\s+/g, " ").trim();
  }
}

module.exports = new PromptEnhancer();