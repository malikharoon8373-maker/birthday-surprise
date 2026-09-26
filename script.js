/* =========================================================
   BIRTHDAY SURPRISE v2 — SCRIPT
   ===== EVERYTHING YOU'LL WANT TO EDIT IS IN THIS CONFIG BLOCK =====
========================================================= */
const CONFIG = {
  PASSWORD: "2026",

  HER_NAME: "My Love",           // shown in cursive on the tree scene, cake, and final scene
  AGE_LINE: "",                  // e.g. "and just like that, you're turning 24 ✨"  — leave "" to hide

  REASONS: [                     // one reason revealed per balloon popped
    "You're my favorite hello",
    "Life's better with you in it",
    "You always make me feel seen",
    "You make every moment brighter",
    "Your smile feels like home",
    "...and a thousand more reasons"
  ],

  LETTER_SALUTATION: "Dear My Love,",
  LETTER_BODY: "Happy Birthday! 🎂 I hope this year brings you endless smiles, little surprises, and every dream you've been quietly wishing for. Thank you for being exactly who you are. Never change — you make life brighter just by being in it. Wishing you the happiest birthday. 🎉",
  LETTER_SIGN: "With all my love.",

  SHARE_TITLE: "A little birthday surprise for you 💗",
  SHARE_TEXT: "I made this for you — happy birthday! 🎂",
};

/* ---------------------------------------------------------
   SCENE NAVIGATION
--------------------------------------------------------- */
const sceneIds = ["scene0","scene1","scene2","scene3","scene4","scene5","scene6","scene7"];
function goToScene(id){
  sceneIds.forEach(s => document.getElementById(s).classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
  onSceneEnter(id);
}

function onSceneEnter(id){
  if(id === "scene2") startTreeBloom();
  if(id === "scene3") startCakeBake();
  if(id === "scene4") setupBalloons();
  if(id === "scene5") setupCarousel();
  if(id === "scene7") startFinalConfetti();
}

/* ---------------------------------------------------------
   SPARKLE / FLOATY BACKGROUND
--------------------------------------------------------- */
const sparkleLayer = document.getElementById("sparkleLayer");
const sparkleEmojis = ["✨","💫","💗","⭐"];
function spawnSpark(){
  const el = document.createElement("span");
  el.className = "spark";
  el.textContent = sparkleEmojis[Math.floor(Math.random()*sparkleEmojis.length)];
  el.style.left = Math.random()*100 + "vw";
  el.style.setProperty("--dx", (Math.random()*60-30) + "px");
  const dur = 6 + Math.random()*5;
  el.style.animationDuration = dur + "s";
  sparkleLayer.appendChild(el);
  setTimeout(()=> el.remove(), dur*1000);
}
setInterval(spawnSpark, 900);
for(let i=0;i<4;i++) setTimeout(spawnSpark, i*400);

/* ---------------------------------------------------------
   MUSIC
--------------------------------------------------------- */
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
let musicStarted = false, musicMuted = false;
function tryStartMusic(){
  if(musicStarted) return;
  musicStarted = true;
  bgMusic.volume = 0.35;
  bgMusic.play().catch(()=>{});
  muteBtn.textContent = "🔊";
}
muteBtn.addEventListener("click", () => {
  if(!musicStarted){ tryStartMusic(); return; }
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  muteBtn.textContent = musicMuted ? "🔇" : "🔊";
});
document.body.addEventListener("pointerdown", tryStartMusic, { once:true });

/* ---------------------------------------------------------
   SCENE 0 — PASSWORD
--------------------------------------------------------- */
const dotsEl = document.querySelector("#scene0 .dots");
const dots = Array.from(document.querySelectorAll("#scene0 .dot"));
const wrongMsg = document.getElementById("wrongMsg");
let entered = "";

function refreshDots(){ dots.forEach((d,i)=> d.classList.toggle("filled", i < entered.length)); }
function pressKey(num){
  if(entered.length >= 4) return;
  entered += num;
  refreshDots();
  if(entered.length === 4) setTimeout(checkPassword, 150);
}
function checkPassword(){
  if(entered === CONFIG.PASSWORD){
    wrongMsg.classList.remove("show");
    document.getElementById("scene0").classList.add("unlocking");
    setTimeout(() => {
      document.getElementById("scene0").classList.remove("unlocking");
      goToScene("scene1");
    }, 600);
  } else {
    dotsEl.classList.add("shake");
    wrongMsg.classList.add("show");
    setTimeout(() => { dotsEl.classList.remove("shake"); entered=""; refreshDots(); }, 500);
  }
}
document.querySelectorAll("#scene0 .key[data-num]").forEach(btn=>{
  btn.addEventListener("click", ()=> pressKey(btn.dataset.num));
});
document.getElementById("backspaceBtn").addEventListener("click", ()=>{
  entered = entered.slice(0,-1); refreshDots();
});
document.addEventListener("keydown", (e)=>{
  if(!document.getElementById("scene0").classList.contains("active")) return;
  if(/^[0-9]$/.test(e.key)) pressKey(e.key);
  if(e.key === "Backspace"){ entered = entered.slice(0,-1); refreshDots(); }
});

/* ---------------------------------------------------------
   SCENE 1 — HEART PULL INTRO
--------------------------------------------------------- */
const pullHeart = document.getElementById("pullHeart");
const pullHint = document.getElementById("pullHint");
const wishReveal = document.getElementById("wishReveal");
let dragStartY = null, heartReleasedDone = false;

function heartDown(e){
  if(heartReleasedDone) return;
  dragStartY = (e.touches ? e.touches[0].clientY : e.clientY);
  pullHeart.classList.add("dragging");
}
function heartMove(e){
  if(dragStartY === null || heartReleasedDone) return;
  const y = (e.touches ? e.touches[0].clientY : e.clientY);
  const delta = Math.max(0, y - dragStartY);
  pullHeart.style.transform = `translateY(${Math.min(delta,90)}px) scale(${1 - Math.min(delta,90)/500})`;
}
function heartUp(e){
  if(dragStartY === null || heartReleasedDone) return;
  const y = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY);
  const delta = y - dragStartY;
  pullHeart.classList.remove("dragging");
  dragStartY = null;
  if(delta > 55){
    heartReleasedDone = true;
    pullHeart.style.transform = "";
    pullHeart.classList.add("released");
    pullHint.classList.add("hidden");
    setTimeout(triggerWishReveal, 350);
  } else {
    pullHeart.style.transform = "";
  }
}
pullHeart.addEventListener("mousedown", heartDown);
document.addEventListener("mousemove", heartMove);
document.addEventListener("mouseup", heartUp);
pullHeart.addEventListener("touchstart", heartDown, {passive:true});
pullHeart.addEventListener("touchmove", heartMove, {passive:true});
pullHeart.addEventListener("touchend", heartUp);

