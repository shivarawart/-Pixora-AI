exports.BRIA_BASE_URL =
  "https://engine.prod.bria-api.com/v2/image/generate/lite";

/*
|--------------------------------------------------------------------------
| DEFAULT CONFIG (PRODUCTION SAFE)
|--------------------------------------------------------------------------
*/

exports.DEFAULT_CONFIG = {
  aspectRatio: "1:1",
  outputFormat: "png",
  imageCount: 1,
  guidanceStrength: 7.5,
  styleIntensity: "balanced",
};

/*
|--------------------------------------------------------------------------
| PROMPT ENGINE (SMART STRUCTURED SYSTEM)
|--------------------------------------------------------------------------
*/

exports.PROMPT_ENGINE = {
  positive: {
    base: `
high quality,
detailed,
sharp focus,
professional composition,
well lit,
high resolution
    `.trim(),

    qualityBoost: `
ultra detailed,
8k resolution,
cinematic rendering,
award winning photography,
global illumination
    `.trim(),
  },

  negative: `
blurry,
low quality,
distorted,
deformed,
extra limbs,
bad anatomy,
noise,
watermark,
text,
logo
  `.trim(),
};

/*
|--------------------------------------------------------------------------
| PREMIUM STYLE PRESETS (IMPROVED)
|--------------------------------------------------------------------------
*/

exports.STYLE_PRESETS = {
  realistic: {
    label: "Photorealistic",
    prompt: `
photorealistic scene,
natural lighting,
camera depth of field,
real-world physics,
ultra detailed textures,
DSLR quality
    `.trim(),
  },

  cinematic: {
    label: "Cinematic",
    prompt: `
cinematic film still,
dramatic lighting,
movie grade color correction,
volumetric fog,
anamorphic lens effect,
epic composition
    `.trim(),
  },

  anime: {
    label: "Anime",
    prompt: `
high quality anime style,
clean line art,
studio-level shading,
vibrant color palette,
detailed character design,
sharp outlines
    `.trim(),
  },

  fantasy: {
    label: "Fantasy",
    prompt: `
fantasy world illustration,
magical atmosphere,
epic environment design,
mythical creatures,
dreamlike lighting,
high detail concept art
    `.trim(),
  },

  cyberpunk: {
    label: "Cyberpunk",
    prompt: `
cyberpunk cityscape,
neon lights reflections,
rainy futuristic street,
dark atmosphere,
high tech aesthetic,
glowing signs
    `.trim(),
  },

  oilPainting: {
    label: "Oil Painting",
    prompt: `
classical oil painting style,
visible brush strokes,
museum quality artwork,
rich textures,
renaissance inspired lighting,
fine art composition
    `.trim(),
  },

  minimal: {
    label: "Minimal",
    prompt: `
minimalist composition,
clean background,
soft lighting,
simple shapes,
modern aesthetic,
negative space focus
    `.trim(),
  },

  abstract: {
    label: "Abstract",
    prompt: `
abstract visual art,
conceptual design,
artistic interpretation,
dynamic shapes,
experimental composition,
modern gallery style
    `.trim(),
  },
};

/*
|--------------------------------------------------------------------------
| PROMPT BUILDER (IMPORTANT FOR QUALITY)
|--------------------------------------------------------------------------
*/

exports.buildPrompt = ({
  userPrompt,
  style = "realistic",
}) => {
  const stylePrompt =
    exports.STYLE_PRESETS[style]?.prompt || "";

  return `
${userPrompt},

${stylePrompt},

${exports.PROMPT_ENGINE.positive.base},

${exports.PROMPT_ENGINE.positive.qualityBoost}
  `.replace(/\s+/g, " ").trim();
};

/*
|--------------------------------------------------------------------------
| NEGATIVE PROMPT (FOR API USE)
|--------------------------------------------------------------------------
*/

exports.getNegativePrompt = () => {
  return exports.PROMPT_ENGINE.negative;
};