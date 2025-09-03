// AI Studio Pro — frontend-only prototype with downloads & project export
// Scenes stored in-memory. Replace fake calls with backend endpoints when ready.

/* ---------- DOM references ---------- */
const modeButtons = document.querySelectorAll('.mode-btn');
const modeTitle = document.getElementById('mode-title');

const imagesPanel = document.getElementById('images-panel');
const referencePanel = document.getElementById('reference-panel');
const studioPanel = document.getElementById('studio-panel');
const voicePanel = document.getElementById('voice-panel');
const projectPanel = document.getElementById('project-panel');

const promptInput = document.getElementById('prompt');
const generateBtn = document.getElementById('generate');
const variations = document.getElementById('variations');
const size = document.getElementById('size');
const modelSelect = document.getElementById('model');

const refPrompt = document.getElementById('ref-prompt');
const refImage = document.getElementById('ref-image');
const refStrength = document.getElementById('ref-strength');
const refGenerate = document.getElementById('ref-generate');

const timelineEl = document.getElementById('timeline');
const addSceneBtn = document.getElementById('add-scene');
const previewBtn = document.getElementById('preview-video');
const exportBtn = document.getElementById('export-video');

const selectedInfo = document.getElementById('selected-info');
const replaceImageInput = document.getElementById('replace-image');
const selectedTransition = document.getElementById('selected-transition');
const selectedDuration = document.getElementById('selected-duration');
const saveSceneBtn = document.getElementById('save-scene');
const regenerateBtn = document.getElementById('regenerate-scene');
const downloadSceneBtn = document.getElementById('download-scene');

const sceneScript = document.getElementById('scene-script');
const generateVoiceBtn = document.getElementById('generate-voice');
const sceneAudioDiv = document.getElementById('scene-audio');
const sceneAudioPlayer = document.getElementById('scene-audio-player');
const sceneAudioDownload = document.getElementById('scene-audio-download');

const voiceText = document.getElementById('voice-text');
const voiceModel = document.getElementById('voice-model');
const voiceStyle = document.getElementById('voice-style');
const voiceSpeed = document.getElementById('voice-speed');
const voicePitch = document.getElementById('voice-pitch');
const voiceGenerateBtn = document.getElementById('voice-generate');
const voiceResult = document.getElementById('voice-result');
const voicePlayer = document.getElementById('voice-player');
const voiceDownload = document.getElementById('voice-download');

const gallery = document.getElementById('gallery');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const exportJsonBtn = document.getElementById('export-json');
const importJsonInput = document.getElementById('import-json');
const clearProjectBtn = document.getElementById('clear-project');

const downloadProjectBtn = document.getElementById('download-project');
const importProjectBtn = document.getElementById('import-project');
const clearAllBtn = document.getElementById('clear-all');

const hiddenReplaceInput = document.getElementById('hidden-replace-input');

/* ---------- State ---------- */
let scenes = []; // {id, image, text, transition, duration, audioUrl}
let selectedSceneId = null;

/* ---------- Helpers ---------- */
function uid(){ return 's'+Math.random().toString(36).slice(2,9); }
function showProgress(text){ progress.classList.remove('hidden'); progressText.innerText = text; progressBar.style.width = '10%'; }
function hideProgress(){ progress.classList.add('hidden'); progressBar.style.width='0'; progressText.innerText=''; }

/* ---------- Panel switching ---------- */
function hideAllPanels(){ imagesPanel.classList.add('hidden'); referencePanel.classList.add('hidden'); studioPanel.classList.add('hidden'); voicePanel.classList.add('hidden'); projectPanel.classList.add('hidden'); gallery.classList.remove('hidden'); }
modeButtons.forEach(btn=>{ btn.addEventListener('click', ()=>{ modeButtons.forEach(x=>x.classList.remove('active')); btn.classList.add('active'); const mode = btn.dataset.mode; modeTitle.innerText = mode.charAt(0).toUpperCase()+mode.slice(1); hideAllPanels(); if(mode==='images') imagesPanel.classList.remove('hidden'); if(mode==='reference') referencePanel.classList.remove('hidden'); if(mode==='studio') studioPanel.classList.remove('hidden'); if(mode==='voice') voicePanel.classList.remove('hidden'); if(mode==='project') projectPanel.classList.remove('hidden'); }); });

/* ---------- Fake generation helpers (replace with backend calls) ---------- */
function fakeGenerateImages(promptText, count, sizeVal){
  const arr = [];
  for(let i=0;i<count;i++){
    arr.push(`https://placehold.co/${sizeVal.replace('x','/')}/png?text=${encodeURIComponent(promptText+' '+(i+1))}`);
  }
  return arr;
}
function fakeGenerateFromReference(promptText){ return `https://placehold.co/512x512/png?text=${encodeURIComponent('Ref:'+promptText)}`; }
function fakeGenerateAudio(text){ return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; }

