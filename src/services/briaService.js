const promptEnhancer = require("./promptEnhancer");

const {
  BRIA_BASE_URL,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_IMAGE_COUNT,
} = require("../utils/constants");

class BriaService {
  constructor() {
    this.apiToken = process.env.BRIA_API_TOKEN;
  }

  async request(endpoint, payload) {
    const response = await fetch(
      `${BRIA_BASE_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_token: this.apiToken,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Bria API request failed"
      );
    }

    return data;
  }

  async generateStructuredPrompt(body) {
    const {
      prompt,
      style = "realistic",
      images,
      structured_prompt,
    } = body;

    const enhancedPrompt = prompt
      ? promptEnhancer.enhance(prompt, style)
      : undefined;

    const payload = {
      prompt: enhancedPrompt,
      images,
      structured_prompt,
      sync: true,
    };

    return await this.request(
      "/structured_prompt/generate",
      payload
    );
  }

  async generateImage(body) {
    const {
      prompt,
      style = "realistic",
      aspectRatio = DEFAULT_ASPECT_RATIO,
      outputType = DEFAULT_OUTPUT_FORMAT,
      imageCount = DEFAULT_IMAGE_COUNT,
      negativePrompt,
      seed,
    } = body;

    const enhancedPrompt = promptEnhancer.enhance(
      prompt,
      style
    );

    const structuredData =
      await this.generateStructuredPrompt({
        prompt: enhancedPrompt,
      });

    const structuredPrompt =
      structuredData?.result?.structured_prompt;

    const images = [];

    for (let i = 0; i < imageCount; i++) {
      const payload = {
        structured_prompt: structuredPrompt,
        aspect_ratio: aspectRatio,
        output_type: outputType,
        negative_prompt: negativePrompt,
        seed: seed || Math.floor(Math.random() * 999999),
        sync: true,
      };

      const result = await this.request(
        "/image/generate",
        payload
      );

      images.push(result.result);
    }

    return {
      enhancedPrompt,
      structuredPrompt,
      images,
    };
  }

  async refineImage(body) {
    const {
      structuredPrompt,
      refinementPrompt,
      aspectRatio = DEFAULT_ASPECT_RATIO,
    } = body;

    const structuredData =
      await this.generateStructuredPrompt({
        structured_prompt: structuredPrompt,
        prompt: refinementPrompt,
      });

    const refinedStructuredPrompt =
      structuredData?.result?.structured_prompt;

    const payload = {
      structured_prompt: refinedStructuredPrompt,
      aspect_ratio: aspectRatio,
      sync: true,
    };

    const result = await this.request(
      "/image/generate",
      payload
    );

    return {
      refinedStructuredPrompt,
      image: result.result,
    };
  }

  async generateVariations(body) {
    const {
      structuredPrompt,
      imageCount = 4,
      aspectRatio = DEFAULT_ASPECT_RATIO,
    } = body;

    const images = [];

    for (let i = 0; i < imageCount; i++) {
      const payload = {
        structured_prompt: structuredPrompt,
        aspect_ratio: aspectRatio,
        seed: Math.floor(Math.random() * 999999),
        sync: true,
      };

      const result = await this.request(
        "/image/generate",
        payload
      );

      images.push(result.result);
    }

    return {
      total: images.length,
      images,
    };
  }

  async generateStructuredPromptDiff(body) {
    const {
      structuredPrompt,
      userAdjustedStructuredPrompt,
    } = body;

    return await this.request(
      "/structured_prompt/generate_from_diff",
      {
        structured_prompt: structuredPrompt,
        user_adjusted_structured_prompt:
          userAdjustedStructuredPrompt,
        sync: true,
      }
    );
  }
}

module.exports = new BriaService();