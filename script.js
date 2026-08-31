// =====================================================
// Gina's Birthday Website — main script
// =====================================================

/* ---------- 0. Starfield background ---------- */
(function starfield(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  function makeStars(){
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      speed: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2
    }));
  }
  let t = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(const s of stars){
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed * 40 + s.phase);
      ctx.globalAlpha = 0.15 + twinkle * 0.65;
      ctx.fillStyle = '#f6efff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    t += 1;
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); makeStars(); });
  resize(); makeStars(); draw();
  // Re-measure once content loads (scroll height changes)
  setTimeout(() => { resize(); makeStars(); }, 800);
})();

/* ---------- 1. Opening particles ---------- */
(function openingParticles(){
  const wrap = document.querySelector('.floating-particles');
  if(!wrap) return;
  for(let i=0;i<28;i++){
    const p = document.createElement('span');
    const size = Math.random()*3+1;
    p.style.cssText = `
      position:absolute; border-radius:50%; background:#e9bd6f;
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      opacity:${Math.random()*0.6+0.2};
      box-shadow:0 0 ${size*3}px #ffd68a;
      animation: driftParticle ${6+Math.random()*8}s ease-in-out ${Math.random()*4}s infinite;
    `;
    wrap.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes driftParticle{
    0%,100%{ transform:translateY(0) translateX(0); }
    50%{ transform:translateY(-30px) translateX(12px); }
  }`;
  document.head.appendChild(style);
})();

/* ---------- 2. Open the surprise ---------- */
const openingScreen = document.getElementById('opening');
const openBtn = document.getElementById('openSurpriseBtn');
const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');

openBtn.addEventListener('click', () => {
  openingScreen.classList.add('hide');
  document.body.style.overflow = 'auto';
  launchBalloons();
  fadeInMusic();
  setTimeout(() => {
    document.getElementById('revealScreen').scrollIntoView({behavior:'smooth'});
  }, 300);
});

// lock scroll until opened
document.body.style.overflow = 'hidden';

// Try to auto-start the music the instant the site opens. Browsers block
// autoplay-with-sound until the person has interacted with the page at least
// once, so if this attempt is blocked, music kicks in on the very first
// tap/click/keypress anywhere on the site (not just the surprise button).
// Deferred one tick so every variable below has finished initializing first.
setTimeout(() => {
  fadeInMusic();
  armFirstInteractionFallback();
}, 0);
function armFirstInteractionFallback(){
  const start = () => {
    if(!musicStarted) fadeInMusic();
    document.removeEventListener('pointerdown', start);
    document.removeEventListener('keydown', start);
    document.removeEventListener('touchstart', start);
  };
  document.addEventListener('pointerdown', start, {once:true});
  document.addEventListener('keydown', start, {once:true});
  document.addEventListener('touchstart', start, {once:true});
}
armFirstInteractionFallback();

document.getElementById('scrollCue').addEventListener('click', () => {
  document.getElementById('excitedScreen').scrollIntoView({behavior:'smooth'});
});

/* ---------- 2b. "Are you excited?" dodge game ---------- */
(function excitedDodgeGame(){
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const stage = document.getElementById('dodgeStage');
  const hint = document.getElementById('dodgeHint');
  if(!noBtn || !yesBtn || !stage) return;

  const hints = [
    "hmm, are you sure? 👀",
    "come on, tap Yes instead 😄",
    "the button doesn't want to be caught!",
    "okay okay, just say yes already 😅",
    "it's basically begging you to click Yes now"
  ];
  let dodgeCount = 0;

  function dodge(e){
    if(e.cancelable) e.preventDefault();
    dodgeCount++;
    noBtn.classList.add('dodging');
    const stageRect = stage.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(stageRect.width - btnRect.width, 10);
    const maxY = Math.max(stageRect.height - btnRect.height, 10);
    noBtn.style.left = (Math.random() * maxX) + 'px';
    noBtn.style.top = (Math.random() * maxY) + 'px';

    const scale = Math.min(1 + dodgeCount * 0.08, 1.7);
    yesBtn.style.transform = `translate(-50%,-50%) scale(${scale})`;

    hint.textContent = hints[Math.min(dodgeCount - 1, hints.length - 1)];
  }

  noBtn.addEventListener('pointerenter', dodge);
  noBtn.addEventListener('touchstart', dodge, {passive:false});
  noBtn.addEventListener('click', dodge);

  yesBtn.addEventListener('click', () => {
    document.getElementById('gallery').scrollIntoView({behavior:'smooth'});
  });
})();

/* ---------- 3. Balloons ---------- */
function launchBalloons(){
  const wrap = document.getElementById('balloons');
  const colors = ['#e6a3b8','#e9bd6f','#b49bde','#ffd68a','#d98ea0'];
  for(let i=0;i<16;i++){
    const b = document.createElement('div');
    b.className = 'balloon';
    const left = Math.random()*96;
    const dur = 9 + Math.random()*7;
    const delay = Math.random()*4;
    const drift = (Math.random()*80-40) + 'px';
    const rot = (Math.random()*30-15) + 'deg';
    b.style.left = left+'%';
    b.style.background = `radial-gradient(circle at 35% 30%, #fff, ${colors[i%colors.length]})`;
    b.style.animationDuration = dur+'s';
    b.style.animationDelay = delay+'s';
    b.style.setProperty('--drift', drift);
    b.style.setProperty('--rot', rot);
    wrap.appendChild(b);
  }
}

/* ---------- 4. Music player ---------- */
let musicStarted = false;
let usingSynth = false;
let synthCtx, synthGain, synthInterval, synthPlaying = false, synthPlayNote = null;

function startSynthMusic(){
  if(synthCtx){ resumeSynth(); return; }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  synthCtx = new AudioCtx();
  synthGain = synthCtx.createGain();
  synthGain.gain.value = 0;
  synthGain.connect(synthCtx.destination);

  // A gentle, original, generative little melody (not a copyrighted tune) —
  // soft sine-wave arpeggio so there's always *something* warm playing
  // even before a real MP3 is dropped into assets/music/.
  const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // C major-ish, warm
  let idx = 0;
  synthPlayNote = function(){
    if(!synthCtx || synthCtx.state === 'closed') return;
    const freq = scale[idx % scale.length] * (idx % 5 === 0 ? 0.5 : 1);
    idx++;
    const osc = synthCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const noteGain = synthCtx.createGain();
    const now = synthCtx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    noteGain.gain.linearRampToValueAtTime(0, now + 1.3);
    osc.connect(noteGain);
    noteGain.connect(synthGain);
    osc.start(now);
    osc.stop(now + 1.35);
  };
  synthPlayNote();
  synthInterval = setInterval(synthPlayNote, 850);

  const targetVol = (document.getElementById('volumeSlider').value / 100) * 0.55;
  let v = 0;
  const fade = setInterval(() => {
    v += 0.03;
    synthGain.gain.value = Math.min(v, targetVol);
    if(v >= targetVol) clearInterval(fade);
  }, 100);

  synthPlaying = true;
  usingSynth = true;
  document.getElementById('musicToggle').classList.add('playing');
  document.getElementById('playPauseBtn').textContent = '⏸';
}
function pauseSynth(){
  if(!synthCtx) return;
  synthCtx.suspend();
  clearInterval(synthInterval);
  synthPlaying = false;
}
function resumeSynth(){
  if(!synthCtx) return;
  synthCtx.resume();
  clearInterval(synthInterval);
  if(synthPlayNote){
    synthPlayNote();
    synthInterval = setInterval(synthPlayNote, 850);
  }
  synthPlaying = true;
}

function fadeInMusic(){
  if(musicStarted) return;
  musicStarted = true;
  bgMusic.volume = 0;
  const playPromise = bgMusic.play();
  if(playPromise && playPromise.catch){
    playPromise.then(() => {
      // real file is playing — fade it in
      document.getElementById('musicToggle').classList.add('playing');
      document.getElementById('playPauseBtn').textContent = '⏸';
      let v = 0;
      const target = document.getElementById('volumeSlider').value / 100;
      const fade = setInterval(() => {
        v += 0.04;
        bgMusic.volume = Math.min(v, target);
        if(v >= target) clearInterval(fade);
      }, 120);
    }).catch(() => {
      // no music file yet (or blocked) — fall back to the gentle synth tune
      startSynthMusic();
    });
  }
}
document.getElementById('musicToggle').addEventListener('click', () => {
  musicPlayer.classList.toggle('expanded');
  if(!musicStarted) fadeInMusic();
});
document.getElementById('playPauseBtn').addEventListener('click', () => {
  if(usingSynth){
    if(synthPlaying){
      pauseSynth();
      document.getElementById('playPauseBtn').textContent = '▶';
      document.getElementById('musicToggle').classList.remove('playing');
    } else {
      startSynthMusic();
    }
    return;
  }
  if(bgMusic.paused){
    bgMusic.play().catch(()=>{});
    document.getElementById('playPauseBtn').textContent = '⏸';
    document.getElementById('musicToggle').classList.add('playing');
  } else {
    bgMusic.pause();
    document.getElementById('playPauseBtn').textContent = '▶';
    document.getElementById('musicToggle').classList.remove('playing');
  }
});
document.getElementById('volumeSlider').addEventListener('input', (e) => {
  const vol = e.target.value / 100;
  if(usingSynth && synthGain){
    synthGain.gain.value = vol * 0.55;
  } else {
    bgMusic.volume = vol;
  }
});

/* ---------- 5. Gallery lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
document.querySelectorAll('.polaroid').forEach(p => {
  p.addEventListener('click', () => {
    const img = p.querySelector('img');
    const caption = p.dataset.caption;
    lightboxFrame.innerHTML = '';
    if(img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0){
      const clone = img.cloneNode();
      clone.style.maxWidth = '70vw';
      clone.style.maxHeight = '65vh';
      lightboxFrame.appendChild(clone);
    } else {
      lightboxFrame.textContent = `"${caption}" — add this photo to assets/images/ to see it here.`;
    }
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });

/* ---------- 6. Fun facts reveal on scroll ---------- */
const factObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if(entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('in-view'), i * 120);
      factObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.3});