/* ---------- Images panel: generate ---------- */
generateBtn.addEventListener('click', async ()=>{
  const p = promptInput.value.trim(); if(!p){ alert('Enter prompt'); return; }
  const count = parseInt(variations.value||1); const sz = size.value||'512x512';
  gallery.innerHTML=''; showProgress('Generating images...');
  await new Promise(r=>setTimeout(r,800));
  const urls = fakeGenerateImages(p, count, sz);
  progressBar.style.width='80%'; progressText.innerText='Finalizing...';
  await new Promise(r=>setTimeout(r,400));
  hideProgress();
  urls.forEach(u=> addImageToGallery(u));
});

function addImageToGallery(url){
  const card = document.createElement('div'); card.className='gallery-card';
  card.innerHTML = `<img src="${url}" alt="img"><div style="display:flex;gap:8px"><button class="btn-use">Use in Studio</button><button class="btn-download"><i class="fa-solid fa-download"></i></button></div>`;
  gallery.appendChild(card);
  card.querySelector('.btn-use').addEventListener('click', ()=> addScene({image:url}));
  card.querySelector('.btn-download').addEventListener('click', ()=> downloadUrl(url));
}

/* ---------- Reference panel ---------- */
refGenerate.addEventListener('click', async ()=>{
  const p = refPrompt.value.trim(); if(!p){ alert('Enter ref prompt'); return; }
  if(!refImage.files.length){ alert('Upload reference image'); return; }
  showProgress('Generating from reference...'); await new Promise(r=>setTimeout(r,900));
  const url = fakeGenerateFromReference(p); hideProgress(); addImageToGallery(url); alert('Reference generation complete (placeholder)');
});

/* ---------- Studio timeline ---------- */
function renderTimeline(){
  timelineEl.innerHTML='';
  scenes.forEach(s=>{
    const div = document.createElement('div'); div.className='scene-card'; div.dataset.id = s.id;
    div.innerHTML = `<img src="${s.image}" alt=""><div class="scene-meta"><small>Scene</small><strong>${s.id}</strong></div><div style="font-size:13px;color:#9fb3c8">${(s.text||'No text').slice(0,60)}</div><div class="scene-actions"><button class="btn-select">Select</button><button class="btn-replace">Replace</button><button class="btn-download-img"><i class="fa-solid fa-download"></i></button><button class="btn-delete">Delete</button></div>`;
    timelineEl.appendChild(div);
    div.querySelector('.btn-select').addEventListener('click', ()=> selectScene(s.id));
    div.querySelector('.btn-replace').addEventListener('click', ()=> triggerReplace(s.id));
    div.querySelector('.btn-delete').addEventListener('click', ()=> deleteScene(s.id));
    div.querySelector('.btn-download-img').addEventListener('click', ()=> downloadUrl(s.image));
  });
}

function addScene(opts={}){
  const id = uid();
  const scene = { id, image: opts.image || `https://placehold.co/600x400/png?text=Scene+${encodeURIComponent(id)}`, text: opts.text||'', transition: opts.transition||'cut', duration: opts.duration||3, audioUrl: opts.audioUrl||null };
  scenes.push(scene); renderTimeline(); selectScene(id);
}

function selectScene(id){
  selectedSceneId = id; const s = scenes.find(x=>x.id===id); if(!s) return;
  selectedInfo.innerHTML = `<div><strong>Scene ${s.id}</strong></div><img src="${s.image}" style="width:100%;border-radius:8px;margin-top:8px"><div style="margin-top:8px"><small>Transition: ${s.transition}</small> • <small>${s.duration}s</small></div>`;
  selectedTransition.value = s.transition; selectedDuration.value = s.duration; sceneScript.value = s.text||'';
  if(s.audioUrl){ sceneAudioDiv.classList.remove('hidden'); sceneAudioPlayer.src = s.audioUrl; sceneAudioDownload.href = s.audioUrl; } else { sceneAudioDiv.classList.add('hidden'); sceneAudioPlayer.src=''; sceneAudioDownload.href='#'; }
}

function deleteScene(id){ scenes = scenes.filter(s=>s.id!==id); renderTimeline(); selectedInfo.innerHTML='No scene selected'; selectedSceneId=null; }

function triggerReplace(id){
  hiddenReplaceInput.onchange = function(e){ const file = e.target.files[0]; if(!file) return; const url = URL.createObjectURL(file); const s = scenes.find(x=>x.id===id); if(s){ s.image = url; renderTimeline(); selectScene(id); } hiddenReplaceInput.value=''; }
  hiddenReplaceInput.click();
}

saveSceneBtn.addEventListener('click', ()=>{ if(!selectedSceneId){ alert('Select a scene'); return; } const s = scenes.find(x=>x.id===selectedSceneId); s.transition = selectedTransition.value; s.duration = parseInt(selectedDuration.value)||3; s.text = sceneScript.value.trim(); alert('Saved scene'); renderTimeline(); });

