/*
|--------------------------------------------------------------------------
| DOM ELEMENTS
|--------------------------------------------------------------------------
*/

const $ = (id) => document.getElementById(id);

const elements = {
  prompt: $("prompt"),
  aspectRatio: $("aspectRatio"),
  style: $("style"),
  outputType: $("outputType"),
  imageCount: $("imageCount"),

  generateBtn: $("generateBtn"),
  enhanceBtn: $("enhanceBtn"),
  clearBtn: $("clearBtn"),
  copyStructuredBtn: $("copyStructuredBtn"),

  loading: $("loading"),
  loadingText: $("loadingText"),

  emptyState: $("emptyState"),
  resultsGrid: $("resultsGrid"),

  structuredPromptWrapper: $("structuredPromptWrapper"),
  structuredPrompt: $("structuredPrompt"),

  toast: $("toast"),

  imageModal: $("imageModal"),
  modalImage: $("modalImage"),
  closeModal: $("closeModal"),

  errorBox: $("errorBox"),
};

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const state = {
  images: [],
  structuredPrompt: null,
};

/*
|--------------------------------------------------------------------------
| SAFE TOAST
|--------------------------------------------------------------------------
*/

let toastTimeout;

function showToast(message, type = "success") {
  clearTimeout(toastTimeout);

  elements.toast.innerText = message;
  elements.toast.className = `toast show ${type}`;

  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2500);
}

/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

function setLoading(isLoading, text = "Generating...") {
  elements.loading.classList.toggle("hidden", !isLoading);
  elements.generateBtn.disabled = isLoading;

  elements.loadingText.innerText = text;

  elements.generateBtn.innerHTML = isLoading
    ? `<span class="btn-loader"></span> Generating...`
    : "🚀 Generate AI Images";
}

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

function validatePrompt(prompt) {
  if (!prompt || prompt.trim().length < 5) {
    showToast("Prompt must be at least 5 characters", "error");
    return false;
  }
  return true;
}

/*
|--------------------------------------------------------------------------
| BUILD PROMPT
|--------------------------------------------------------------------------
*/

function buildPrompt() {
  return `
${elements.prompt.value},
${elements.style.value},
ultra realistic,
cinematic lighting,
high detail,
8k render,
professional photography
  `.trim();
}

/*
|--------------------------------------------------------------------------
| API CALL (SAFE)
|--------------------------------------------------------------------------
*/

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| GENERATE IMAGES (PRODUCTION SAFE)
|--------------------------------------------------------------------------
*/

async function generateImages() {
  const prompt = elements.prompt.value.trim();

  if (!validatePrompt(prompt)) return;

  try {
    setLoading(true, "Creating AI images...");

    elements.emptyState.classList.add("hidden");
    elements.resultsGrid.classList.add("hidden");
    elements.resultsGrid.innerHTML = "";

    const count = Math.min(
      Number(elements.imageCount.value || 1),
      4
    );

    const finalPrompt = buildPrompt();

    const requests = Array.from({ length: count }).map(() =>
      post("/api/images/generate", {
        prompt: finalPrompt,
        aspect_ratio: elements.aspectRatio.value,
        output_type: elements.outputType.value,
      })
    );

    const results = await Promise.allSettled(requests);

    const images = [];

    results.forEach((r) => {
      if (r.status === "fulfilled") {
        const img =
          r.value?.data?.image_url ||
          r.value?.data?.images?.[0]?.url;

        const structured = r.value?.data?.structured_prompt;

        if (img) images.push(img);
        if (structured) state.structuredPrompt = structured;
      }
    });

    if (!images.length) {
      throw new Error("No images generated");
    }

    state.images = images;

    renderImages(images);
    renderStructured();

    showToast(`Generated ${images.length} image(s)`);
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
    elements.errorBox.innerText = err.message;
    elements.errorBox.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
}

/*
|--------------------------------------------------------------------------
| RENDER IMAGES
|--------------------------------------------------------------------------
*/

function renderImages(images) {
  elements.resultsGrid.innerHTML = "";

  images.forEach((url, i) => {
    const card = document.createElement("div");
    card.className = "image-card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${url}" class="generated-image" loading="lazy" />

        <div class="image-overlay">
          
          <button class="action-btn preview" data-url="${url}">
            👁 Preview
          </button>

          <button class="action-btn download" data-url="${url}" data-i="${i}">
            ⬇ Download
          </button>

        </div>
      </div>
    `;

    elements.resultsGrid.appendChild(card);
  });

  elements.resultsGrid.classList.remove("hidden");

  bindActions();
}

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

function bindActions() {
  document.querySelectorAll(".preview").forEach((btn) => {
    btn.onclick = () => openModal(btn.dataset.url);
  });

  document.querySelectorAll(".download").forEach((btn) => {
    btn.onclick = () => download(btn.dataset.url, btn.dataset.i);
  });
}

/*
|--------------------------------------------------------------------------
| SAFE DOWNLOAD (FIXED)
|--------------------------------------------------------------------------
*/

async function download(url, index) {
  try {
    // FIX: CORS-safe download via proxy fallback
    const res = await fetch(
      `/api/proxy-image?url=${encodeURIComponent(url)}`
    );

    const blob = await res.blob();

    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `bria-ai-${Date.now()}-${index}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);

    showToast("Downloaded");
  } catch (err) {
    console.error(err);
    showToast("Download failed", "error");
  }
}

/*
|--------------------------------------------------------------------------
| MODAL
|--------------------------------------------------------------------------
*/

function openModal(url) {
  elements.modalImage.src = url;
  elements.imageModal.classList.remove("hidden");
}

function closeModal() {
  elements.imageModal.classList.add("hidden");
}

/*
|--------------------------------------------------------------------------
| STRUCTURED PROMPT
|--------------------------------------------------------------------------
*/

function renderStructured() {
  if (!state.structuredPrompt) return;

  elements.structuredPromptWrapper.classList.remove("hidden");

  elements.structuredPrompt.value = JSON.stringify(
    state.structuredPrompt,
    null,
    2
  );
}

/*
|--------------------------------------------------------------------------
| ENHANCE PROMPT
|--------------------------------------------------------------------------
*/

function enhancePrompt() {
  const v = elements.prompt.value.trim();
  if (!v) return showToast("Enter prompt", "error");

  elements.prompt.value +=
    ", cinematic, ultra detailed, volumetric lighting, hyper realistic";

  showToast("Enhanced");
}

/*
|--------------------------------------------------------------------------
| CLEAR
|--------------------------------------------------------------------------
*/

function clearPrompt() {
  elements.prompt.value = "";
  showToast("Cleared");
}

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/

elements.generateBtn.onclick = generateImages;
elements.enhanceBtn.onclick = enhancePrompt;
elements.clearBtn.onclick = clearPrompt;
elements.closeModal.onclick = closeModal;

/*
|--------------------------------------------------------------------------
| SHORTCUT
|--------------------------------------------------------------------------
*/

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    generateImages();
  }
});