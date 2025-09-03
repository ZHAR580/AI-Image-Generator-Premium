// Frontend interactive behavior with placeholders for backend integration
const modeButtons = document.querySelectorAll('.mode-btn');
const modeTitle = document.getElementById('mode-title');
const refUpload = document.getElementById('reference-upload');
const promptBox = document.getElementById('prompt');
const generateBtn = document.getElementById('generate');
const generateStoryBtn = document.getElementById('generate-story');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const regenerateBtn = document.getElementById('regenerate');
const downloadBtn = document.getElementById('download');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const ttsPreview = document.getElementById('tts-preview');

let currentMode = 'normal';
let lastImages = [];

// Mode switch handlers
modeButtons.forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.mode-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    currentMode = b.dataset.mode;
    modeTitle.innerText = (currentMode.charAt(0).toUpperCase()+currentMode.slice(1)) + ' Mode';
    refUpload.style.display = (currentMode==='reference') ? 'block' : 'none';
  });
});

// Helper to simulate backend response (placeholder)
function fakeFetchImages(prompt, variations, size){
  // creates placeholder colored images via placehold.co
  const arr = [];
  for(let i=0;i<variations;i++){
    const src = 'https://placehold.co/' + size.replace('x','/') + '?text=' + encodeURIComponent(prompt + ' ' + (i+1));
    arr.push(src);
  }
  return Promise.resolve({images: arr});
}

// Generate images (calls backend in real setup)
generateBtn.addEventListener('click', async ()=>{
  const prompt = promptBox.value.trim();
  if(!prompt){ alert('Please enter a prompt'); return; }
  const variations = parseInt(document.getElementById('variations').value);
  const size = document.getElementById('size').value;
  gallery.innerHTML = '';
  // show progress
  progress.style.display = 'block';
  progressBar.style.width = '20%';
  progressText.innerText = 'Starting generation...';
  // fake call - replace with real fetch to Colab/ngrok endpoint
  const res = await fakeFetchImages(prompt, variations, size);
  // update progress
  progressBar.style.width = '80%';
  progressText.innerText = 'Finalizing...';
  setTimeout(()=>{
    progress.style.display = 'none';
    progressBar.style.width = '0%';
    progressText.innerText = '';
    lastImages = res.images;
    res.images.forEach(src=>{
      const img = document.createElement('img');
      img.src = src;
      img.onclick = ()=> openModal(src);
      gallery.appendChild(img);
    });
  }, 800);
});

// Story generation placeholder
generateStoryBtn.addEventListener('click', ()=>{
  alert('Story generation will generate 100 images scene-by-scene. Connect backend to enable.');
});

// Modal behavior
function openModal(src){
  modal.classList.remove('hidden');
  modalImg.src = src;
}
modalClose.addEventListener('click', ()=> modal.classList.add('hidden'));

regenerateBtn.addEventListener('click', ()=>{
  alert('Regenerate: This will call backend to re-create this image with same prompt and model.');
});

downloadBtn.addEventListener('click', ()=>{
  const a = document.createElement('a');
  a.href = modalImg.src;
  a.download = 'image.png';
  a.click();
});

// TTS preview placeholder
ttsPreview.addEventListener('click', ()=>{
  alert('TTS preview will play generated narration (backend integration required).');
});
