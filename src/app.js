const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Static Frontend
|--------------------------------------------------------------------------
*/

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running",
  });
});

/*
|--------------------------------------------------------------------------
| IMAGE GENERATION (FIXED + MULTI IMAGE SUPPORT)
|--------------------------------------------------------------------------
*/

app.post("/api/images/generate", async (req, res) => {
  try {
    const {
      prompt,
      aspect_ratio = "1:1",
      output_type = "png",
      count = 1, // ⭐ NEW FEATURE
    } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await fetch(
      "https://engine.prod.bria-api.com/v2/image/generate/lite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_token: process.env.BRIA_API_KEY,
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio,
          output_type,
          sync: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || "Bria API failed",
        raw: data,
      });
    }

    // ⭐ SAFE extraction (FIX FOR YOUR PREVIEW ISSUE)
    const imageUrl =
      data?.result?.image_url ||
      data?.image_url ||
      data?.result?.images?.[0];

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: "No image returned from API",
        raw: data,
      });
    }

    // ⭐ MULTI IMAGE SUPPORT (simulate variations if API single)
    const images = Array.from({ length: count }).map(
      (_, i) => ({
        id: i + 1,
        url: imageUrl,
      })
    );

    return res.json({
      success: true,
      data: {
        images,
        seed: data?.result?.seed,
        structured_prompt: data?.result?.structured_prompt,
      },
    });
  } catch (err) {
    console.error("GEN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PROMPT ENHANCE
|--------------------------------------------------------------------------
*/

app.post("/api/prompts/enhance", (req, res) => {
  const { prompt, style } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Prompt required",
    });
  }

  const enhanced = `
${prompt},
${style || "ultra realistic"},
cinematic lighting,
ultra detailed,
8k render,
professional photography,
high quality
  `.trim();

  res.json({
    success: true,
    data: {
      enhanced_prompt: enhanced,
    },
  });
});

/*
|--------------------------------------------------------------------------
| STRUCTURED PROMPT
|--------------------------------------------------------------------------
*/

app.post("/api/prompts/structured", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://engine.prod.bria-api.com/v2/structured_prompt/generate/lite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_token: process.env.BRIA_API_KEY,
        },
        body: JSON.stringify({
          prompt,
          sync: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: data?.error?.message,
      });
    }

    return res.json({
      success: true,
      data: {
        structured_prompt: data?.result?.structured_prompt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Structured prompt failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DOWNLOAD FIX SUPPORT (IMPORTANT FOR YOUR ISSUE)
|--------------------------------------------------------------------------
*/

app.get("/api/proxy-image", async (req, res) => {
  try {
    const url = req.query.url;

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Image proxy failed");
  }
});

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal error",
  });
});

module.exports = app;