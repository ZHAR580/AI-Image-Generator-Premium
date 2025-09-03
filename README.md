# AI-Image-Generator-Studio-Final (Frontend)

This is the **final frontend** package with Studio and Voice Studio UI. It is designed for GitHub Pages hosting and connects to a backend (Colab or hosted API) for actual generation work.

## What changed in this final package
- Added Voice Studio modal with multiple premium voice model options, speed/pitch sliders, play preview and generate/download buttons (placeholders).
- Studio workspace now included in the main UI (script input, scene controls, timeline view).
- Model selector and rendering options on sidebar.

## How to use
1. Upload the `frontend/` folder from this zip to your GitHub repo and enable GitHub Pages (branch `main`, folder `/` or `/frontend`).
2. Replace placeholder calls in `script.js` with your backend endpoints:
   - `POST /generate_images` — returns `{ images: [url, ...] }`
   - `POST /generate_story` — returns `{ scenes: [{text, image_url}, ...] }`
   - `POST /tts_preview` or `/generate_audio` — returns `{ audio_url: "..." }`
3. I can build the Colab all-in-one backend (image gen + TTS + endpoints via FastAPI + ngrok). Reply **"Make Colab notebook"** if you want me to prepare it.

## Note
This frontend is complete and theme-styled. Backend integration is required for full functionality (high-quality TTS, model selection, reference-image conditioning).