function triggerWishReveal(){
  wishReveal.classList.add("show");
  setTimeout(() => {
    wishReveal.classList.remove("show");
    setTimeout(() => goToScene("scene2"), 500);
  }, 2600);
}

/* ---------------------------------------------------------
   SCENE 2 — TREE BLOOM
--------------------------------------------------------- */
const treeBranch = document.querySelector("#scene2 .tree-branch");
const bloomCluster = document.getElementById("bloomCluster");
const nameReveal = document.getElementById("nameReveal");
const ageLine = document.getElementById("ageLine");
const toCakeBtn = document.getElementById("toCakeBtn");
let treeBloomDone = false;

// Preset positions arranged roughly into a heart silhouette
const heartPositions = [
  [110,69],[113,58],[130,36],[163,26],[195,42],[209,75],[195,112],
  [163,145],[130,174],[113,196],[110,205],[107,196],[90,174],[58,145],
  [25,112],[11,75],[25,42],[58,26],[90,36],[107,58]
];
const bloomEmojis = ["💗","🌸","💛","🌺","💕"];

function startTreeBloom(){
  if(treeBloomDone) return;
  treeBloomDone = true;
  // restart branch grow animation
  treeBranch.style.animation = "none";
  bloomCluster.innerHTML = "";
  nameReveal.textContent = "";
  ageLine.textContent = "";
  toCakeBtn.classList.add("hidden");
  requestAnimationFrame(() => {
    treeBranch.style.animation = "";
  });

  setTimeout(() => {
    heartPositions.forEach((pos, i) => {
      const piece = document.createElement("span");
      piece.className = "bloom-piece";
      piece.textContent = bloomEmojis[Math.floor(Math.random()*bloomEmojis.length)];
      piece.style.left = pos[0] + "px";
      piece.style.top = pos[1] + "px";
      piece.style.animationDelay = (i*0.045) + "s";
      bloomCluster.appendChild(piece);
    });
    setTimeout(typeName, heartPositions.length*45 + 300);
  }, 1700);
}