document.querySelectorAll('.fact-card').forEach(c => factObserver.observe(c));

/* ---------- 7. Envelope / letter ---------- */
const envelope = document.getElementById('envelope');
document.getElementById('openLetterBtn').addEventListener('click', () => {
  envelope.classList.add('open');
  spawnLetterHearts();
});

function spawnLetterHearts(){
  const wrap = document.querySelector('.envelope-wrap');
  const icons = ['💕','✨','🌸','💫'];
  for(let i=0;i<10;i++){
    const h = document.createElement('span');
    h.textContent = icons[i % icons.length];
    h.style.cssText = `
      position:absolute; left:${20 + Math.random()*60}%; bottom:10%;
      font-size:${Math.random()*10+14}px; pointer-events:none; z-index:6;
      opacity:0; animation:wishSparkle ${1.8+Math.random()}s ease-out forwards;
      animation-delay:${0.8 + Math.random()*1.2}s;
    `;
    wrap.appendChild(h);
    setTimeout(() => h.remove(), 4200);
  }
}

/* ---------- 8. Cake, candles, mic/blow detection ---------- */
const candles = () => document.querySelectorAll('.candle');
const blowBtn = document.getElementById('blowBtn');
const micStatus = document.getElementById('micStatus');
const cakeRoom = document.getElementById('cakeRoom');
const wishHeadline = document.getElementById('wishHeadline');
const blowSubtext = document.getElementById('blowSubtext');
let candlesBlown = false;

