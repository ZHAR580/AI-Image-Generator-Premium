/* Frontend-only Stores Bulk UI (placeholders) */
const modeButtons = document.querySelectorAll('.mode-btn');
const modeTitle = document.getElementById('mode-title');
const storesContainer = document.getElementById('stores-container');
const addStoreBtn = document.getElementById('add-store');
const newStoreName = document.getElementById('new-store-name');
const selectedStorePanel = document.getElementById('selected-store-panel');
const storeControls = document.getElementById('store-controls');
const storePrompt = document.getElementById('store-prompt');
const storeCsv = document.getElementById('store-csv');
const storeCount = document.getElementById('store-count');
const storeSize = document.getElementById('store-size');
const storeModel = document.getElementById('store-model');
const generateStoreBtn = document.getElementById('generate-store');
const downloadStoreZipBtn = document.getElementById('download-store-zip');
const clearStoreImagesBtn = document.getElementById('clear-store-images');
const gallery = document.getElementById('gallery');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const bulkQueue = document.getElementById('bulk-queue');

let stores = {}; // {id: {name, images: [{url,product}], products: []}}
let selectedStoreId = null;

/* Panel switching simple */
modeButtons.forEach(b=>b.addEventListener('click', ()=>{modeButtons.forEach(x=>x.classList.remove('active'));b.classList.add('active');const mode=b.dataset.mode;modeTitle.innerText = mode.charAt(0).toUpperCase()+mode.slice(1);document.getElementById('stores-panel').classList.remove('hidden');}));

function uid(){return 'st'+Math.random().toString(36).slice(2,9);}

function renderStoresList(){
  storesContainer.innerHTML='';
  Object.values(stores).forEach(s=>{
    const div = document.createElement('div');
    div.className='store-item';
    div.innerHTML = `<strong>${s.name}</strong> <button class="select-store" data-id="${s.id}">Select</button> <button class="del-store" data-id="${s.id}">Delete</button> <div style="font-size:12px;color:#9fb3c8">${s.images.length||0} images</div>`;
    storesContainer.appendChild(div);
  });
  // bind events
  document.querySelectorAll('.select-store').forEach(btn=>btn.addEventListener('click', ()=> selectStore(btn.dataset.id)));
  document.querySelectorAll('.del-store').forEach(btn=>btn.addEventListener('click', ()=> { if(confirm('Delete store?')){ delete stores[btn.dataset.id]; renderStoresList(); gallery.innerHTML=''; storeControls.classList.add('hidden'); } }));
}

addStoreBtn.addEventListener('click', ()=>{
  const name = newStoreName.value.trim(); if(!name){ alert('Enter store name'); return; }
  const id = uid(); stores[id] = {id, name, images:[], products:[]}; newStoreName.value=''; renderStoresList();
});

function selectStore(id){
  selectedStoreId = id; const s = stores[id]; selectedStorePanel.innerHTML = `<h4>${s.name}</h4><div>${s.images.length} images</div>`; storeControls.classList.remove('hidden'); renderGalleryForStore(id);
}

function renderGalleryForStore(id){
  gallery.innerHTML=''; const s=stores[id]; if(!s) return;
  s.images.forEach((img,idx)=>{
    const card = document.createElement('div'); card.className='gallery-card'; card.innerHTML = `<img src="${img.url}"><div style="display:flex;gap:8px"><button class="btn-download" data-idx="${idx}">Download</button><button class="btn-remove" data-idx="${idx}">Remove</button></div><div style="font-size:13px;color:#9fb3c8">${img.product||''}</div>`;
    gallery.appendChild(card);
  });
  document.querySelectorAll('.btn-download').forEach(b=>b.addEventListener('click', ()=> downloadUrl(stores[id].images[b.dataset.idx].url)));
  document.querySelectorAll('.btn-remove').forEach(b=>{ b.addEventListener('click', ()=> { if(confirm('Remove image?')){ stores[id].images.splice(b.dataset.idx,1); renderGalleryForStore(id); renderStoresList(); } }); });
}

/* Read CSV (simple) */
function parseCSV(file, cb){
  const reader = new FileReader();
  reader.onload = function(){ const text = reader.result; const lines = text.split('\n').map(l=>l.trim()).filter(Boolean); const products = lines.map(l=> l.split(',')[0].trim()); cb(products); };
  reader.readAsText(file);
}

/* Generate bulk for store (placeholder images) */
generateStoreBtn.addEventListener('click', async ()=>{
  if(!selectedStoreId){ alert('Select a store'); return; }
  const s = stores[selectedStoreId];
  const prompt = storePrompt.value.trim() || ('Product photo at '+ s.name);
  const countPer = parseInt(storeCount.value)||1;
  // read CSV products if uploaded
  let products = [];
  if(storeCsv.files.length){
    parseCSV(storeCsv.files[0], (p)=>{ products = p; doGenerate(); });
  } else { doGenerate(); }

  async function doGenerate(){
    showProgress('Generating bulk images...');
    const total = Math.max(1, products.length) * countPer;
    let done = 0;
    if(products.length===0) products = ['default'];
    for(const prod of products){
      for(let i=0;i<countPer;i++){
        // placeholder image URL using placehold.co
        const url = `https://placehold.co/512x512/png?text=${encodeURIComponent(s.name+'-'+prod+'-'+(i+1))}`;
        s.images.push({url, product: prod});
        done++; progressBar.style.width = Math.round(done/total*90)+'%';
        await new Promise(r=>setTimeout(r, 200)); // simulate time per image
      }
    }
    hideProgress(); renderGalleryForStore(selectedStoreId); renderStoresList();
    // add to bulk queue
    const q = document.createElement('div'); q.innerText = `Generated ${s.images.length} images for store ${s.name}`; bulkQueue.appendChild(q);
    alert('Bulk generation finished (placeholders). Connect backend for real images.');
  }
});

/* Download ZIP for a store: create zip by requesting backend or using pre-signed urls
   Here we create client-side zip using fetch of images and JSZip is not available offline.
   Instead we will create a fake zip link (instructions) and also provide option to download images individually.
*/
downloadStoreZipBtn.addEventListener('click', ()=>{
  if(!selectedStoreId){ alert('Select a store'); return; }
  const s = stores[selectedStoreId];
  if(s.images.length===0){ alert('No images to zip'); return; }
  // Create a JSON manifest and prompt user to run backend to package, or download individually
  const manifest = { store: s.name, count: s.images.length, images: s.images };
  const blob = new Blob([JSON.stringify(manifest, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${s.name}_manifest.json`; a.click(); URL.revokeObjectURL(url);
  alert('Manifest downloaded. To create a ZIP of actual images, run the backend zip process with this manifest.');
});

clearStoreImagesBtn.addEventListener('click', ()=>{ if(!selectedStoreId){ alert('Select a store'); return; } if(confirm('Clear all images for this store?')){ stores[selectedStoreId].images=[]; renderGalleryForStore(selectedStoreId); renderStoresList(); } });

/* Utility: download URL */
function downloadUrl(url){ const a=document.createElement('a'); a.href=url; a.download = url.split('/').pop().split('?')[0] || 'image.png'; document.body.appendChild(a); a.click(); a.remove(); }

/* Progress */
function showProgress(t){ progress.classList.remove('hidden'); progressText.innerText = t; progressBar.style.width='10%'; }
function hideProgress(){ progress.classList.add('hidden'); progressBar.style.width='0'; progressText.innerText=''; }

/* Init demo store */
(function(){ const id = uid(); stores[id] = {id, name:'Demo Store', images:[], products:[]}; renderStoresList(); selectStore(id); })();
