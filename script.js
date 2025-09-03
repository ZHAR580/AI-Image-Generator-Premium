// Final frontend script with Voice Studio UI behavior and placeholders for backend integration
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
const studioWorkspace = document.getElementById('studio-workspace');
const studioScript = document.getElementById('studio-script');
const runStudioBtn = document.getElementById('run-studio');
const studioTimeline = document.getElementById('studio-timeline');

// Voice panel elements
const openVoicePanelBtn = document.getElementById('open-voice-panel');
const voicePanel = document.getElementById('voice-panel');
const closeVoiceBtn = document.getElementById('close-voice');
const voiceModel = document.getElementById('voice-model');
const voiceStyle = document.getElementById('voice-style');
const voiceSpeed = document.getElementById('voice-speed');
const voicePitch = document.getElementById('voice-pitch');
const voiceText = document.getElementById('voice-text');
const voicePreviewBtn = document.getElementById('voice-preview');
const voiceGenerateBtn = document.getElementById('voice-generate');
const voicePlayerDiv = document.getElementById('voice-player');
const audioPreview = document.getElementById('audio-preview');
const downloadAudioLink = document.getElementById('download-audio');

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
    // show/hide studio workspace
    if(currentMode==='studio'){
      studioWorkspace.classList.remove('hidden');
    } else {
      studioWorkspace.classList.add('hidden');
    }
  });
});

// Helper to simulate backend response (placeholder)
function fakeFetchImages(prompt, variations, size){
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
  progress.style.display = 'block';
  progressBar.style.width = '10%';
  progressText.innerText = 'Starting generation...';
  const res = await fakeFetchImages(prompt, variations, size);
  progressBar.style.width = '70%';
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
  }, 900);
});

// Story generation placeholder
generateStoryBtn.addEventListener('click', ()=>{
  alert('Story generation will generate multiple images scene-by-scene. Connect backend to enable.');
});

// Studio run (placeholder)
runStudioBtn.addEventListener('click', async ()=>{
  const script = studioScript.value.trim();
  const scenes = parseInt(document.getElementById('studio-scenes').value) || 10;
  if(!script){ alert('Please paste your script'); return; }
  studioTimeline.innerHTML = '';
  progress.style.display = 'block';
  progressBar.style.width = '10%';
  progressText.innerText = 'Splitting script into scenes...';
  // Placeholder: split script into scenes by sentences (very naive)
  const sentences = script.split(/(?<=[.?!])\s+/).slice(0, scenes);
  progressBar.style.width = '30%';
  progressText.innerText = 'Generating scene images...';
  // fake generate per scene
  for(let i=0;i<sentences.length;i++){
    const sceneText = sentences[i] || ('Scene ' + (i+1));
    // fake image url
    const src = 'https://placehold.co/600x400?text=' + encodeURIComponent(sceneText);
    const div = document.createElement('div');
    div.className = 'scene';
    div.innerHTML = `<strong>Scene ${i+1}</strong><p>${sceneText}</p><img src="${src}" style="width:100%;margin-top:8px"/><div style="margin-top:8px"><button onclick="regenerateScene(this, ${i})">Regenerate</button> <button onclick="downloadImage('${src}')">Download</button></div>`;
    studioTimeline.appendChild(div);
    progressBar.style.width = `${30 + Math.round((i+1)/sentences.length*50)}%`;
    await new Promise(r=>setTimeout(r, 200)); // simulate time
  }
  progressBar.style.width = '100%';
  progressText.innerText = 'Studio generation complete.';
  setTimeout(()=>{ progress.style.display='none'; progressBar.style.width='0%'; progressText.innerText=''; }, 1000);
});

function regenerateScene(btn, idx){
  alert('Regenerate scene ' + (idx+1) + ' (will call backend).');
}

function downloadImage(src){
  const a = document.createElement('a'); a.href = src; a.download = 'scene.png'; a.click();
}

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

// Voice panel handlers (placeholders)
openVoicePanelBtn.addEventListener('click', ()=>{
  voicePanel.classList.remove('hidden');
  // pre-fill voice text from script if empty
  if(!voiceText.value.trim()){
    const s = document.getElementById('script').value.trim();
    voiceText.value = s || 'Enter narration text here...';
  }
});

closeVoiceBtn.addEventListener('click', ()=> voicePanel.classList.add('hidden'));

voicePreviewBtn.addEventListener('click', ()=>{
  const txt = voiceText.value.trim();
  if(!txt){ alert('Please enter text to preview'); return; }
  alert('Voice preview will be generated by backend TTS model. This is a placeholder.');
  // placeholder: create a small TTS demo using Web Speech (client-side) if available
  if('speechSynthesis' in window){
    const utter = new SpeechSynthesisUtterance(txt);
    utter.rate = parseFloat(voiceSpeed.value);
    utter.pitch = parseFloat(voicePitch.value);
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
    // show pseudo-player
    voicePlayerDiv.classList.remove('hidden');
    audioPreview.src = '';
  } else {
    alert('No client TTS available. Connect backend for high-quality preview.');
  }
});

voiceGenerateBtn.addEventListener('click', ()=>{
  const txt = voiceText.value.trim();
  if(!txt){ alert('Please enter text to generate audio'); return; }
  alert('Generate & Download will call backend TTS and return an audio file. This is a placeholder.');
  // in real setup, call /tts_preview or /generate_audio and then set audioPreview.src and download link
  // simulate a generated audio URL (not real)
  voicePlayerDiv.classList.remove('hidden');
  audioPreview.src = 'https://cdn.simpleicons.org/soundcloud/ff5e00'; // placeholder image as src won't play; backend required
  downloadAudioLink.href = '#';
  downloadAudioLink.removeAttribute('download');
});