function blowOutCandles(){
  if(candlesBlown) return;
  candlesBlown = true;
  candles().forEach((c, i) => {
    setTimeout(() => {
      c.classList.add('blown');
      const smoke = document.createElement('div');
      smoke.className = 'smoke';
      c.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1700);
    }, i * 180);
  });
  cakeRoom.classList.add('dim');
  blowBtn.classList.add('done');
  micStatus.textContent = '';
  wishHeadline.textContent = 'Wish Made! ✨';
  blowSubtext.textContent = '';
  spawnWishSparkles();
  setTimeout(startFireworks, 1200);
}

function spawnWishSparkles(){
  const stage = document.querySelector('.cake-stage');
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.className = 'wish-sparkle';
    s.textContent = ['✨','⭐','💫'][i % 3];
    s.style.left = (30 + Math.random()*40) + '%';
    s.style.top = (10 + Math.random()*40) + '%';
    s.style.animationDelay = (Math.random()*0.6) + 's';
    stage.appendChild(s);
    setTimeout(() => s.remove(), 2400);
  }
}

blowBtn.addEventListener('click', blowOutCandles);

// Microphone blow detection (optional — falls back silently to the button)
async function initMicDetection(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    micStatus.textContent = '🎙️ Listening — go ahead and blow!';

    let sustained = 0;
    function check(){
      if(candlesBlown){ stream.getTracks().forEach(t => t.stop()); return; }
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a,b) => a+b, 0) / data.length;
      if(avg > 42){
        sustained++;
        if(sustained > 4){ blowOutCandles(); stream.getTracks().forEach(t => t.stop()); return; }
      } else {
        sustained = Math.max(0, sustained - 1);
      }
      requestAnimationFrame(check);
    }
    check();
  } catch(err){
    micStatus.textContent = '';
  }
}