regenerateBtn.addEventListener('click', async ()=>{ if(!selectedSceneId){ alert('Select a scene'); return; } showProgress('Regenerating scene...'); await new Promise(r=>setTimeout(r,900)); const s = scenes.find(x=>x.id===selectedSceneId); s.image = `https://placehold.co/600x400/png?text=Regenerated+${encodeURIComponent(s.id)}`; hideProgress(); renderTimeline(); selectScene(selectedSceneId); alert('Regenerated (placeholder)'); });

downloadSceneBtn.addEventListener('click', ()=>{ if(!selectedSceneId){ alert('Select a scene'); return; } const s = scenes.find(x=>x.id===selectedSceneId); downloadUrl(s.image); });

/* ---------- Voice per scene (placeholder) ---------- */
generateVoiceBtn.addEventListener('click', async ()=>{ if(!selectedSceneId){ alert('Select a scene'); return; } const text = sceneScript.value.trim(); if(!text){ alert('Enter scene text'); return; } showProgress('Generating voice...'); await new Promise(r=>setTimeout(r,900)); const audio = fakeGenerateAudio(text); const s = scenes.find(x=>x.id===selectedSceneId); s.audioUrl = audio; hideProgress(); selectScene(selectedSceneId); alert('Voice generated (placeholder)'); });

/* ---------- Voice workspace (global TTS) ---------- */
voiceGenerateBtn?.addEventListener('click', async ()=>{ const txt = voiceText.value.trim(); if(!txt){ alert('Enter text'); return; } showProgress('Generating TTS...'); await new Promise(r=>setTimeout(r,900)); const audio = fakeGenerateAudio(txt); voiceResult.classList.remove('hidden'); voicePlayer.src = audio; voiceDownload.href = audio; hideProgress(); alert('TTS ready (placeholder)'); });

/* ---------- Preview player (simple slideshow with audio playback) ---------- */
previewBtn.addEventListener('click', async ()=>{
  if(scenes.length===0){ alert('No scenes'); return; }
  const overlay = document.createElement('div'); overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,0.9)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='9999';
  const player = document.createElement('div'); player.style.width='85%'; player.style.maxWidth='980px'; player.style.background='#041018'; player.style.padding='16px'; player.style.borderRadius='12px'; overlay.appendChild(player);
  const closeBtn = document.createElement('button'); closeBtn.textContent='Close'; closeBtn.style.marginBottom='10px'; closeBtn.className='primary'; closeBtn.addEventListener('click', ()=> document.body.removeChild(overlay));
  player.appendChild(closeBtn);
  const imgEl = document.createElement('img'); imgEl.style.width='100%'; imgEl.style.borderRadius='8px'; player.appendChild(imgEl);
  document.body.appendChild(overlay);
  for(const s of scenes){
    imgEl.src = s.image;
    if(s.audioUrl){ const a = new Audio(s.audioUrl); a.play(); }
    await new Promise(r=>setTimeout(r, (s.duration||3)*1000));
  }
  document.body.removeChild(overlay);
});

/* ---------- Export / Import Project JSON ---------- */
function exportProjectJSON(){
  const project = { scenes, meta: { exportedAt: new Date().toISOString() } };
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'ai_studio_project.json'; a.click(); URL.revokeObjectURL(url);
}
exportJsonBtn.addEventListener('click', exportProjectJSON);

importJsonInput.addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader(); reader.onload = function(){ try{ const obj = JSON.parse(reader.result); if(obj.scenes){ scenes = obj.scenes; renderTimeline(); alert('Project imported'); } else alert('Invalid project file'); }catch(err){ alert('Error parsing JSON'); } };
  reader.readAsText(file);
});

clearProjectBtn.addEventListener('click', ()=>{ if(confirm('Clear project?')){ scenes=[]; renderTimeline(); selectedInfo.innerHTML='No scene selected'; alert('Project cleared'); } });

/* ---------- Topbar buttons ---------- */
downloadProjectBtn.addEventListener('click', exportProjectJSON);
importProjectBtn.addEventListener('click', ()=> importJsonInput.click());
clearAllBtn.addEventListener('click', ()=>{ if(confirm('Clear everything (scenes + gallery)?')){ scenes=[]; gallery.innerHTML=''; renderTimeline(); selectedInfo.innerHTML='No scene selected'; alert('Cleared'); } });

/* ---------- Utility: download URL ---------- */
function downloadUrl(url){
  const a = document.createElement('a'); a.href = url; a.download = url.split('/').pop().split('?')[0] || 'download.png'; document.body.appendChild(a); a.click(); a.remove();
}

/* ---------- Auto arrange (placeholder) ---------- */
document.getElementById('auto-arrange').addEventListener('click', ()=>{ alert('Auto-arrange placeholder. Implement reorder logic or drag-drop.'); });

/* ---------- Add default demo scenes ---------- */
addScene({text:'Cinematic ultra-realistic French woman near guillotine, smoky courtroom.'});
addScene({text:'Close-up: tense expression, dramatic lighting.'});
addScene({text:'Wide shot: 1940s Paris, rain-soaked streets.'});
renderTimeline();
