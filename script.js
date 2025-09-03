/* AI Studio Pro — Final frontend prototype
   - Sidebar switching fixed (each option shows its own section)
   - Reference panel fully functional UI (placeholder behavior)
   - Stores bulk manifest generation (placeholder images + manifest download)
   - Studio script->scenes (placeholder)
   - Video editor (manual timeline): import images, drag to timeline slots, reorder, preview, export placeholder
   - Voice workspace inline TTS placeholders
   - Settings panel contains global model/steps/cfg
   - Project export/import as JSON
*/

// Sidebar switching
const modeBtns = document.querySelectorAll('.mode-btn');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('page-title');

modeBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    modeBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    sections.forEach(s=> s.id===target ? s.classList.remove('hidden') : s.classList.add('hidden'));
    pageTitle.innerText = btn.innerText.trim();
  });
});

/* ---------- Project import/export ---------- */
document.getElementById('export-project').addEventListener('click', ()=>{
  const project = { scenes: window.Scenes || [], stores: window.Stores || {}, settings: collectSettings() };
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'ai_studio_project.json'; a.click(); URL.revokeObjectURL(url);
});
document.getElementById('import-project').addEventListener('click', ()=> document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', (e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); alert('Imported project (demo). Please review sections.'); /* you may map data into UI */ }catch(err){ alert('Invalid JSON'); } }; r.readAsText(f); });

function collectSettings(){ return { model: document.getElementById('setting-model').value, size: document.getElementById('setting-size').value, steps: document.getElementById('setting-steps').value, cfg: document.getElementById('setting-cfg').value }; }

/* ---------- IMAGES ---------- */
const imagesGallery = document.getElementById('images-gallery');
document.getElementById('generate').addEventListener('click', async ()=>{
  const p = document.getElementById('prompt').value.trim();
  if(!p){ alert('Enter prompt'); return; }
  imagesGallery.innerHTML='';
  const count = parseInt(document.getElementById('variations').value);
  const siz = document.getElementById('size').value;
  for(let i=0;i<count;i++){
    const url = `https://placehold.co/${siz.replace('x','/')}/png?text=${encodeURIComponent(p+' '+(i+1))}`;
    const card = document.createElement('div'); card.className='gallery-card';
    card.innerHTML = `<img src="${url}"><div style="display:flex;gap:8px"><button class="use-btn">Use in Studio</button><button class="download-btn">Download</button></div>`;
    imagesGallery.appendChild(card);
    card.querySelector('.use-btn').addEventListener('click', ()=> addSceneToStudio({image:url, text:p}));
    card.querySelector('.download-btn').addEventListener('click', ()=> downloadUrl(url));
  }
});

/* ---------- REFERENCE ---------- */
document.getElementById('ref-upload').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const url = URL.createObjectURL(file);
  const d = document.getElementById('ref-preview'); d.innerHTML = `<img src="${url}" style="max-width:220px;border-radius:8px">`;
});
document.getElementById('ref-generate').addEventListener('click', ()=>{
  const prompt = document.getElementById('ref-style').value + ' (reference)';
  alert('Reference generation placeholder. Backend needed for face-guided generation.');
});