// Only ask for the mic once the cake section is actually in view
const cakeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !candlesBlown){
      initMicDetection();
      cakeObserver.disconnect();
    }
  });
}, {threshold:0.5});
cakeObserver.observe(document.getElementById('cakeSection'));

/* ---------- 9. Fireworks (canvas) ---------- */
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
const fireworkTitle = document.getElementById('fireworkTitle');
let fwParticles = [];
let fwRunning = false;

function resizeFwCanvas(){
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeFwCanvas);
resizeFwCanvas();

function launchFirework(){
  const x = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
  const targetY = Math.random() * fwCanvas.height * 0.35 + fwCanvas.height * 0.12;
  const hueSets = [ [45,55], [340,350], [270,290], [190,200], [20,30] ];
  const hue = hueSets[Math.floor(Math.random()*hueSets.length)];
  const rocket = {
    x, y: fwCanvas.height, targetY,
    vy: -(Math.random()*3 + 7),
    hue: hue[0] + Math.random()*(hue[1]-hue[0]),
    trail: []
  };
  const riseInterval = setInterval(() => {
    rocket.y += rocket.vy;
    rocket.trail.push({x:rocket.x, y:rocket.y});
    if(rocket.trail.length > 8) rocket.trail.shift();
    if(rocket.y <= rocket.targetY){
      clearInterval(riseInterval);
      explode(rocket.x, rocket.y, rocket.hue);
    }
  }, 16);
  fwParticles.push({rocket});
}

function explode(x, y, hue){
  const count = 55 + Math.floor(Math.random()*35);
  for(let i=0;i<count;i++){
    const angle = (Math.PI*2*i)/count + Math.random()*0.2;
    const speed = Math.random()*4.2 + 1.4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      alpha: 1,
      hue: hue + Math.random()*20-10,
      size: Math.random()*2 + 1.2,
      life: 0,
      maxLife: 60 + Math.random()*40
    });
  }
}

function fwLoop(){
  if(!fwRunning) return;
  fwCtx.globalCompositeOperation = 'source-over';
  fwCtx.fillStyle = 'rgba(9,5,15,0.22)';
  fwCtx.fillRect(0,0,fwCanvas.width, fwCanvas.height);
  fwCtx.globalCompositeOperation = 'lighter';

  fwParticles = fwParticles.filter(p => {
    if(p.rocket){
      const r = p.rocket;
      fwCtx.strokeStyle = `hsla(${r.hue},90%,65%,0.8)`;
      fwCtx.lineWidth = 2;
      fwCtx.beginPath();
      r.trail.forEach((pt,i) => { i===0 ? fwCtx.moveTo(pt.x,pt.y) : fwCtx.lineTo(pt.x,pt.y); });
      fwCtx.stroke();
      return true;
    }
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.045; // gravity
    p.vx *= 0.99;
    p.life++;
    p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    if(p.alpha <= 0) return false;
    fwCtx.beginPath();
    fwCtx.fillStyle = `hsla(${p.hue},95%,68%,${p.alpha})`;
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    fwCtx.fill();
    return true;
  });
  // remove finished rockets
  fwParticles = fwParticles.filter(p => !(p.rocket && p.rocket.y <= p.rocket.targetY));

  requestAnimationFrame(fwLoop);
}