function typeName(){
  const text = CONFIG.HER_NAME;
  let i = 0;
  const interval = setInterval(() => {
    nameReveal.textContent = text.slice(0, i+1);
    i++;
    if(i >= text.length){
      clearInterval(interval);
      setTimeout(() => {
        ageLine.textContent = CONFIG.AGE_LINE;
        toCakeBtn.classList.remove("hidden");
      }, 300);
    }
  }, 70);
}
toCakeBtn.addEventListener("click", () => goToScene("scene3"));

/* ---------------------------------------------------------
   SCENE 3 — CAKE
--------------------------------------------------------- */
const cakeBake = document.getElementById("cakeBake");
const cakeReady = document.getElementById("cakeReady");
const bakingLabel = document.getElementById("bakingLabel");
const cakeName = document.getElementById("cakeName");
const makeWishLabel = document.getElementById("makeWishLabel");
const candleFlame = document.getElementById("candleFlame");
const toBalloonsBtn = document.getElementById("toBalloonsBtn");
let cakeStarted = false, candleBlown = false;

function startCakeBake(){
  if(cakeStarted) return;
  cakeStarted = true;
  setTimeout(() => {
    cakeBake.classList.add("hidden");
    cakeReady.classList.remove("hidden");
    bakingLabel.classList.add("hidden");
    makeWishLabel.classList.remove("hidden");
    document.querySelector("#scene3 .candle").addEventListener("click", blowCandle);
  }, 2300);
}
function blowCandle(){
  if(candleBlown) return;
  candleBlown = true;
  document.querySelector("#scene3 .candle").classList.add("blown");
  makeWishLabel.classList.add("hidden");
  spawnBurst(document.querySelector(".cake-stage"));
  cakeName.textContent = "";
  cakeName.classList.remove("hidden");
  let text = `Happy Birthday, ${CONFIG.HER_NAME}!`;
  let i = 0;
  const iv = setInterval(() => {
    cakeName.textContent = text.slice(0,i+1);
    i++;
    if(i >= text.length){
      clearInterval(iv);
      setTimeout(() => toBalloonsBtn.classList.remove("hidden"), 300);
    }
  }, 45);
}
function spawnBurst(container){
  const emojis = ["🎉","✨","💛","💗"];
  for(let i=0;i<24;i++){
    const p = document.createElement("span");
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    p.style.position = "absolute";
    p.style.left = "50%"; p.style.top = "40%";
    p.style.fontSize = "1.3rem";
    p.style.pointerEvents = "none";
    const angle = Math.random()*Math.PI*2;
    const dist = 60 + Math.random()*140;
    p.style.transition = "transform 1s cubic-bezier(.2,.7,.3,1), opacity 1s ease";
    container.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 1100);
  }
}
toBalloonsBtn.addEventListener("click", () => goToScene("scene4"));

/* ---------------------------------------------------------
   SCENE 4 — BALLOONS
--------------------------------------------------------- */
const balloonField = document.getElementById("balloonField");
const reasonList = document.getElementById("reasonList");
const toMemoryBtn = document.getElementById("toMemoryBtn");
let balloonsBuilt = false;

function setupBalloons(){
  if(balloonsBuilt) return;
  balloonsBuilt = true;
  const hues = [0, 60, 130, 190, 260, 320];
  CONFIG.REASONS.forEach((reason, i) => {
    const b = document.createElement("span");
    b.className = "balloon";
    b.textContent = "🎈";
    b.style.filter = `hue-rotate(${hues[i % hues.length]}deg)`;
    b.dataset.index = i;
    b.addEventListener("click", () => popBalloon(b, reason, i));
    balloonField.appendChild(b);
  });
}
function popBalloon(el, reasonText, index){
  if(el.classList.contains("popped")) return;
  el.classList.add("popped");
  const item = document.createElement("div");
  item.className = "reason-item";
  item.innerHTML = `<span class="r-no">REASON NO. ${index+1}</span>${reasonText}`;
  reasonList.appendChild(item);
  reasonList.scrollTop = reasonList.scrollHeight;
  const allPopped = balloonField.querySelectorAll(".balloon:not(.popped)").length === 0;
  if(allPopped) toMemoryBtn.classList.remove("hidden");
}
toMemoryBtn.addEventListener("click", () => goToScene("scene5"));