/* ---------- STORES ---------- */
window.Stores = {};
function uid(){ return 'id'+Math.random().toString(36).slice(2,9); }
function renderStores(){ const container = document.getElementById('stores-container'); container.innerHTML=''; Object.values(window.Stores).forEach(s=>{ const d=document.createElement('div'); d.innerHTML=`<strong>${s.name}</strong> <button class="select" data-id="${s.id}">Select</button> <button class="del" data-id="${s.id}">Delete</button><div style="font-size:12px;color:#9fb3c8">${(s.images||[]).length} images</div>`; container.appendChild(d); }); document.querySelectorAll('#stores-container .select').forEach(b=>b.addEventListener('click', ()=> selectStore(b.dataset.id))); document.querySelectorAll('#stores-container .del').forEach(b=>{ b.addEventListener('click', ()=>{ delete window.Stores[b.dataset.id]; renderStores(); }); }); }
document.getElementById('add-store').addEventListener('click', ()=>{ const name = document.getElementById('new-store-name').value.trim(); if(!name) return alert('Enter store name'); const id=uid(); window.Stores[id]={id,name,images:[]}; document.getElementById('new-store-name').value=''; renderStores(); });
function selectStore(id){ const s = window.Stores[id]; document.getElementById('selected-store-panel').innerHTML = `<h4>${s.name}</h4><div>${(s.images||[]).length} images</div>`; document.getElementById('store-controls').classList.remove('hidden'); document.getElementById('generate-store').onclick = ()=> generateBulkForStore(id); document.getElementById('download-store-zip').onclick = ()=> downloadManifest(id); renderStoresGallery(id); }
function generateBulkForStore(id){ const s = window.Stores[id]; const prompt = document.getElementById('store-prompt').value || s.name; const count = parseInt(document.getElementById('store-count').value||1); const size = document.getElementById('store-size').value; for(let i=0;i<count;i++){ const url = `https://placehold.co/${size.replace('x','/')}/png?text=${encodeURIComponent(s.name+'-'+(i+1))}`; s.images.push({url,product:'item'+(i+1)}); } alert('Placeholder bulk generated for store (backend required for real images)'); renderStores(); renderStoresGallery(id); }
function renderStoresGallery(id){ const gal = document.getElementById('stores-gallery'); gal.innerHTML=''; (window.Stores[id].images||[]).forEach(img=>{ const c=document.createElement('div'); c.className='gallery-card'; c.innerHTML=`<img src="${img.url}"><div style="display:flex;gap:8px"><button onclick="downloadUrl('${img.url}')">Download</button></div><div style="font-size:13px;color:#9fb3c8">${img.product||''}</div>`; gal.appendChild(c); }); }
function downloadManifest(id){ const s = window.Stores[id]; const blob = new Blob([JSON.stringify(s, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download = `${s.name}_manifest.json`; a.click(); URL.revokeObjectURL(url); alert('Manifest downloaded (use backend to zip images).'); }

/* ---------- STUDIO (script->scenes) ---------- */
document.getElementById('run-studio').addEventListener('click', ()=>{
  const text = document.getElementById('studio-script').value.trim(); if(!text) return alert('Paste your script'); const n = parseInt(document.getElementById('studio-scenes').value||10); const arr = text.split(/(?<=[.?!])\s+/).slice(0,n); const tl = document.getElementById('studio-timeline'); tl.innerHTML=''; arr.forEach((s,i)=>{ const div=document.createElement('div'); div.className='scene'; div.innerHTML=`<strong>Scene ${i+1}</strong><p>${s}</p><img src="https://placehold.co/600x400/png?text=${encodeURIComponent(s.slice(0,20))}" style="width:100%;margin-top:8px"/>`; tl.appendChild(div); }); });

/* ---------- VIDEO EDITOR (manual) ---------- */
const imports = document.getElementById('video-import');
const timelineEditor = document.getElementById('timeline-editor');
let importedImages = []; // {id,url,file}
let vidScenes = []; // {id,image,duration,transition,audioUrl}

imports.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files || []);
  files.forEach(f=>{ const url = URL.createObjectURL(f); const id = uid(); importedImages.push({id,url,file:f}); const card = document.createElement('div'); card.className='gallery-card'; card.innerHTML = `<img src="${url}"><div style="display:flex;gap:8px"><button class="drag-btn" draggable="true" data-id="${id}">Drag to Timeline</button><button onclick="downloadUrl('${url}')">Download</button></div>`; document.getElementById('section-video').querySelector('.panel-card').after(card); card.querySelector('.drag-btn').addEventListener('dragstart', (ev)=>{ ev.dataTransfer.setData('text/plain', id); }); });
});

document.getElementById('add-to-timeline').addEventListener('click', ()=>{
  // add all imported images to timeline
  importedImages.forEach(img=> addVidScene({image:img.url}));
  renderTimelineEditor();
});

function addVidScene(opts={}){
  const id = uid();
  const s = {id, image: opts.image || 'https://placehold.co/600x400/png?text=Empty', duration: opts.duration||parseInt(document.getElementById('default-duration').value)||3, transition: opts.transition||document.getElementById('default-transition').value, audioUrl: null};
  vidScenes.push(s); renderTimelineEditor();
}

function renderTimelineEditor(){
  timelineEditor.innerHTML='';
  vidScenes.forEach(s=>{
    const slot = document.createElement('div'); slot.className='timeline-slot'; slot.dataset.id = s.id;
    slot.innerHTML = `<img src="${s.image}"><div style="font-size:13px;color:#9fb3c8">Dur: ${s.duration}s</div><div style="display:flex;gap:6px"><button class="edit-slot">Edit</button><button class="delete-slot">Delete</button><button class="download-slot">Download</button></div>`;
    timelineEditor.appendChild(slot);
    slot.querySelector('.edit-slot').addEventListener('click', ()=> selectVidScene(s.id));
    slot.querySelector('.delete-slot').addEventListener('click', ()=> { vidScenes = vidScenes.filter(x=>x.id!==s.id); renderTimelineEditor(); });
    slot.querySelector('.download-slot').addEventListener('click', ()=> downloadUrl(s.image));
    // allow drop to replace
    slot.addEventListener('dragover', ev=> ev.preventDefault());
    slot.addEventListener('drop', ev=>{ ev.preventDefault(); const imgId = ev.dataTransfer.getData('text/plain'); const im = importedImages.find(x=>x.id===imgId); if(im){ s.image = im.url; renderTimelineEditor(); } });
  });
}