function startFireworks(){
  fwRunning = true;
  fwCanvas.classList.add('active');
  fwLoop();

  // Turn the background music off right as the fireworks begin, so the
  // voice clip (and the fireworks themselves) come through clearly.
  stopBackgroundMusic();

  // Play the personal voice clip the moment fireworks begin, if one has been added
  const fwVoice = document.getElementById('fireworksVoice');
  fwVoice.currentTime = 0;
  fwVoice.play().catch(() => { /* no clip added yet at assets/audio/fireworks-message.mp3 — silently skip */ });

  let launches = 0;
  const launcher = setInterval(() => {
    launchFirework();
    launches++;
    if(launches >= 10){ clearInterval(launcher); }
  }, 380);

  setTimeout(() => { fireworkTitle.classList.add('show'); }, 900);
  setTimeout(() => { startConfetti(); }, 2600);

  // Let the "HAPPY BIRTHDAY!" title hold for a few seconds, then fade out —
  // it shouldn't stay pinned on screen as the person keeps scrolling.
  setTimeout(() => { fireworkTitle.classList.remove('show'); }, 6500);

  setTimeout(() => {
    fwRunning = false;
    fwCanvas.classList.remove('active');
    fwCtx.clearRect(0,0,fwCanvas.width, fwCanvas.height);
  }, 9000);
}

function stopBackgroundMusic(){
  if(usingSynth){
    pauseSynth();
  } else if(!bgMusic.paused){
    // gentle fade-out rather than an abrupt cut
    const fade = setInterval(() => {
      bgMusic.volume = Math.max(0, bgMusic.volume - 0.08);
      if(bgMusic.volume <= 0.01){
        bgMusic.pause();
        clearInterval(fade);
      }
    }, 60);
  }
  document.getElementById('playPauseBtn').textContent = '▶';
  document.getElementById('musicToggle').classList.remove('playing');
}

/* ---------- 10. Confetti ---------- */
const confCanvas = document.getElementById('confettiCanvas');
const confCtx = confCanvas.getContext('2d');
let confParticles = [];
let confRunning = false;

function resizeConfCanvas(){
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfCanvas);
resizeConfCanvas();

const confColors = ['#e9bd6f','#e6a3b8','#b49bde','#ffd68a','#8fd3c7'];
function makeConfetti(fromLeft){
  const shapes = ['rect','circle','heart','star'];
  return {
    x: fromLeft ? -10 : confCanvas.width + 10,
    y: Math.random() * confCanvas.height * 0.5,
    vx: (fromLeft ? 1 : -1) * (Math.random()*4 + 3),
    vy: Math.random()*-2 - 1,
    gravity: 0.12 + Math.random()*0.05,
    rot: Math.random()*360,
    vrot: Math.random()*10 - 5,
    size: Math.random()*8 + 6,
    color: confColors[Math.floor(Math.random()*confColors.length)],
    shape: shapes[Math.floor(Math.random()*shapes.length)],
    life: 0
  };
}

function drawShape(p){
  confCtx.save();
  confCtx.translate(p.x, p.y);
  confCtx.rotate(p.rot * Math.PI/180);
  confCtx.fillStyle = p.color;
  const s = p.size;
  if(p.shape === 'rect'){
    confCtx.fillRect(-s/2, -s/4, s, s/2);
  } else if(p.shape === 'circle'){
    confCtx.beginPath(); confCtx.arc(0,0,s/2,0,Math.PI*2); confCtx.fill();
  } else if(p.shape === 'star'){
    confCtx.beginPath();
    for(let i=0;i<5;i++){
      const a = (Math.PI*2*i)/5 - Math.PI/2;
      const r1 = s/2, r2 = s/4.5;
      confCtx.lineTo(Math.cos(a)*r1, Math.sin(a)*r1);
      const a2 = a + Math.PI/5;
      confCtx.lineTo(Math.cos(a2)*r2, Math.sin(a2)*r2);
    }
    confCtx.closePath(); confCtx.fill();
  } else { // heart
    confCtx.beginPath();
    const t = s/2;
    confCtx.moveTo(0, t*0.3);
    confCtx.bezierCurveTo(t, -t*0.6, t*1.6, t*0.3, 0, t*1.3);
    confCtx.bezierCurveTo(-t*1.6, t*0.3, -t, -t*0.6, 0, t*0.3);
    confCtx.fill();
  }
  confCtx.restore();
}

