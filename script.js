// === CONFIGURATION =======================================================

// Meme components (funny but safe)
const memePrefixes = [
  'Jesus', 'Zac', 'Mega', 'Ultra', 'VERSTAPPEN', 'Quantum', 'Hyper', 'Flippy', 'Funky', 'Epic',
  'Turbo', 'Dank', 'Crypto', 'Noodle', 'Goofy', 'Wizard', 'Duck'
];
const memeMiddles = [
  'Lord', 'Attack', 'Master', 'Champion', 'Rider', 'Slayer', 'MONKE', 'Gooner', 'Boss',
  'Beast', 'Gamer', 'Boi', 'Lord', 'King', 'Machine', 'Bro', 'Wizard'
];
const memeSuffixes = [
  'Savior', '420', '69', '1337', '', '9000', 'X', 'Deluxe', 'XD', 'ProMax',
  'V2', 'Overdrive', 'PlusUltra', 'Prime'
];

// Helper: build a meme-style word
function generateMemeWord() {
  const p = memePrefixes[Math.floor(Math.random() * memePrefixes.length)];
  const m = memeMiddles[Math.floor(Math.random() * memeMiddles.length)];
  const s = memeSuffixes[Math.floor(Math.random() * memeSuffixes.length)];
  return `${p}${m}${s}`;
}

// --- SOUND + IMAGE SETUP -------------------------------------------------
const sounds = [
  'sounds/sound1.mp3', 'sounds/sound2.mp3', 'sounds/sound3.mp3',
  'sounds/sound4.mp3', 'sounds/sound5.mp3', 'sounds/sound6.mp3',
  'sounds/sound7.mp3', 'sounds/sound8.mp3', 'sounds/sound9.mp3',
  'sounds/sound10.mp3'
];

const images = [
  'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg',
  'images/image4.jpg', 'images/image5.jpg', 'images/image6.jpg',
  'images/image7.png', 'images/image9.jpg', 'images/image10.jpg',
  'images/image11.gif'
];

const gifs = [
  'gifs/gif1.gif', 'gifs/gif2.gif', 'gifs/gif3.gif',
  'gifs/gif4.gif', 'gifs/gif5.gif', 'gifs/gif6.gif'
];

let soundIndex = 0;
let imageIndex = 0;
let soundEnabled = true;

function playNextSound() {
  if (!soundEnabled) return;
  const audio = new Audio(sounds[soundIndex]);
  audio.volume = 0.7;
  audio.play().catch(err => console.warn("Sound playback error:", err));
  soundIndex = (soundIndex + 1) % sounds.length;
}

function showNextImage() {
  const img = document.getElementById('displayImage');
  if (!img) return;
  img.classList.remove('show');
  setTimeout(() => {
    img.src = images[imageIndex];
    img.classList.add('show');
  }, 200);
  imageIndex = (imageIndex + 1) % images.length;
}

// --- EVENT LISTENERS -----------------------------------------------------
document.getElementById('generate').addEventListener('click', generatePassword);
document.getElementById('copy').addEventListener('click', copyPassword);

// --- UTILITIES -----------------------------------------------------------
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleString(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

// --- MAIN PASSWORD GENERATION -------------------------------------------
function generatePassword() {
  let length = parseInt(document.getElementById('length').value, 10);
  const includeUpper = document.getElementById('uppercase').checked;
  const includeLower = document.getElementById('lowercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSymbols = document.getElementById('symbols').checked;
  const includeMeme = document.getElementById('includeMeme')?.checked ?? false;

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

  let chars = '';
  if (includeUpper) chars += upper;
  if (includeLower) chars += lower;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  // If all unchecked except meme, default to alphanumerics for padding
  if (chars === '') chars = upper + lower + numbers;

  // Build meme or normal password
  let core = '';
  if (includeMeme) {
    const count = Math.floor(Math.random() * 2) + 1; // 1–2 meme words
    let parts = [];
    for (let i = 0; i < count; i++) parts.push(generateMemeWord());
    core = parts.join('');
  }

  if (core.length > length) length = core.length;
  const remaining = length - core.length;

  let filler = '';
  for (let i = 0; i < remaining; i++) {
    filler += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Insert meme core randomly
  const pos = getRandomInt(filler.length + 1);
  const password = filler.slice(0, pos) + core + filler.slice(pos);

  document.getElementById('password').value = password;

  // Trigger visuals & audio
  playNextSound();
  showNextImage();
  spawnFloatingImages();
}

// --- FLOATING GIF EXPLOSION ---------------------------------------------
function spawnFloatingImages() {
  const container = document.getElementById('bg-container');
  if (!container) return;

  // 💣 Massive burst
  const count = getRandomInt(150) + 150; // 150–300 GIFs

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = gifs[Math.floor(Math.random() * gifs.length)];
    img.className = 'floating-img';

    // Random start position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;

    // Random size
    const size = 40 + Math.random() * 120; // 40–160 px
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;

    // Random motion vector (fast but longer-lived)
    const dx = (Math.random() - 0.5) * 1000;
    const dy = (Math.random() - 0.5) * 800;
    const rot = (Math.random() - 0.5) * 1440;

    // 🎬 Animate: fly fast, then linger before fading
    const duration = 2800 + Math.random() * 800; // ≈3 s
    img.animate(
      [
        { transform: 'translate(0,0) scale(0.3)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.1)`, opacity: 0 }
      ],
      {
        duration,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );

    container.appendChild(img);

    // Remove when finished
    setTimeout(() => img.remove(), duration + 300);
  }
}

// --- COPY TO CLIPBOARD ---------------------------------------------------
function copyPassword() {
  const el = document.getElementById('password');
  el.select();
  try {
    document.execCommand('copy');
    alert('Password copied!');
  } catch {
    alert('Copy failed — select and copy manually.');
  }
}

// === FUNNY WINDOW CONTROLS (Instant Playback Version) ====================

// Preload fart sound
const fartSound = new Audio('sounds/fart.mp3');
fartSound.load();
fartSound.volume = 1.0;

// Plays instantly by resetting playback each time
function playFart() {
  try {
    fartSound.currentTime = 0; // restart from beginning
    fartSound.play();
  } catch (err) {
    console.warn('Fart sound error:', err);
  }
}

// Funny close button reaction
function prankClose() {
  playFart();

  // Wiggle effect for the close button
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
    closeBtn.classList.add('wiggle');
    setTimeout(() => closeBtn.classList.remove('wiggle'), 600);
  }

  alert("💨 💨 LILLA PRUTTEN KAN INTE STÄNGA FÖNSTRET MOHAHAHAHHAHAHAHAHAH HAHH AH AH AH HA HA HA SDASJHD KAJSD KASJD KASJD KAJSD KAJSD");
}

// Hook up window control buttons
const closeBtn = document.getElementById('closeBtn');
const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');

if (minBtn) minBtn.addEventListener('click', playFart);
if (maxBtn) maxBtn.addEventListener('click', playFart);
if (closeBtn) closeBtn.addEventListener('click', prankClose);