function selectVidScene(id){
  const s = vidScenes.find(x=>x.id===id); if(!s) return; document.getElementById('vid-selected-info').innerHTML = `<img src="${s.image}" style="width:100%;border-radius:6px"><div style="margin-top:8px">Transition: ${s.transition} • ${s.duration}s</div>`;
  document.getElementById('vid-duration').value = s.duration; document.getElementById('vid-transition').value = s.transition;
  document.getElementById('save-vid-scene').onclick = ()=>{ s.duration = parseInt(document.getElementById('vid-duration').value)||s.duration; s.transition = document.getElementById('vid-transition').value; renderTimelineEditor(); };
  document.getElementById('delete-vid-scene').onclick = ()=>{ vidScenes = vidScenes.filter(x=>x.id!==s.id); renderTimelineEditor(); document.getElementById('vid-selected-info').innerHTML='No scene selected'; };
  document.getElementById('vid-replace-image').onchange = (e)=>{ const f = e.target.files[0]; if(!f) return; const url = URL.createObjectURL(f); s.image = url; renderTimelineEditor(); };
}

document.getElementById('add-scene-manual').addEventListener('click', ()=> addVidScene({}));
document.getElementById('clear-timeline').addEventListener('click', ()=>{ if(confirm('Clear timeline?')){ vidScenes=[]; renderTimelineEditor(); } });

// Preview video: simple sequential display with audio (no transitions effects rendering)
document.getElementById('preview-video').addEventListener('click', async ()=>{
  if(vidScenes.length===0) return alert('No scenes in timeline');
  const overlay = document.createElement('div'); overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,0.9)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='9999';
  const player = document.createElement('div'); player.style.width='80%'; player.style.maxWidth='980px'; player.style.background='#041018'; player.style.padding='16px'; player.style.borderRadius='12px'; overlay.appendChild(player);
  const closeBtn = document.createElement('button'); closeBtn.textContent='Close'; closeBtn.className='primary'; closeBtn.style.marginBottom='10px'; closeBtn.onclick = ()=> document.body.removeChild(overlay);
  player.appendChild(closeBtn);
  const imgEl = document.createElement('img'); imgEl.style.width='100%'; imgEl.style.borderRadius='8px'; player.appendChild(imgEl);
  document.body.appendChild(overlay);
  for(const s of vidScenes){
    imgEl.src = s.image;
    if(s.audioUrl){ const a = new Audio(s.audioUrl); a.play(); }
    await new Promise(r=>setTimeout(r, (s.duration||3)*1000));
  }
  document.body.removeChild(overlay);
});

document.getElementById('export-video').addEventListener('click', ()=>{ if(vidScenes.length===0) return alert('No scenes'); // create manifest for backend
  const manifest = { scenes: vidScenes, settings: collectSettings() }; const blob = new Blob([JSON.stringify(manifest, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='video_manifest.json'; a.click(); URL.revokeObjectURL(url); alert('Manifest saved — use Colab backend to stitch MP4.'); });

/* ---------- VOICE ---------- */
document.getElementById('generate-voice').addEventListener('click', ()=>{
  const txt = document.getElementById('voice-text').value.trim(); if(!txt) return alert('Enter text'); // placeholder TTS
  const audio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; document.getElementById('voice-result').classList.remove('hidden'); document.getElementById('voice-player').src = audio; document.getElementById('voice-download').href = audio; alert('TTS generated (placeholder)'); });

/* ---------- Utility: download URL ---------- */
function downloadUrl(url){ const a = document.createElement('a'); a.href = url; a.download = url.split('/').pop().split('?')[0] || 'download.png'; document.body.appendChild(a); a.click(); a.remove(); }

/* ---------- Demo content init ---------- */
(function(){ addSceneToStudio({image:'https://placehold.co/600x400/png?text=Demo+1', text:'Demo scene 1'}); addSceneToStudio({image:'https://placehold.co/600x400/png?text=Demo+2', text:'Demo scene 2'}); renderStores(); window.Scenes = []; })();
/* helper used by many features */
function addSceneToStudio(obj){ window.Scenes = window.Scenes || []; const s = {id: uid(), image: obj.image || 'https://placehold.co/600x400/png?text=Scene', text: obj.text||'', duration:3, transition:'cut', audioUrl:null}; window.Scenes.push(s); const tl = document.getElementById('studio-timeline'); const div = document.createElement('div'); div.className='scene'; div.innerHTML = `<strong>Scene</strong><p>${s.text}</p><img src="${s.image}" style="width:100%;margin-top:8px"/>`; tl.appendChild(div); }