function confLoop(){
  if(!confRunning) return;
  confCtx.clearRect(0,0,confCanvas.width, confCanvas.height);
  confParticles = confParticles.filter(p => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    p.life++;
    drawShape(p);
    return p.y < confCanvas.height + 30 && p.life < 500;
  });
  if(confParticles.length > 0){
    requestAnimationFrame(confLoop);
  } else {
    confRunning = false;
    confCanvas.classList.remove('active');
  }
}

function startConfetti(){
  confCanvas.classList.add('active');
  for(let i=0;i<70;i++) confParticles.push(makeConfetti(true));
  for(let i=0;i<70;i++) confParticles.push(makeConfetti(false));
  if(!confRunning){ confRunning = true; confLoop(); }
}




/* ---------- -1. Secret password gate ---------- */
(function passwordGate(){
  const GATE_PASSWORD = '0909';   // 👈 password yahan se change karo
  const gate = document.getElementById('passwordGate');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('gateInput');
  const message = document.getElementById('gateMessage');
  const hint = document.getElementById('gateHint');
  const lockIcon = document.getElementById('lockIcon');
  const particlesWrap = document.querySelector('.gate-particles');

  // tiny ambient sparkle dust behind the gate, same trick as the opening screen
  for(let i=0;i<18;i++){
    const p = document.createElement('span');
    const size = Math.random()*3+1;
    p.style.cssText = `
      position:absolute; border-radius:50%; background:#b49bde;
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      opacity:${Math.random()*0.5+0.15};
      box-shadow:0 0 ${size*3}px #b49bde;
      animation: gateDrift ${6+Math.random()*8}s ease-in-out ${Math.random()*4}s infinite;
    `;
    particlesWrap.appendChild(p);
  }
  const dustStyle = document.createElement('style');
  dustStyle.textContent = `@keyframes gateDrift{
    0%,100%{ transform:translateY(0) translateX(0); }
    50%{ transform:translateY(-24px) translateX(10px); }
  }`;
  document.head.appendChild(dustStyle);

  const wrongMessages = [
    "nope — try again 😅",
    "not quite... think harder 🤔",
    "the lock just giggled at that one 🔒😂",
    "computer says no 🤖",
    "ooh so close (not really) 💀",
    "at this point the door feels bad for you 🚪🥺"
  ];
  let attempts = 0;

  function shakeInput(){
    input.classList.remove('shake');
    void input.offsetWidth; // restart animation
    input.classList.add('shake');
  }

  function celebrateAndUnlock(){
    message.textContent = "yesss, that's the one! 🎉";
    hint.textContent = '';
    lockIcon.textContent = '🔓';
    lockIcon.classList.add('unlocking');

    // little success burst before the gate fades away
    const icons = ['🎉','✨','🎂','💖'];
    for(let i=0;i<12;i++){
      const s = document.createElement('span');
      s.className = 'gate-success-burst';
      s.textContent = icons[i % icons.length];
      s.style.left = (35 + Math.random()*30) + '%';
      s.style.top = (35 + Math.random()*30) + '%';
      s.style.animationDelay = (Math.random()*0.4) + 's';
      gate.querySelector('.gate-content').appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }

    setTimeout(() => {
      gate.classList.add('unlocked');
    }, 750);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if(val === GATE_PASSWORD){
      celebrateAndUnlock();
    } else {
      attempts++;
      shakeInput();
      message.textContent = wrongMessages[Math.min(attempts - 1, wrongMessages.length - 1)];
      input.value = '';
      input.focus();
      if(attempts === 3){
        hint.textContent = "psst — hint: Ammmmmmm  sochoo khudiiiii🎂";
      } else if(attempts >= 6){
        hint.textContent = "okay real talk — I am just telling youu.. 👀 no i can't tell";
      }
    }
  });
})();