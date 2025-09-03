# AI-Image-Generator-Premium

This package includes a polished front-end (GitHub Pages-ready) and placeholders for backend integration (Colab / FastAPI).

## What is included
- `frontend/` — index.html, style.css, script.js (premium dark theme, sidebar, model selector)
- README with setup steps.

## How to use
1. Upload the `frontend` folder to your GitHub repo and enable GitHub Pages (branch `main`, folder `/frontend` or root).
2. Replace placeholder API calls in `script.js` with your backend endpoints (Colab/ngrok or hosted API):
   - `/generate_images` — should accept POST with prompt, model, size, variations and return `{ images: [url, ...] }`
   - `/generate_story` — for storytelling (100 scenes)
   - `/tts_preview` — return audio preview URL for script text
3. Run a Colab notebook (we recommend an all-in-one notebook) to host the backend:
   - Mount Drive, load SD/Flux models, implement endpoints using FastAPI and ngrok (or use pyngrok to expose).
4. Connect frontend to backend by replacing placeholder with your public endpoint.

## Recommended endpoints examples
- POST /generate_images
  - Body: { prompt, model, size, variations, nsfw, reference_image (optional) }
  - Response: { images: ["https://drive.google.com/..., ...] }

- POST /tts_preview
  - Body: { script, voice }
  - Response: { audio: "https://..." }

## Notes
- This front-end is ready and styled. Backend model integration (Stable Diffusion, Flux models, TTS) must be implemented in Colab or a server with GPU.
- If you'd like, I can add a ready Colab notebook (all-in-one) next that implements `/generate_images`, `/generate_story`, and `/tts_preview` endpoints and shows exactly how to connect with ngrok.