/* ---------------------------------------------------------
   SCENE 5 — MEMORY LANE CAROUSEL
--------------------------------------------------------- */
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
let carouselBuilt = false;

function setupCarousel(){
  if(carouselBuilt) return;
  carouselBuilt = true;
  const cards = Array.from(carouselTrack.children);
  cards.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "cdot" + (i === 0 ? " active" : "");
    carouselDots.appendChild(d);
  });
  const dotEls = Array.from(carouselDots.children);
  carouselTrack.addEventListener("scroll", () => {
    const cardWidth = cards[0].getBoundingClientRect().width + 16;
    const idx = Math.round(carouselTrack.scrollLeft / cardWidth);
    dotEls.forEach((d,i) => d.classList.toggle("active", i === idx));
  });
}
document.getElementById("toEnvelopeBtn").addEventListener("click", () => goToScene("scene6"));

/* ---------------------------------------------------------
   SCENE 6 — ENVELOPE LETTER
--------------------------------------------------------- */
const envelope = document.getElementById("envelope");
const envelopeHint = document.getElementById("envelopeHint");
const letterCard = document.getElementById("letterCard");

envelope.addEventListener("click", () => {
  if(envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  envelopeHint.classList.add("hidden");
  document.getElementById("letterSalutation").textContent = CONFIG.LETTER_SALUTATION;
  document.getElementById("letterBody").textContent = CONFIG.LETTER_BODY;
  document.getElementById("letterSign").textContent = CONFIG.LETTER_SIGN;
  setTimeout(() => letterCard.classList.remove("hidden"), 450);
});
document.getElementById("toFinalBtn").addEventListener("click", () => goToScene("scene7"));

/* ---------------------------------------------------------
   SCENE 7 — FINAL
--------------------------------------------------------- */
const finalConfettiLayer = document.getElementById("finalConfetti");
const finalName = document.getElementById("finalName");
let confettiInterval = null;

function startFinalConfetti(){
  finalName.textContent = CONFIG.HER_NAME + "!";
  if(confettiInterval) return;
  const emojis = ["🎉","💛","💗","✨","🎊"];
  confettiInterval = setInterval(() => {
    if(!document.getElementById("scene7").classList.contains("active")) return;
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    p.style.left = Math.random()*100 + "vw";
    p.style.animationDuration = (2.5 + Math.random()*2) + "s";
    p.style.fontSize = (0.9 + Math.random()*0.8) + "rem";
    finalConfettiLayer.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }, 220);
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  const shareData = {
    title: CONFIG.SHARE_TITLE,
    text: CONFIG.SHARE_TEXT,
    url: window.location.href
  };
  if(navigator.share){
    try { await navigator.share(shareData); } catch(e){}
  } else if(navigator.clipboard){
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied! Paste it anywhere to send it to her 💗");
    } catch(e){}
  }
});

document.getElementById("replayBtn").addEventListener("click", () => {
  // reset scene0
  entered = ""; refreshDots(); wrongMsg.classList.remove("show");
  // reset scene1
  heartReleasedDone = false;
  pullHeart.classList.remove("released");
  pullHint.classList.remove("hidden");
  wishReveal.classList.remove("show");
  // reset scene2
  treeBloomDone = false;
  // reset scene3
  cakeStarted = false; candleBlown = false;
  cakeBake.style.animation = "none";
  cakeBake.classList.remove("hidden");
  void cakeBake.offsetWidth;
  cakeBake.style.animation = "";
  cakeReady.classList.add("hidden");
  bakingLabel.classList.remove("hidden");
  makeWishLabel.classList.add("hidden");
  cakeName.classList.add("hidden");
  toBalloonsBtn.classList.add("hidden");
  document.querySelector("#scene3 .candle").classList.remove("blown");
  // reset scene4
  balloonField.innerHTML = "";
  reasonList.innerHTML = "";
  balloonsBuilt = false;
  toMemoryBtn.classList.add("hidden");
  // reset scene6
  envelope.classList.remove("open");
  letterCard.classList.add("hidden");
  envelopeHint.classList.remove("hidden");
  goToScene("scene0");
});
