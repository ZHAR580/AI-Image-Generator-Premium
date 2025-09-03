/* Premium UI JS — inline voice workspace (no popups) and placeholders for backend calls */

const modeButtons = document.querySelectorAll('.mode-btn');
const modeTitle = document.getElementById('mode-title');

const normalPanel = document.getElementById('normal-panel');
const studioPanel = document.getElementById('studio-panel');
const voicePanel = document.getElementById('voice-panel');

const prompt = document.getElementById('prompt');
const generateBtn = document.getElementById('generate');
const variations = document.getElementById('variations');
const size = document.getElementById('size');
const model = document.getElementById('model');

const gallery = document.getElementById('gallery');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const studioScript = document.getElementById('studio-script');
const runStudio = document.getElementById('run-studio');
const studioTimeline = document.getElementById('studio-timeline');

const voiceText = document.getElementById('voice-text');
const voiceModel = document.getElementById('voice-model');
const voiceStyle = document.getElementById('voice-style');
const voiceSpeed = document.getElementById('voice-speed');
const voicePitch = document.getElementById('voice-pitch');
const generateVoice = document.getElementById('generate-voice');
const voiceResult = document.getElementById('voice-result');
const voicePlayer = document.getElementById('voice-player');
const voiceDownload = document.getElementById('voice-download');

function hideAllPanels(){
  normalPanel?.classList.add('hidden');
  studioPanel?.classList.add('hidden');
  voicePanel?.classList.add('hidden');
  document.getElementById('gallery').classList.remove('hidden');
}

modeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    modeButtons.forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    modeTitle.innerText = mode.charAt(0).toUpperCase() + mode.slice(1);
    hideAllPanels();
    if(mode === 'normal'){ normalPanel.classList.remove('hidden'); }
    if(mode === 'studio'){ studioPanel.classList.remove('hidden'); }
    if(mode === 'voice'){ voicePanel.classList.remove('hidden'); }
    // (reference/settings handled similarly if added)
  });
});

/* --- Placeholder: fake image generation (replace with backend) --- */
function fakeGenerate(promptText, count, sizeVal){
  const arr = [];
  for(let i=0;i<count;i++){
    arr.push(`https://placehold.co/${sizeVal.replace('x','/')}/png?text=${encodeURIComponent(promptText+' '+(i+1))}`);
  }
  return arr;
}

generateBtn.addEventListener('click', async ()=>{
  const p = prompt.value.trim();
  if(!p){ alert('Enter prompt'); return; }
  const count = parseInt(variations.value||1);
  const sz = size.value||'512x512';
  gallery.innerHTML = '';
  progress.classList.remove('hidden'); progressBar.style.width = '10%'; progressText.innerText = 'Generating...';
  // simulate
  await new Promise(r=>setTimeout(r, 600));
  const imgs = fakeGenerate(p, count, sz);
  progressBar.style.width = '80%'; progressText.innerText = 'Finalizing...';
  await new Promise(r=>setTimeout(r, 450));
  progress.classList.add('hidden'); progressBar.style.width='0'; progressText.innerText='';
  // show
  imgs.forEach(u=>{
    const card = document.createElement('div'); card.className='gallery-card';
    card.innerHTML = `<img src="${u}" alt="img">`;
    gallery.appendChild(card);
  });
});

/* --- Studio (script -> scenes) --- */
runStudio.addEventListener('click', async ()=>{
  const text = studioScript.value.trim();
  const n = parseInt(document.getElementById('studio-scenes').value||10);
  if(!text){ alert('Paste your script'); return; }
  studioTimeline.innerHTML = ''; progress.classList.remove('hidden'); progressBar.style.width='10%';
  const sentences = text.split(/(?<=[.?!])\s+/).slice(0,n);
  for(let i=0;i<sentences.length;i++){
    progressBar.style.width = 10 + Math.round((i+1)/sentences.length*70) + '%';
    // fake image
    await new Promise(r=>setTimeout(r,200));
    const src = `https://placehold.co/600x400/png?text=${encodeURIComponent(sentences[i]||'Scene '+(i+1))}`;
    const s = document.createElement('div'); s.className='scene';
    s.innerHTML = `<strong>Scene ${i+1}</strong><p>${sentences[i]||''}</p><img src="${src}" style="width:100%;margin-top:8px">`;
    studioTimeline.appendChild(s);
  }
  progress.classList.add('hidden'); progressBar.style.width='0';
});

/* --- Voice (inline) --- */
/* Note: this is placeholder behavior; connect to backend TTS for real audio */
generateVoice?.addEventListener('click', ()=>{
  const txt = voiceText.value.trim();
  if(!txt){ alert('Enter voice text'); return; }
  voiceResult.classList.remove('hidden');
  voicePlayer.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // demo audio
  voicePlayer.classList.remove('hidden');
  voicePlayer.play();
  voiceDownload.href = voicePlayer.src;
});

/* --- Utility: download zip placeholder (replace with real zip of images) --- */
document.getElementById('download-zip')?.addEventListener('click', ()=>{
  alert('Download ZIP will collect approved images. Replace this with backend zip endpoint.');
});
