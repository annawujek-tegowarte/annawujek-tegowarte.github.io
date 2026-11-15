(()=>{
const dialog=document.querySelector('.film-dialog');
if(!dialog)return;
const player=dialog.querySelector('video');
const title=dialog.querySelector('#film-title');
const error=dialog.querySelector('.film-error');
let opener;
const controls=document.createElement('div');
controls.className='clip-controls';
controls.innerHTML='<button type="button" class="clip-toggle" aria-label="Odtwórz">▶</button><span class="clip-time">0:00 / 0:00</span><input class="clip-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Pozycja filmu">';
const volume=document.createElement('div');
volume.className='clip-volume';
volume.innerHTML='<button type="button" class="clip-mute" aria-label="Wycisz">'+
 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="volume-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button>'+
 '<input class="clip-volume-slider" type="range" min="0" max="1" step="0.01" value="1" aria-label="Głośność">';
dialog.append(controls);
controls.append(volume);
const toggle=controls.querySelector('.clip-toggle');
const seek=controls.querySelector('.clip-seek');
const clock=controls.querySelector('.clip-time');
const mute=volume.querySelector('.clip-mute');
const volumeSlider=volume.querySelector('input');
function formatTime(value){
 if(!Number.isFinite(value))return '0:00';
 return Math.floor(value/60)+':'+String(Math.floor(value%60)).padStart(2,'0');
}
function syncTime(){
 const duration=Number.isFinite(player.duration)?player.duration:0;
 seek.value=duration?player.currentTime/duration*100:0;
 seek.disabled=!duration;
 clock.textContent=formatTime(player.currentTime)+' / '+formatTime(duration);
}
function togglePlayback(){if(player.paused)player.play().catch(()=>{});else player.pause();}
toggle.addEventListener('click',togglePlayback);
player.addEventListener('click',togglePlayback);
player.addEventListener('play',()=>{toggle.textContent='Ⅱ';toggle.setAttribute('aria-label','Wstrzymaj');});
player.addEventListener('pause',()=>{toggle.textContent='▶';toggle.setAttribute('aria-label','Odtwórz');});
player.addEventListener('timeupdate',syncTime);
player.addEventListener('loadedmetadata',syncTime);
player.addEventListener('emptied',syncTime);
seek.addEventListener('input',()=>{if(Number.isFinite(player.duration))player.currentTime=Number(seek.value)/100*player.duration;});
volumeSlider.addEventListener('input',()=>{player.volume=Number(volumeSlider.value);player.muted=player.volume===0;});
mute.setAttribute('aria-label','Głośność');
mute.setAttribute('aria-expanded','false');
mute.addEventListener('click',()=>{
 const expanded=volume.classList.toggle('is-expanded');
 mute.setAttribute('aria-expanded',String(expanded));
});
dialog.addEventListener('close',()=>{
 volume.classList.remove('is-expanded');
 mute.setAttribute('aria-expanded','false');
});
player.addEventListener('volumechange',()=>{
 const silent=player.muted||player.volume===0;
 volumeSlider.value=silent?0:player.volume;
 mute.setAttribute('aria-label',silent?'Głośność - dźwięk wyciszony':'Głośność');
 mute.querySelector('.volume-waves').style.opacity=silent?'0':'1';
});
player.controls=false;
syncTime();
function close(){dialog.close();}
function fitPlayer(){
 if(!dialog.open)return;
 const ratio=player.videoWidth&&player.videoHeight?player.videoWidth/player.videoHeight:9/16;
 const availableHeight=Math.max(100,window.innerHeight*.94-2);
 const width=Math.min(window.innerWidth-34,800,availableHeight*ratio);
 player.style.width=width+'px';
 player.style.height=(width/ratio)+'px';
 dialog.style.width=(width+2)+'px';
}
player.addEventListener('loadedmetadata',fitPlayer);
window.addEventListener('resize',fitPlayer);
document.querySelectorAll('.film-preview').forEach(button=>button.addEventListener('click',()=>{
 opener=button; title.textContent=button.dataset.title; error.hidden=true;
 player.src=button.dataset.video;
 error.querySelector('a').href=button.dataset.video;
 dialog.showModal(); document.documentElement.classList.add('film-is-open'); fitPlayer();
 player.play().catch(()=>{});
}));
dialog.querySelector('.film-close').addEventListener('click',close);
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.documentElement.classList.remove('film-is-open');if(opener)opener.focus();});
player.addEventListener('error',()=>{if(player.getAttribute('src'))error.hidden=false;});


const fullscreenButton=dialog.querySelector('.film-fullscreen');
function nativeFullscreen(){
 if(player.webkitEnterFullscreen){
  player.controls=true;
  try{player.webkitEnterFullscreen();return true;}
  catch(error){player.controls=false;}
 }
 return false;
}
fullscreenButton.hidden=!(player.requestFullscreen||player.webkitRequestFullscreen||player.webkitEnterFullscreen);
fullscreenButton.addEventListener('click',()=>{
 // Safari's native video presentation also works on iPhone.
 if(nativeFullscreen())return;
 const request=player.requestFullscreen||player.webkitRequestFullscreen;
 if(!request)return;
 player.controls=true;
 try{
  Promise.resolve(request.call(player)).catch(()=>{
   player.controls=false;
   fullscreenButton.textContent='Pełny ekran niedostępny';
  });
 }catch(error){
  player.controls=false;
  fullscreenButton.textContent='Pełny ekran niedostępny';
 }
});
function syncFullscreen(){
 const active=document.fullscreenElement||document.webkitFullscreenElement;
 player.controls=active===player||Boolean(player.webkitDisplayingFullscreen);
}
document.addEventListener('fullscreenchange',syncFullscreen);
document.addEventListener('webkitfullscreenchange',syncFullscreen);
player.addEventListener('webkitbeginfullscreen',()=>{player.controls=true;});
player.addEventListener('webkitendfullscreen',()=>{player.controls=false;});
dialog.addEventListener('close',()=>{
 player.controls=false;
 fullscreenButton.textContent='Pełny ekran';
});
})();
