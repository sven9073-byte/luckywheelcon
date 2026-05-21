// Расширенная логика приложения колеса удачи с полной кастомизацией и поддержкой GIF

let wheel = null;
let isSpinning = false;
let selectedItemIndex = -1;
let currentPreset = 'sectors4';
let statistics = {
  totalSpins: 0,
  results: {}
};
let exhibitionMode = false;
let resultPopupVisible = false;
let sectorLimits = {}; // объект для хранения лимитов: {sectorName: {limit: 5, current: 2}}
let selectedTheme = null;

// Готовые темы дизайна колеса (как на картинке)
// Расширенные темы дизайна колеса (как на картинке)
// Обновленные темы с декоративными элементами
const wheelDesignThemes = {
  // Первый ряд
  classic_red_gold: {
    name: "Classic Red Gold",
    colors: ['#ff0000', '#ffffff', '#ff0000', '#ffffff', '#ff0000', '#ffffff', '#ff0000', '#ffffff'],
    borderStyle: 'gold_classic_thick',
    borderWidth: 8,
    borderColor: '#ffd700',
    centerStyle: 'gold_star_center',
    decorativeElements: 'golden_stars' // ИЗМЕНЕНО
  },
  
  casino_multicolor: {
    name: "Casino Multicolor", 
    colors: ['#8B0000', '#006400', '#000080', '#FF6347', '#4B0082', '#2F4F4F'],
    borderStyle: 'dark_metallic',
    borderWidth: 6,
    borderColor: '#2c1810',
    centerStyle: 'brass_center',
    decorativeElements: 'brass_studs' // ИЗМЕНЕНО
  },
  
  casino_dots_red: {
    name: "Casino Dots Red",
    colors: ['#8B0000', '#CD5C5C', '#8B0000', '#CD5C5C', '#8B0000', '#CD5C5C'],
    borderStyle: 'dotted_lights',
    borderWidth: 4,
    borderColor: '#2c3e50',
    centerStyle: 'simple_center',
    decorativeElements: 'white_dots' // УЖЕ РАБОТАЕТ
  },
  
  modern_blue_gradient: {
    name: "Modern Blue Gradient",
    colors: ['#1e3c72', '#2a5298', '#87CEEB', '#4682B4', '#6495ED', '#4169E1', '#0000FF', '#191970'],
    borderStyle: 'blue_metallic',
    borderWidth: 5,
    borderColor: '#1e3c72',
    centerStyle: 'blue_center',
    decorativeElements: 'glowing_dots' // ИЗМЕНЕНО
  },
  
  // Второй ряд
  sunshine_segments: {
    name: "Sunshine Segments",
    colors: ['#FFD700', '#FF6347', '#FFD700', '#FF6347', '#FFD700', '#FF6347'],
    borderStyle: 'gold_rays',
    borderWidth: 6,
    borderColor: '#B8860B',
    centerStyle: 'sun_center',
    decorativeElements: 'golden_stars' // ИЗМЕНЕНО
  },
  
  purple_galaxy: {
    name: "Purple Galaxy",
    colors: ['#4B0082', '#8A2BE2', '#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD'],
    borderStyle: 'galaxy_border',
    borderWidth: 5,
    borderColor: '#2F0F47',
    centerStyle: 'galaxy_center', 
    decorativeElements: 'twinkling_stars' // ИЗМЕНЕНО
  },
  
  emerald_casino: {
    name: "Emerald Casino",
    colors: ['#006400', '#32CD32', '#00FF00', '#ADFF2F', '#9AFF9A', '#98FB98'],
    borderStyle: 'emerald_lights',
    borderWidth: 4,
    borderColor: '#013220',
    centerStyle: 'emerald_center',
    decorativeElements: 'blinking_dots' // УЖЕ ПРАВИЛЬНО
  },
  
  fire_wheel: {
    name: "Fire Wheel", 
    colors: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700'],
    borderStyle: 'fire_border',
    borderWidth: 7,
    borderColor: '#8B0000',
    centerStyle: 'fire_center',
    decorativeElements: 'glowing_dots' // ИЗМЕНЕНО
  },
  
  // Третий ряд
  rainbow_neon: {
    name: "Rainbow Neon",
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493'],
    borderStyle: 'neon_rainbow',
    borderWidth: 4,
    borderColor: '#000000',
    centerStyle: 'neon_center',
    decorativeElements: 'none' // ИЗМЕНЕНО
  },
  
  royal_segments: {
    name: "Royal Segments",
    colors: ['#4B0082', '#FFD700', '#8B0000', '#FFD700', '#4B0082', '#FFD700', '#8B0000', '#FFD700'],
    borderStyle: 'royal_border',
    borderWidth: 8,
    borderColor: '#B8860B',
    centerStyle: 'crown_center',
    decorativeElements: 'twinkling_stars' // ИЗМЕНЕНО
  },
  
  vintage_carnival: {
    name: "Vintage Carnival",
    colors: ['#8B0000', '#FFD700', '#000080', '#FF6347', '#4B0082', '#32CD32'],
    borderStyle: 'carnival_lights',
    borderWidth: 6,
    borderColor: '#8B4513',
    centerStyle: 'carnival_center',
    decorativeElements: 'carnival_bulbs' // УЖЕ ПРАВИЛЬНО
  },
  
  disco_fever: {
    name: "Disco Fever",
    colors: ['#FF1493', '#00FFFF', '#FFFF00', '#FF4500', '#8A2BE2', '#00FF00'],
    borderStyle: 'disco_lights',
    borderWidth: 5,
    borderColor: '#000000',
    centerStyle: 'disco_ball',
    decorativeElements: 'disco_bulbs' // УЖЕ ПРАВИЛЬНО
  },
  
  electric_storm: {
    name: "Electric Storm",
    colors: ['#00BFFF', '#1E90FF', '#0000FF', '#4169E1', '#6495ED', '#87CEEB'],
    borderStyle: 'electric_border',
    borderWidth: 4,
    borderColor: '#000080',
    centerStyle: 'electric_center',
    decorativeElements: 'lightning_bolts' // УЖЕ ПРАВИЛЬНО
  },
  
  golden_luxury: {
    name: "Golden Luxury",
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B', '#CD853F'],
    borderStyle: 'luxury_gold',
    borderWidth: 8,
    borderColor: '#B8860B',
    centerStyle: 'luxury_center',
    decorativeElements: 'golden_stars' // ИЗМЕНЕНО
  },
  
  // Остальные темы тоже обнови...
  elegant_dark: {
    name: "Elegant Dark",
    colors: ['#8e44ad', '#2c3e50', '#c0392b', '#d35400', '#27ae60', '#2980b9', '#f39c12', '#16a085'],
    borderStyle: 'dark_elegant',
    borderWidth: 6,
    borderColor: '#2c3e50',
    centerStyle: 'dark_center',
    decorativeElements: 'twinkling_stars' // ИЗМЕНЕНО
  }
};

// Кастомизация с поддержкой GIF
let customization = {
  backgroundImage: null,
  backgroundIsGIF: false,        // НОВОЕ для GIF
  wheelBorderImage: null,
  wheelBorderIsGIF: false,       // НОВОЕ для GIF
  popupBackground: null,
  popupBackgroundIsGIF: false,   // НОВОЕ для GIF
  popupTextColor: '#ffffff',
  currentTheme: 'default'
};
let currentLanguage = 'en';

function selectTheme(themeName) {
  selectedTheme = themeName;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
  
  console.log('🎨 Выбрана тема:', themeName);
}

// Недостающие функции ободков
function createDarkMetallic(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border dark-metallic';
  
  const size = canvas.width + 30;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(135deg, #3c3c3c, #1a1a1a, #2c2c2c);
    border: 6px solid #2c1810;
    z-index: 1;
    box-shadow: 
      inset 0 0 20px rgba(0, 0, 0, 0.8),
      0 0 25px rgba(44, 24, 16, 0.6);
  `;
  container.appendChild(borderElement);
}

function createGalaxyBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border galaxy-border';
  
  const size = canvas.width + 35;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(from 0deg, #2F0F47, #4B0082, #8A2BE2, #2F0F47);
    border: 5px solid #2F0F47;
    z-index: 1;
    box-shadow: 
      0 0 30px rgba(138, 43, 226, 0.6),
      inset 0 0 30px rgba(75, 0, 130, 0.4);
    animation: galaxySpin 8s linear infinite;
  `;
  container.appendChild(borderElement);
}

function createGoldRays(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border gold-rays';
  
  const size = canvas.width + 45;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #FFD700 0deg 10deg, #B8860B 10deg 20deg,
      #FFD700 20deg 30deg, #B8860B 30deg 40deg,
      #FFD700 40deg 50deg, #B8860B 50deg 60deg,
      #FFD700 60deg 70deg, #B8860B 70deg 80deg,
      #FFD700 80deg 90deg, #B8860B 90deg 100deg,
      #FFD700 100deg 110deg, #B8860B 110deg 120deg,
      #FFD700 120deg 130deg, #B8860B 130deg 140deg,
      #FFD700 140deg 150deg, #B8860B 150deg 160deg,
      #FFD700 160deg 170deg, #B8860B 170deg 180deg,
      #FFD700 180deg 190deg, #B8860B 190deg 200deg,
      #FFD700 200deg 210deg, #B8860B 210deg 220deg,
      #FFD700 220deg 230deg, #B8860B 230deg 240deg,
      #FFD700 240deg 250deg, #B8860B 250deg 260deg,
      #FFD700 260deg 270deg, #B8860B 270deg 280deg,
      #FFD700 280deg 290deg, #B8860B 290deg 300deg,
      #FFD700 300deg 310deg, #B8860B 310deg 320deg,
      #FFD700 320deg 330deg, #B8860B 330deg 340deg,
      #FFD700 340deg 350deg, #B8860B 350deg 360deg
    );
    border: 6px solid #B8860B;
    z-index: 1;
    box-shadow: 
      0 0 40px rgba(255, 215, 0, 0.8),
      inset 0 0 20px rgba(184, 134, 11, 0.6);
    animation: sunRays 4s linear infinite;
  `;
  container.appendChild(borderElement);
}

function createBlueMetallic(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border blue-metallic';
  
  const size = canvas.width + 32;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3c72, #2a5298, #4682B4, #1e3c72);
    border: 5px solid #1e3c72;
    z-index: 1;
    box-shadow: 
      inset 0 0 25px rgba(30, 60, 114, 0.8),
      0 0 30px rgba(42, 82, 152, 0.6);
  `;
  container.appendChild(borderElement);
}

function createFireBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border fire-border';
  
  const size = canvas.width + 38;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #FF0000, #FF4500, #FF6347, #FF7F50, #FFA500, #FFD700,
      #FF0000, #FF4500, #FF6347, #FF7F50, #FFA500, #FFD700
    );
    border: 7px solid #8B0000;
    z-index: 1;
    box-shadow: 
      0 0 40px rgba(255, 69, 0, 0.8),
      inset 0 0 30px rgba(255, 0, 0, 0.6);
    animation: fireFlicker 2s ease-in-out infinite alternate;
  `;
  container.appendChild(borderElement);
}

// ИСПРАВЛЕННАЯ функция Emerald Casino
// ИСПРАВЛЕННЫЕ функции ободков - ТОЛЬКО ободок, без элементов
function createEmeraldLights(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border emerald-lights';
  
  const size = canvas.width + 30;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(135deg, #006400, #32CD32, #006400);
    border: 4px solid #013220;
    z-index: 1;
    box-shadow: 0 0 25px rgba(50, 205, 50, 0.8);
  `;
  container.appendChild(borderElement);
}

function createRoyalBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border royal-border';
  
  const size = canvas.width + 45;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(45deg, #4B0082, #FFD700, #8B0000, #FFD700, #4B0082);
    border: 8px solid #B8860B;
    z-index: 1;
    box-shadow: 
      0 0 35px rgba(255, 215, 0, 0.8),
      inset 0 0 25px rgba(75, 0, 130, 0.6);
  `;
  container.appendChild(borderElement);
}

function createLuxuryGold(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border luxury-gold';
  
  const size = canvas.width + 55;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: 
      conic-gradient(from 0deg, #FFD700, #FFA500, #FF8C00, #DAA520, #B8860B, #CD853F, #FFD700),
      radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
    border: 8px solid #B8860B;
    z-index: 1;
    box-shadow: 
      0 0 50px rgba(255, 215, 0, 0.9),
      inset 0 0 30px rgba(218, 165, 32, 0.8),
      0 0 80px rgba(255, 165, 0, 0.5);
    animation: luxuryShine 4s ease-in-out infinite;
  `;
  container.appendChild(borderElement);
}
// Анимированные ободки с эффектами
function createGoldClassicThick(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border gold-classic-thick';
  
  const size = canvas.width + 60;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(#ffd700, #ffed4e, #ffd700, #b8860b, #ffd700);
    border: 8px solid #8b7355;
    z-index: 1;
    box-shadow: 
      inset 0 0 30px rgba(255, 215, 0, 0.9),
      0 0 40px rgba(255, 215, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4);
    animation: goldPulse 3s ease-in-out infinite;
  `;
  
  container.appendChild(borderElement);
}

function createDottedLights(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border dotted-lights';
  
  const size = canvas.width + 35;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #2c3e50;
    border: 4px solid #34495e;
    z-index: 1;
    box-shadow: 0 0 20px rgba(52, 73, 94, 0.8);
  `;
  container.appendChild(borderElement);
}

function createCarnivalLights(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border carnival-lights';
  
  const size = canvas.width + 45;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(45deg, #8B4513, #A0522D, #8B4513);
    border: 6px solid #654321;
    z-index: 1;
    box-shadow: 
      inset 0 0 20px rgba(139, 69, 19, 0.8),
      0 0 30px rgba(101, 67, 33, 0.6);
  `;
  container.appendChild(borderElement);
}


// ИСПРАВЛЕННАЯ функция диско огней
function createDiscoLights(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border disco-lights';
  
  const size = canvas.width + 40;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(45deg, #000, #333, #000);
    border: 5px solid #111;
    z-index: 1;
    animation: discoSpin 2s linear infinite;
  `;
  container.appendChild(borderElement);
}


function createElectricBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border electric-border';
  
  const size = canvas.width + 35;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, transparent 65%, #00bfff 66%, #1e90ff 68%, transparent 69%);
    z-index: 1;
    box-shadow: 
      0 0 30px #00bfff,
      0 0 60px #1e90ff,
      inset 0 0 30px #0000ff;
    animation: electricPulse 1s ease-in-out infinite alternate;
  `;
  container.appendChild(borderElement);
}

function createNeonRainbow(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border neon-rainbow';
  
  const size = canvas.width + 40;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #ff0000, #ff7f00, #ffff00, #00ff00, 
      #0000ff, #4b0082, #9400d3, #ff0000
    );
    z-index: 1;
    animation: rainbowPulse 3s ease-in-out infinite;
  `;
  
  container.appendChild(borderElement);
}
// Функции для создания различных декораций (добавь ЭТО ПЕРЕД applySelectedTheme)
// НОВЫЕ функции декораций - по образцу addWhiteDotsDecoration
function addBlinkingDotsDecoration(container, canvas) {
  const dotCount = 14;
  const radius = canvas.width / 2;
  const dotDistance = radius - 12;
  
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * 2 * Math.PI) / dotCount;
    const x = radius + Math.cos(angle) * dotDistance;
    const y = radius + Math.sin(angle) * dotDistance;
    
    const dot = document.createElement('div');
    dot.className = 'wheel-decoration blinking-dot';
    dot.style.cssText = `
      position: absolute;
      left: ${x - 3}px;
      top: ${y - 3}px;
      width: 6px;
      height: 6px;
      background: #00FF00;
      border-radius: 50%;
      box-shadow: 0 0 8px #00FF00;
      z-index: 5;
      animation: emeraldBlink 2s infinite;
      animation-delay: ${i * 0.14}s;
    `;
    container.appendChild(dot);
  }
}

function clearTestDecorations() {
  const container = document.getElementById('wheel-canvas').parentElement;
  const testElements = container.querySelectorAll('.wheel-decoration[class*="-test"]');
  testElements.forEach(el => el.remove());
  console.log(`🧹 Удалено ${testElements.length} тестовых элементов`);
}

window.clearTestDecorations = clearTestDecorations;

function checkDecorationFunctions() {
  console.log('🔍 Проверяем определение функций декораций:');
  
  const functions = [
    'addWhiteDotsDecoration',
    'addDiscoBulbsDecoration', 
    'addCarnivalBulbsDecoration',
    'addLightningBoltsDecoration'
  ];
  
  functions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName} определена`);
    } else {
      console.log(`❌ ${funcName} НЕ определена`);
    }
  });
}

window.checkDecorationFunctions = checkDecorationFunctions;

// ИСПРАВЛЕННАЯ функция disco_bulbs
// ПРОСТЫЕ ТЕСТОВЫЕ функции - добавь в app.js
function addDiscoBulbsDecoration(container, canvas) {
  console.log('🕺 DISCO BULBS - рабочая версия');
  
  const discoColors = ['#ff1493', '#00ffff', '#ffff00', '#ff4500', '#8a2be2', '#00ff00'];
  const bulbCount = 14;
  const radius = canvas.width / 2;
  const bulbDistance = radius - 15;
  
  for (let i = 0; i < bulbCount; i++) {
    const angle = (i * 2 * Math.PI) / bulbCount;
    const x = radius + Math.cos(angle) * bulbDistance;
    const y = radius + Math.sin(angle) * bulbDistance;
    const color = discoColors[i % discoColors.length];
    
    const bulb = document.createElement('div');
    bulb.className = 'wheel-decoration disco-bulb-working';
    bulb.style.cssText = `
      position: absolute;
      left: ${x - 8}px;
      top: ${y - 8}px;
      width: 16px;
      height: 16px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
      z-index: 999;
      opacity: 1;
      animation: discoFlashWorking 1s infinite;
      animation-delay: ${i * 0.1}s;
    `;
    container.appendChild(bulb);
    console.log(`✅ Диско лампочка ${i} добавлена на (${x}, ${y}) цвет ${color}`);
  }
}



function addCarnivalBulbsDecoration(container, canvas) {
  console.log('🎪 CARNIVAL BULBS - рабочая версия');
  
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const bulbCount = 24;
  const radius = canvas.width / 2;
  const bulbDistance = radius - 15;
  
  for (let i = 0; i < bulbCount; i++) {
    const angle = (i * 2 * Math.PI) / bulbCount;
    const x = radius + Math.cos(angle) * bulbDistance;
    const y = radius + Math.sin(angle) * bulbDistance;
    const color = colors[i % colors.length];
    
    const bulb = document.createElement('div');
    bulb.className = 'wheel-decoration carnival-bulb-working';
    bulb.style.cssText = `
      position: absolute;
      left: ${x - 4}px;
      top: ${y - 4}px;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid #333;
      box-shadow: 0 0 4px ${color};
      z-index: 5;
    `;
    container.appendChild(bulb);
    console.log(`✅ Карнавал лампочка ${i} добавлена на (${x}, ${y}) цвет ${color}`);
  }
}

function addTwinklingStarsDecoration(container, canvas) {
  const starCount = 10;
  const radius = canvas.width / 2;
  const starDistance = radius - 14;
  
  for (let i = 0; i < starCount; i++) {
    const angle = (i * 2 * Math.PI) / starCount;
    const x = radius + Math.cos(angle) * starDistance;
    const y = radius + Math.sin(angle) * starDistance;
    
    const star = document.createElement('div');
    star.className = 'wheel-decoration twinkling-star';
    star.innerHTML = '💎';
    star.style.cssText = `
      position: absolute;
      left: ${x - 6}px;
      top: ${y - 6}px;
      font-size: 10px;
      filter: hue-rotate(${i * 36}deg);
      z-index: 5;
      animation: royalSparkle 3s infinite;
      animation-delay: ${i * 0.3}s;
    `;
    container.appendChild(star);
  }
}

function addLightningBoltsDecoration(container, canvas) {
  console.log('⚡ LIGHTNING BOLTS - рабочая версия');
  
  const boltCount = 10;
  const radius = canvas.width / 2;
  const boltDistance = radius - 12;
  
  for (let i = 0; i < boltCount; i++) {
    const angle = (i * 2 * Math.PI) / boltCount;
    const x = radius + Math.cos(angle) * boltDistance;
    const y = radius + Math.sin(angle) * boltDistance;
    
    const bolt = document.createElement('div');
    bolt.className = 'wheel-decoration lightning-bolt-working';
    bolt.innerHTML = '⚡';
    bolt.style.cssText = `
      position: absolute;
      left: ${x - 10}px;
      top: ${y - 10}px;
      font-size: 18px;
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
      z-index: 999;
      opacity: 1;
      animation: lightningFlashWorking 2s infinite;
      animation-delay: ${i * 0.25}s;
    `;
    container.appendChild(bolt);
    console.log(`✅ Молния ${i} добавлена на (${x}, ${y})`);
  }
}

// Функция для очистки всех декораций
function clearAllDecorations() {
  const container = document.getElementById('wheel-canvas').parentElement;
  const allDecorations = container.querySelectorAll('.wheel-decoration');
  allDecorations.forEach(el => el.remove());
  console.log(`🧹 Удалено ${allDecorations.length} элементов декораций`);
}

window.clearAllDecorations = clearAllDecorations;

function addWhiteDotsDecoration(container, canvas) {
  const dotCount = 24;
  const radius = canvas.width / 2;
  const dotDistance = radius + 15;
  
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * 2 * Math.PI) / dotCount;
    const x = radius + Math.cos(angle) * dotDistance;
    const y = radius + Math.sin(angle) * dotDistance;
    
    const dot = document.createElement('div');
    dot.className = 'wheel-decoration white-dot';
    dot.style.cssText = `
      position: absolute;
      left: ${x - 4}px;
      top: ${y - 4}px;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
      z-index: 5;
    `;
    container.appendChild(dot);
  }
}

// ИСПРАВЛЕННАЯ функция Golden Stars
function addGoldenStarsDecoration(container, canvas) {
  const starCount = 12;
  const radius = canvas.width / 2;
  const starDistance = radius + 15;
  
  for (let i = 0; i < starCount; i++) {
    const angle = (i * 2 * Math.PI) / starCount;
    const x = radius + Math.cos(angle) * starDistance;
    const y = radius + Math.sin(angle) * starDistance;
    
    const star = document.createElement('div');
    star.className = 'wheel-decoration golden-star';
    star.innerHTML = '⭐';
    star.style.cssText = `
      position: absolute;
      left: ${x - 8}px;
      top: ${y - 8}px;
      font-size: 16px;
      color: #ffd700;
      text-shadow: 0 0 4px #b8860b;
      z-index: 5;
      animation: twinkle 2s infinite;
    `;
    container.appendChild(star);
  }
}


function addGlowingDotsDecoration(container, canvas) {
  const dotCount = 20;
  const radius = canvas.width / 2;
  const dotDistance = radius - 12;
  
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * 2 * Math.PI) / dotCount;
    const x = radius + Math.cos(angle) * dotDistance;
    const y = radius + Math.sin(angle) * dotDistance;
    
    const dot = document.createElement('div');
    dot.className = 'wheel-decoration glowing-dot';
    dot.style.cssText = `
      position: absolute;
      left: ${x - 5}px;
      top: ${y - 5}px;
      width: 10px;
      height: 10px;
      background: #39ff14;
      border-radius: 50%;
      box-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14;
      z-index: 5;
      animation: neonPulse 1.5s infinite alternate;
    `;
    container.appendChild(dot);
  }
}

function addBrassStudsDecoration(container, canvas) {
  const studCount = 16;
  const radius = canvas.width / 2;
  const studDistance = radius + 18;
  
  for (let i = 0; i < studCount; i++) {
    const angle = (i * 2 * Math.PI) / studCount;
    const x = radius + Math.cos(angle) * studDistance;
    const y = radius + Math.sin(angle) * studDistance;
    
    const stud = document.createElement('div');
    stud.className = 'wheel-decoration brass-stud';
    stud.style.cssText = `
      position: absolute;
      left: ${x - 6}px;
      top: ${y - 6}px;
      width: 12px;
      height: 12px;
      background: radial-gradient(circle, #ffd700 0%, #b8860b 70%, #654321 100%);
      border-radius: 50%;
      border: 1px solid #654321;
      box-shadow: inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.3);
      z-index: 5;
    `;
    container.appendChild(stud);
  }
}

// Функция для добавления декоративных элементов к колесу
function addWheelDecorations() {
  if (!wheel || !wheel._currentTheme) return;
  
  const canvas = wheel.canvas;
  const container = canvas.parentElement;
  const theme = wheel._currentTheme;
  
  // Удаляем старые декорации
  const oldDecorations = container.querySelectorAll('.wheel-decoration');
  oldDecorations.forEach(el => el.remove());
  
  // Добавляем новые декорации в зависимости от темы
  switch(theme.decorativeElements) {
    case 'white_dots':
      addWhiteDotsDecoration(container, canvas);
      break;
    case 'golden_stars':
      addGoldenStarsDecoration(container, canvas);
      break;
    case 'glowing_dots':
      addGlowingDotsDecoration(container, canvas);
      break;
    case 'brass_studs':
      addBrassStudsDecoration(container, canvas);
      break;
    case 'blinking_dots':
      addBlinkingDotsDecoration(container, canvas);
      break;
    case 'carnival_bulbs':
      addCarnivalBulbsDecoration(container, canvas);
      break;
    case 'disco_bulbs':
      addDiscoBulbsDecoration(container, canvas);
      break;
    case 'twinkling_stars':
      addTwinklingStarsDecoration(container, canvas);
      break;
    case 'lightning_bolts':
      addLightningBoltsDecoration(container, canvas);
      break;
  }
}

// Функции для создания ободков (тоже добавь ПЕРЕД applySelectedTheme)
function createGoldClassicBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border gold-classic';
  
  const size = canvas.width + 40;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(#ffd700, #ffed4e, #ffd700, #b8860b, #ffd700);
    z-index: 1;
    box-shadow: 
      inset 0 0 20px rgba(255, 215, 0, 0.8),
      0 0 30px rgba(255, 215, 0, 0.5),
      0 0 50px rgba(255, 215, 0, 0.3);
  `;
  
  const innerBorder = document.createElement('div');
  innerBorder.style.cssText = `
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    background: #8b7355;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  `;
  
  borderElement.appendChild(innerBorder);
  container.appendChild(borderElement);
}

function createDarkElegantBorder(container, canvas, theme) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border dark-elegant';
  
  const size = canvas.width + 30;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(135deg, #2c3e50, #34495e, #2c3e50);
    border: 3px solid #1a252f;
    z-index: 1;
    box-shadow: 
      inset 0 0 20px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(44, 62, 80, 0.6),
      0 5px 15px rgba(0, 0, 0, 0.4);
  `;
  
  const innerRing = document.createElement('div');
  innerRing.style.cssText = `
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 50%;
    border: 2px solid #4a6741;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  `;
  
  borderElement.appendChild(innerRing);
  container.appendChild(borderElement);
}

function createNeonGlowBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border neon-glow';
  
  const size = canvas.width + 35;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, transparent 60%, #39ff14 61%, #39ff14 65%, transparent 66%);
    z-index: 1;
    box-shadow: 
      0 0 20px #39ff14,
      0 0 40px #39ff14,
      0 0 60px #39ff14,
      inset 0 0 20px #39ff14;
    animation: neonRotate 3s linear infinite;
  `;
  
  container.appendChild(borderElement);
}

function createWoodFrameBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border wood-frame';
  
  const size = canvas.width + 50;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: 
      radial-gradient(circle at 30% 30%, #DEB887, #8B4513),
      linear-gradient(45deg, #D2691E 25%, transparent 25%),
      linear-gradient(-45deg, #CD853F 25%, transparent 25%);
    border: 8px solid #654321;
    z-index: 1;
    box-shadow: 
      inset 0 0 30px rgba(139, 69, 19, 0.8),
      0 0 20px rgba(101, 67, 33, 0.6);
  `;
  
  container.appendChild(borderElement);
}

function createDottedBorder(container, canvas) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border dotted-border';
  
  const size = canvas.width + 25;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #2c3e50;
    border: 5px dashed #ffffff;
    z-index: 1;
    box-shadow: 0 0 15px rgba(44, 62, 80, 0.8);
  `;
  
  container.appendChild(borderElement);
}

function createGradientBorder(container, canvas, theme) {
  const borderElement = document.createElement('div');
  borderElement.className = 'custom-wheel-border gradient-border';
  
  const size = canvas.width + 30;
  borderElement.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #ff0000, #ff8000, #ffff00, #00ff00, 
      #0080ff, #8000ff, #ff0080, #ff0000
    );
    z-index: 1;
    animation: rainbowSpin 4s linear infinite;
  `;
  
  container.appendChild(borderElement);
}

// Функция для применения специальных стилей ободка
function applyBorderStyle(borderStyle, theme) {
  const canvas = wheel.canvas;
  const container = canvas.parentElement;
  
  // Удаляем старые стили ободка
  const oldBorders = container.querySelectorAll('.custom-wheel-border');
  oldBorders.forEach(el => el.remove());
  
  // Убираем кастомный ободок из wheel если был
  if (wheel.wheelBorderImage) {
    wheel.wheelBorderImage = null;
  }
  
  // Создаем кастомный ободок в зависимости от стиля
  switch(borderStyle) {
    case 'gold_classic':
      createGoldClassicBorder(container, canvas);
      break;
    case 'dark_elegant':
      createDarkElegantBorder(container, canvas, theme);
      break;
    case 'neon_glow':
      createNeonGlowBorder(container, canvas);
      break;
    case 'wood_frame':
      createWoodFrameBorder(container, canvas);
      break;
    case 'dotted_border':
      createDottedBorder(container, canvas);
      break;
    case 'gradient_border':
      createGradientBorder(container, canvas, theme);
      break;
  }
}
// Применение выбранной темы
function applySelectedTheme() {
  if (!selectedTheme) {
    notifications.warning('Please select a theme first');
    return;
  }
  
  if (!wheel) {
    notifications.error('Wheel not initialized');
    return;
  }
  
  const theme = wheelDesignThemes[selectedTheme];
  if (!theme) {
    notifications.error('Theme not found');
    return;
  }
  
  console.log('🎨 Применяем тему дизайна:', theme.name);
  
  // Применяем цвета темы
  wheel.itemBackgroundColors = [...theme.colors];
  
  // Применяем стиль границы
  wheel.borderWidth = theme.borderWidth;
  wheel.borderColor = theme.borderColor;
  
  // Очищаем индивидуальные цвета элементов
  const items = wheel.items.map(item => ({
    ...item,
    backgroundColor: null
  }));
  wheel.items = items;
  
  // Сохраняем текущую тему для декоративных элементов
  wheel._currentTheme = theme;
  
  // НОВОЕ: Применяем специальный стиль ободка
  applyBorderStyle(theme.borderStyle, theme);
  
  // Обновляем отображение
  wheel.refresh();
  updateItemsList();
  
  // Добавляем декоративные элементы
  setTimeout(() => {
    addWheelDecorations();
  }, 100);
  
  notifications.success(`Applied theme: ${theme.name}`);
  console.log('✅ Тема применена:', selectedTheme);
}

function applyBorderStyle(borderStyle, theme) {
  const canvas = wheel.canvas;
  const container = canvas.parentElement;
  
  // Удаляем старые стили ободка
  const oldBorders = container.querySelectorAll('.custom-wheel-border');
  oldBorders.forEach(el => el.remove());
  
  if (wheel.wheelBorderImage) {
    wheel.wheelBorderImage = null;
  }
  
  switch(borderStyle) {
    case 'gold_classic':
      createGoldClassicBorder(container, canvas);
      break;
    case 'gold_classic_thick':
      createGoldClassicThick(container, canvas);
      break;
    case 'dark_elegant':
      createDarkElegantBorder(container, canvas, theme);
      break;
    case 'dark_metallic':
      createDarkMetallic(container, canvas);
      break;
    case 'galaxy_border':
      createGalaxyBorder(container, canvas);
      break;
    case 'gold_rays':
      createGoldRays(container, canvas);
      break;
    case 'blue_metallic':
      createBlueMetallic(container, canvas);
      break;
    case 'fire_border':
      createFireBorder(container, canvas);
      break;
    case 'emerald_lights':
      createEmeraldLights(container, canvas);
      break;
    case 'royal_border':
      createRoyalBorder(container, canvas);
      break;
    case 'luxury_gold':
      createLuxuryGold(container, canvas);
      break;
    case 'neon_glow':
      createNeonGlowBorder(container, canvas);
      break;
    case 'wood_frame':
      createWoodFrameBorder(container, canvas);
      break;
    case 'dotted_border':
      createDottedBorder(container, canvas);
      break;
    case 'dotted_lights':
      createDottedLights(container, canvas);
      break;
    case 'gradient_border':
      createGradientBorder(container, canvas, theme);
      break;
    case 'carnival_lights':
      createCarnivalLights(container, canvas);
      break;
    case 'disco_lights':
      createDiscoLights(container, canvas);
      break;
    case 'electric_border':
      createElectricBorder(container, canvas);
      break;
    case 'neon_rainbow':
      createNeonRainbow(container, canvas);
      break;
  }
}



// Настройка обработчиков тем
function setupThemeHandlers() {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      selectTheme(this.dataset.theme);
    });
  });
}

function showDetailedStatistics() {
  // Создаем модальное окно со статистикой
  const modal = document.createElement('div');
  modal.id = 'stats-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  let statsHTML = `
    <h3 style="margin-top: 0; color: #333;">📊 Detailed Statistics</h3>
    <p><strong>Total Spins:</strong> ${statistics.totalSpins}</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd;">Sector</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Count</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Percentage</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Limit</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Сортируем результаты по количеству выпадений
  const sortedResults = Object.entries(statistics.results)
    .sort(([,a], [,b]) => b - a);
  
  sortedResults.forEach(([sector, count]) => {
    const percentage = statistics.totalSpins > 0 ? ((count / statistics.totalSpins) * 100).toFixed(1) : 0;
    const limit = sectorLimits[sector]?.limit || 'None';
    const limitReached = limit !== 'None' && count >= limit;
    const status = limitReached ? '🚫 Reached' : '✅ Active';
    
    statsHTML += `
      <tr style="${limitReached ? 'background: #ffe6e6;' : ''}">
        <td style="padding: 8px; border: 1px solid #ddd;">${sector}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${percentage}%</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${limit}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${status}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
          <button onclick="setSectorLimit('${sector}')" class="btn-small btn-secondary">Set Limit</button>
        </td>
      </tr>
    `;
  });
  
  statsHTML += `
      </tbody>
    </table>
    <div style="margin-top: 20px;">
      <button onclick="exportStatistics()" class="btn btn-secondary" style="margin-right: 10px;">Export CSV</button>
      <button onclick="closeStatsModal()" class="btn btn-primary">Close</button>
    </div>
  `;
  
  content.innerHTML = statsHTML;
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Закрытие по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeStatsModal();
    }
  });
}

function closeStatsModal() {
  const modal = document.getElementById('stats-modal');
  if (modal) {
    modal.remove();
  }
}
function saveSectorLimitValue(sectorName) {
  const input = document.getElementById('limit-input');
  if (!input) return;
  
  const newLimit = input.value.trim();
  
  if (newLimit === '' || newLimit === '0') {
    // Удаляем лимит
    delete sectorLimits[sectorName];
    if (typeof notifications !== 'undefined') {
      notifications.info(`Limit removed for "${sectorName}"`);
    }
  } else {
    const limit = parseInt(newLimit);
    if (isNaN(limit) || limit < 1) {
      if (typeof notifications !== 'undefined') {
        notifications.error('Please enter a valid number greater than 0');
      }
      return;
    }
    
    sectorLimits[sectorName] = {
      limit: limit,
      current: statistics.results[sectorName] || 0
    };
    
    if (typeof notifications !== 'undefined') {
      notifications.success(`Limit set to ${limit} for "${sectorName}"`);
    }
  }
  
  // Сохраняем лимиты
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('sectorLimits', JSON.stringify(sectorLimits));
  }
  
  closeLimitModal();
  
  // Обновляем статистику если окно открыто
  if (document.getElementById('stats-modal')) {
    closeStatsModal();
    showDetailedStatistics();
  }
}

function closeLimitModal() {
  const modal = document.getElementById('limit-modal');
  if (modal) {
    modal.remove();
  }
}

function setSectorLimit(sectorName) {
  const currentLimit = sectorLimits[sectorName]?.limit || '';
  
  // Создаем кастомное модальное окно вместо prompt
  const modal = document.createElement('div');
  modal.id = 'limit-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 400px;
    width: 90%;
    text-align: center;
  `;
  
  content.innerHTML = `
    <h3 style="margin-top: 0; color: #333;">Set Limit for "${sectorName}"</h3>
    <p style="color: #666;">Current limit: ${currentLimit || 'None'}</p>
    <input type="number" id="limit-input" value="${currentLimit}" 
           placeholder="Enter limit (0 to remove)" 
           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; margin: 15px 0;">
    <div style="margin-top: 20px;">
      <button onclick="saveSectorLimitValue('${sectorName}')" class="btn btn-primary" 
              style="margin-right: 10px; padding: 10px 20px;">Save</button>
      <button onclick="closeLimitModal()" class="btn btn-secondary" 
              style="padding: 10px 20px;">Cancel</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Фокус на инпут и выделяем текст
  setTimeout(() => {
    const input = document.getElementById('limit-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
  
  // Закрытие по ESC
  const handleKeydown = (e) => {
    if (e.code === 'Escape') {
      closeLimitModal();
      document.removeEventListener('keydown', handleKeydown);
    } else if (e.code === 'Enter') {
      saveSectorLimitValue(sectorName);
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
  
  // Закрытие по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeLimitModal();
    }
  });
}

function exportStatistics() {
  let csvContent = 'Sector,Count,Percentage,Limit,Status\n';
  
  Object.entries(statistics.results).forEach(([sector, count]) => {
    const percentage = statistics.totalSpins > 0 ? ((count / statistics.totalSpins) * 100).toFixed(1) : 0;
    const limit = sectorLimits[sector]?.limit || 'None';
    const limitReached = limit !== 'None' && count >= limit;
    const status = limitReached ? 'Reached' : 'Active';
    
    csvContent += `"${sector}",${count},${percentage}%,${limit},${status}\n`;
  });
  
  // Добавляем общую информацию
  csvContent += `\nTotal Spins,${statistics.totalSpins}\n`;
  csvContent += `Export Date,${new Date().toISOString()}\n`;
  
  // Скачиваем файл
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wheel-statistics-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  notifications.success('Statistics exported successfully!');
}

const translations = {
  en: {
    // Title
    title: 'Wheel of Fortune - Full Customization',
    
    // Tabs
    presets: 'Presets',
    items: 'Items', 
    design: 'Design',
    custom: 'Custom',
    settings: 'Settings',
    
    // Presets tab
    wheelPresets: 'Wheel Presets',
    selectSectors: 'Select number of sectors:',
    sectors4: '4 sectors',
    sectors8: '8 sectors', 
    sectors16: '16 sectors',
    sectors32: '32 sectors',
    presetDescription: 'Each preset automatically configures correct angles for precise winner determination.',
    quickSetup: 'Quick Setup',
    randomColors: 'Random Colors',
    equalChances: 'Equal Chances',
    
    // Items tab
    wheelItems: 'Wheel Items',
    itemsList: 'Items List:',
    itemsDescription: 'Use presets to change the number of sectors. Here you can configure names, weights and images.',
    namePlaceholder: 'Name',
    weightPlaceholder: 'Weight',
    removePhoto: 'Remove Photo',
    photo: 'Photo',
    
    // Design tab
    wheelDesign: 'Wheel Design',
    itemColors: 'Item Colors',
    colorScheme: 'Color Scheme:',
    rainbow: 'Rainbow',
    pastel: 'Pastel',
    bright: 'Bright',
    dark: 'Dark',
    neon: 'Neon',
    ocean: 'Ocean',
    sunset: 'Sunset',
    forest: 'Forest',
    createNew: 'Create New...',
    applyScheme: 'Apply Scheme',
    colorSchemeHelp: '💡 Color schemes replace individual sector colors. Use the "Items" tab to configure individual colors.',
    fontAndText: 'Font and Text',
    fontSize: 'Font Size:',
    textColor: 'Text Color:',
    bordersAndLines: 'Borders and Lines',
    borderWidth: 'Border Width:',
    borderColor: 'Border Color:',
    quickActions: 'Quick Actions',
    clearAllColors: 'Clear All Colors',
    copyFromScheme: 'Copy from Scheme',
    quickActionsHelp: '"Clear All Colors" - removes individual sector colors\n"Copy from Scheme" - applies current scheme as individual colors',
    
    // Custom tab
    fullCustomization: 'Full Customization',
    appBackground: 'App Background',
    uploadBackground: 'Upload background image',
    selectBackground: 'Select Background',
    removeBackground: 'Remove Background',
    wheelBorder: 'Wheel Border',
    uploadBorder: 'Upload PNG/GIF for custom border (GIFs will be animated)',
    selectBorder: 'Select Border',
    removeBorder: 'Remove Border',
    winnerWindowStyle: 'Winner Window Style',
    winnerWindowBackground: 'Winner Window Background:',
    windowTextColor: 'Window Text Color:',
    
    // Settings tab
    wheelSettings: 'Wheel Settings',
    rotation: 'Rotation',
    spinSpeed: 'Spin Speed:',
    spinDuration: 'Spin Duration (sec):',
    sound: 'Sound',
    enableSounds: 'Enable Sounds',
    statistics: 'Statistics',
    showStatistics: 'Show Statistics',
    resetStatistics: 'Reset Statistics',
    project: 'Project',
    saveProject: 'Save Project',
    loadProject: 'Load Project',
    
    // Buttons
    spinWheel: 'SPIN WHEEL',
    stop: 'STOP',
    reset: 'RESET',
    export: 'EXPORT',
    exhibitionMode: 'EXHIBITION MODE',
    close: 'Close',
    spinAgain: 'Spin Again',
    cancel: 'Cancel',
    apply: 'Apply',
    delete: 'Delete',
    
    // Status bar
    itemsCount: 'Items:',
    preset: 'Preset:',
    lastResult: 'Last Result:',
    totalSpins: 'Total Spins:',
    
    // Popup
    result: 'Result!',
    
    // Color scheme editor
    customColorScheme: 'Custom Color Scheme',
    configureColors: 'Configure colors for wheel sectors. Colors will repeat cyclically.',
    addColor: 'Add Color',
    resetToRainbow: 'Reset to Rainbow',
    saveAsNamed: 'Save as named scheme:',
    schemeName: 'Scheme Name',
    saveScheme: 'Save Scheme',
    
    // Notifications
    addMinimumItems: 'Add at least 2 items to spin',
    appliedPreset: 'Applied preset:',
    randomColorsApplied: 'Random colors applied',
    appliedScheme: 'Applied scheme:',
    equalChancesSet: 'Equal chances set for all sectors',
    individualColorsCleared: 'Individual sector colors cleared',
    schemeColorsSet: 'Scheme colors set as individual sector colors',
    backgroundLoaded: 'Background loaded successfully!',
    backgroundRemoved: 'Background removed',
    borderLoaded: 'Border loaded successfully!',
    borderRemoved: 'Border removed',
    popupBackgroundLoaded: 'Popup background loaded!',
    exhibitionEnabled: 'Exhibition mode enabled. ESC to exit',
    exhibitionDisabled: 'Exhibition mode disabled',
    customColorsApplied: 'Custom colors applied',
    enterSchemeName: 'Enter scheme name',
    alreadyExists: 'already exists. Overwrite?',
    minimumColors: 'Must have at least 2 colors',
    schemeSaved: 'saved!',
    
    // Statistics
    totalSpinsLabel: 'Total spins:',
    resultsLabel: 'Results:',
    times: 'times',
    resetStatsConfirm: 'Are you sure you want to reset all statistics?',
    
    // Project
    projectSaved: 'Project saved',
    projectLoadError: 'Project loading error:',
    projectLoaded: 'Project loaded successfully'
  },
  
  he: {
    // Title
    title: 'גלגל המזל - התאמה אישית מלאה',
    
    // Tabs
    presets: 'תבניות',
    items: 'פריטים',
    design: 'עיצוב', 
    custom: 'התאמה אישית',
    settings: 'הגדרות',
    
    // Presets tab
    wheelPresets: 'תבניות גלגל',
    selectSectors: 'בחר מספר מקטעים:',
    sectors4: '4 מקטעים',
    sectors8: '8 מקטעים',
    sectors16: '16 מקטעים', 
    sectors32: '32 מקטעים',
    presetDescription: 'כל תבנית מגדירה אוטומטית זוויות נכונות לקביעת זוכה מדויקת.',
    quickSetup: 'הגדרה מהירה',
    randomColors: 'צבעים אקראיים',
    equalChances: 'סיכויים שווים',
    
    // Items tab
    wheelItems: 'פריטי גלגל',
    itemsList: 'רשימת פריטים:',
    itemsDescription: 'השתמש בתבניות לשינוי מספר המקטעים. כאן ניתן להגדיר שמות, משקלים ותמונות.',
    namePlaceholder: 'שם',
    weightPlaceholder: 'משקל',
    removePhoto: 'הסר תמונה',
    photo: 'תמונה',
    
    // Design tab
    wheelDesign: 'עיצוב גלגל',
    itemColors: 'צבעי פריטים',
    colorScheme: 'ערכת צבעים:',
    rainbow: 'קשת',
    pastel: 'פסטל',
    bright: 'בהיר',
    dark: 'כהה',
    neon: 'ניאון',
    ocean: 'אוקיינוס',
    sunset: 'שקיעה',
    forest: 'יער',
    createNew: 'צור חדש...',
    applyScheme: 'החל ערכה',
    colorSchemeHelp: '💡 ערכות צבעים מחליפות צבעי מקטעים בודדים. השתמש בלשונית "פריטים" להגדרת צבעים בודדים.',
    fontAndText: 'גופן וטקסט',
    fontSize: 'גודל גופן:',
    textColor: 'צבע טקסט:',
    bordersAndLines: 'גבולות וקווים',
    borderWidth: 'עובי גבול:',
    borderColor: 'צבע גבול:',
    quickActions: 'פעולות מהירות',
    clearAllColors: 'נקה כל הצבעים',
    copyFromScheme: 'העתק מערכה',
    quickActionsHelp: '"נקה כל הצבעים" - מסיר צבעי מקטעים בודדים\n"העתק מערכה" - מחיל ערכה נוכחית כצבעים בודדים',
    
    // Custom tab
    fullCustomization: 'התאמה אישית מלאה',
    appBackground: 'רקע אפליקציה',
    uploadBackground: 'העלה תמונת רקע',
    selectBackground: 'בחר רקע',
    removeBackground: 'הסר רקע',
    wheelBorder: 'מסגרת גלגל',
    uploadBorder: 'העלה PNG/GIF למסגרת מותאמת (GIF יהיו מונפשים)',
    selectBorder: 'בחר מסגרת',
    removeBorder: 'הסר מסגרת',
    winnerWindowStyle: 'סגנון חלון זוכה',
    winnerWindowBackground: 'רקע חלון זוכה:',
    windowTextColor: 'צבע טקסט חלון:',
    
    // Settings tab
    wheelSettings: 'הגדרות גלגל',
    rotation: 'סיבוב',
    spinSpeed: 'מהירות סיבוב:',
    spinDuration: 'משך סיבוב (שניות):',
    sound: 'צליל',
    enableSounds: 'הפעל צלילים',
    statistics: 'סטטיסטיקה',
    showStatistics: 'הצג סטטיסטיקה',
    resetStatistics: 'איפוס סטטיסטיקה',
    project: 'פרויקט',
    saveProject: 'שמור פרויקט',
    loadProject: 'טען פרויקט',
    
    // Buttons
    spinWheel: 'סובב גלגל',
    stop: 'עצור',
    reset: 'איפוס',
    export: 'יצוא',
    exhibitionMode: 'מצב תצוגה',
    close: 'סגור',
    spinAgain: 'סובב שוב',
    cancel: 'ביטול',
    apply: 'החל',
    delete: 'מחק',
    
    // Status bar
    itemsCount: 'פריטים:',
    preset: 'תבנית:',
    lastResult: 'תוצאה אחרונה:',
    totalSpins: 'סיבובים סה"כ:',
    
    // Popup
    result: 'תוצאה!',
    
    // Color scheme editor
    customColorScheme: 'ערכת צבעים מותאמת',
    configureColors: 'הגדר צבעים למקטעי הגלגל. הצבעים יחזרו על עצמם באופן מחזורי.',
    addColor: 'הוסף צבע',
    resetToRainbow: 'איפוס לקשת',
    saveAsNamed: 'שמור כערכה בעלת שם:',
    schemeName: 'שם ערכה',
    saveScheme: 'שמור ערכה',
    
    // Notifications
    addMinimumItems: 'הוסף לפחות 2 פריטים לסיבוב',
    appliedPreset: 'הוחלה תבנית:',
    randomColorsApplied: 'הוחלו צבעים אקראיים',
    appliedScheme: 'הוחלה ערכה:',
    equalChancesSet: 'נקבעו סיכויים שווים לכל המקטעים',
    individualColorsCleared: 'נוקו צבעי מקטעים בודדים',
    schemeColorsSet: 'צבעי ערכה נקבעו כצבעים בודדים',
    backgroundLoaded: 'רקע נטען בהצלחה!',
    backgroundRemoved: 'רקע הוסר',
    borderLoaded: 'מסגרת נטענה בהצלחה!',
    borderRemoved: 'מסגרת הוסרה',
    popupBackgroundLoaded: 'רקע חלון נטען!',
    exhibitionEnabled: 'מצב תצוגה הופעל. ESC ליציאה',
    exhibitionDisabled: 'מצב תצוגה הושבת',
    customColorsApplied: 'צבעים מותאמים הוחלו',
    enterSchemeName: 'הכנס שם ערכה',
    alreadyExists: 'כבר קיים. לשכתב?',
    minimumColors: 'חייב להיות לפחות 2 צבעים',
    schemeSaved: 'נשמר!',
    
    // Statistics
    totalSpinsLabel: 'סה"כ סיבובים:',
    resultsLabel: 'תוצאות:',
    times: 'פעמים',
    resetStatsConfirm: 'אתה בטוח שברצונך לאפס את כל הסטטיסטיקה?',
    
    // Project
    projectSaved: 'פרויקט נשמר',
    projectLoadError: 'שגיאת טעינת פרויקט:',
    projectLoaded: 'פרויקט נטען בהצלחה'
  }
};

function switchLanguage(lang) {
  currentLanguage = lang;
  
  // Обновляем направление текста
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  
  // Обновляем все тексты
  updateAllTexts();
  
  // Сохраняем выбор
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('wheelLanguage', lang);
  }
  
  console.log(`🌐 Язык переключен на: ${lang}`);
}

function updateAllTexts() {
  const t = translations[currentLanguage];
  
  // Title
  document.title = t.title;
  
  // Tabs - с проверками
  const tabPresets = document.querySelector('[data-tab="presets"]');
  if (tabPresets) tabPresets.textContent = t.presets;
  
  const tabItems = document.querySelector('[data-tab="items"]');
  if (tabItems) tabItems.textContent = t.items;
  
  const tabDesign = document.querySelector('[data-tab="design"]');
  if (tabDesign) tabDesign.textContent = t.design;
  
  const tabCustom = document.querySelector('[data-tab="custom"]');
  if (tabCustom) tabCustom.textContent = t.custom;
  
  const tabSettings = document.querySelector('[data-tab="settings"]');
  if (tabSettings) tabSettings.textContent = t.settings;
  
  // Основные кнопки
  const spinBtn = document.getElementById('spin-btn');
  if (spinBtn) spinBtn.textContent = t.spinWheel;
  
  const stopBtn = document.querySelector('button[onclick="stopWheel()"]');
  if (stopBtn) stopBtn.textContent = t.stop;
  
  const resetBtn = document.querySelector('button[onclick="resetWheel()"]');
  if (resetBtn) resetBtn.textContent = t.reset;
  
  const exportBtn = document.querySelector('button[onclick="exportImage()"]');
  if (exportBtn) exportBtn.textContent = t.export;
  
  const exhibitionBtn = document.querySelector('button[onclick="toggleExhibitionMode()"]');
  if (exhibitionBtn) exhibitionBtn.textContent = t.exhibitionMode;
  
  // Остальные элементы будем обновлять по мере необходимости
  console.log('✅ Базовые тексты обновлены для языка:', currentLanguage);
}

function updateStatusBarTexts() {
  const t = translations[currentLanguage];
  const statusBar = document.querySelector('.status-bar');
  const itemsCount = document.getElementById('items-count').textContent;
  const currentPreset = document.getElementById('current-preset').textContent;
  const lastResult = document.getElementById('last-result').textContent;
  const totalSpins = document.getElementById('total-spins').textContent;
  
  statusBar.innerHTML = `
    <div>
        <button onclick="switchLanguage('en')" style="margin-right: 5px; padding: 2px 6px;">EN</button>
        <button onclick="switchLanguage('he')" style="padding: 2px 6px;">עב</button>
    </div>
    <span>${t.itemsCount} <span id="items-count">${itemsCount}</span></span>
    <span>${t.preset} <span id="current-preset">${currentPreset}</span></span>
    <span>${t.lastResult} <span id="last-result">${lastResult}</span></span>
    <span>${t.totalSpins} <span id="total-spins">${totalSpins}</span></span>
  `;
}

// ИСПРАВЛЕННЫЕ И РАСШИРЕННЫЕ цветовые схемы
const colorSchemes = {
  rainbow: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff', '#ff0080'],
  pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#d4baff', '#ffbaff'],
  bright: ['#ff4757', '#ff6348', '#ffa502', '#7bed9f', '#70a1ff', '#5352ed', '#ff3838'],
  dark: ['#2f3542', '#57606f', '#3d4454', '#2f3640', '#40407a', '#706fd3', '#c44569'],
  neon: ['#ff073a', '#39ff14', '#ff3131', '#1bffff', '#bf00ff', '#ffff00', '#ff8c00'],
  ocean: ['#003d82', '#0074d9', '#7fdbff', '#39cccc', '#2ecc40', '#ffdc00', '#ff851b'],
  sunset: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#a8e6cf', '#ff8b94', '#c44569'],
  forest: ['#2d5016', '#3e6b1e', '#4f7942', '#7d8471', '#a4b494', '#c5d6a6', '#e8f5c8']
};

// Темы приложения
const themes = {
  default: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    name: 'По умолчанию'
  },
  dark: {
    background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    name: 'Темная'
  },
  sunset: {
    background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    name: 'Закат'
  },
  ocean: {
    background: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)',
    name: 'Океан'
  }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Инициализация расширенного приложения...');
  
  // Проверяем доступность необходимых классов
  if (typeof window.Wheel === 'undefined') {
    console.error('❌ Класс Wheel не найден! Проверьте загрузку wheel-lib.js');
    showError('Ошибка загрузки библиотеки колеса. Перезагрузите страницу.');
    return;
  }
  
  if (typeof window.WheelPresets === 'undefined') {
    console.error('❌ WheelPresets не найдены!');
    showError('Ошибка загрузки пресетов колеса. Перезагрузите страницу.');
    return;
  }
  
  try {
    initializeApp();
    setupEventListeners();
    loadStatistics();
	loadSectorLimits();
    loadCustomization();
    
    // Загружаем пользовательские цветовые схемы
    setTimeout(() => {
      loadCustomColorSchemes();
      console.log('✅ Пользовательские цветовые схемы загружены');
    }, 500);
    
    console.log('✅ Расширенное приложение успешно инициализировано');
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    showError('Ошибка инициализации приложения: ' + error.message);
  }
});

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff4757;
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 10000;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;
  errorDiv.innerHTML = `
    <h3>⚠️ Ошибка</h3>
    <p>${message}</p>
    <button onclick="location.reload()" style="
      background: white;
      color: #ff4757;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    ">Перезагрузить</button>
  `;
  document.body.appendChild(errorDiv);
}

// Найдите функцию toggleExhibitionMode в app.js и замените её:

async function toggleExhibitionMode() {
  exhibitionMode = !exhibitionMode;
  
  if (exhibitionMode) {
    // Включаем выставочный режим
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.status-bar').style.display = 'none';
    document.querySelector('.main-content').style.padding = '0';
    document.body.style.cursor = 'none';
    
    // НОВОЕ: Скрываем меню
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-menu', false);
      } catch (error) {
        console.log('Не удалось скрыть меню:', error);
      }
    }
    
    // Увеличиваем ВЕСЬ контейнер колеса в 2 раза
    const wheelContainer = document.querySelector('.wheel-container');
    wheelContainer.style.transform = 'scale(1.5)';
    wheelContainer.style.margin = 'auto';
    
    // Добавляем обработчик клика на весь документ
    document.addEventListener('click', globalClickHandler);
    
    console.log('🎭 Выставочный режим ВКЛЮЧЕН');
    
    if (typeof notifications !== 'undefined') {
      notifications.info('Exhibition mode enabled. PRESS ESC to exit');
    }
  } else {
    // Выключаем выставочный режим
    document.querySelector('.sidebar').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.status-bar').style.display = 'flex';
    document.querySelector('.main-content').style.padding = '20px';
    document.body.style.cursor = 'default';
    
    // НОВОЕ: Показываем меню
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-menu', true);
      } catch (error) {
        console.log('Не удалось показать меню:', error);
      }
    }
    
    // Возвращаем обычный размер
    const wheelContainer = document.querySelector('.wheel-container');
    wheelContainer.style.transform = 'none';
    wheelContainer.style.margin = '0 auto';
    
    // Удаляем глобальный обработчик клика
    document.removeEventListener('click', globalClickHandler);
    
    console.log('🎭 Exhibition mode disabled');
    
    if (typeof notifications !== 'undefined') {
      notifications.info('Exhibition mode disabled');
    }
  }
}
function globalClickHandler(e) {
  if (exhibitionMode) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖱️ Глобальный клик в выставочном режиме');
    
    if (resultPopupVisible) {
      closeResultPopup(); // Закрываем popup если он открыт
    } else {
      spinWheel(); // Иначе крутим колесо
    }
  }
}

function initializeApp() {
  console.log('🎯 Создание колеса с пресетом:', currentPreset);
  
  const container = document.getElementById('wheel-canvas');
  
  if (!container) {
    throw new Error('Контейнер wheel-canvas не найден в DOM');
  }
  
  // Получаем настройки текущего пресета
  const preset = window.WheelPresets[currentPreset];
  
  try {
    wheel = new Wheel(container, {
      preset: currentPreset,
      itemBackgroundColors: colorSchemes.rainbow,
      borderWidth: 3,
      borderColor: '#333',
      itemLabelFontSizeMax: 30,
      itemLabelColors: ['#ffffff'],
      items: preset.defaultItems,
      onSpin: (event) => {
        console.log('🎲 Колесо начало вращение:', event);
        isSpinning = true;
        updateSpinButton();
        
        if (document.getElementById('enable-sound').checked) {
          playSpinSound();
        }
      },
      onRest: (event) => {
        console.log('🎯 Колесо остановилось:', event);
        isSpinning = false;
        updateSpinButton();
        
        const winner = wheel.items[event.currentIndex];
        showResult(winner.label, event.currentIndex, winner.image);
        updateStatistics(winner.label);
        
        if (document.getElementById('enable-sound').checked) {
          playWinSound();
        }
      }
    });
    
    console.log('✅ Колесо создано успешно');
    console.log('📊 Элементов на колесе:', wheel.items.length);
    
    // ИСПРАВЛЕНИЕ 1: Переопределяем обработчик клика мыши
    if (wheel.canvas) {
	  const newCanvas = wheel.canvas.cloneNode(true);
	  wheel.canvas.parentNode.replaceChild(newCanvas, wheel.canvas);
	  wheel.canvas = newCanvas;
	  wheel._context = newCanvas.getContext('2d');
	  
	  // Добавляем ТОЛЬКО наш обработчик
	  wheel.canvas.addEventListener('click', function(e) {
		  console.log('🖱️ Клик по колесу');
		  e.preventDefault();
		  e.stopPropagation();
		  
		  if (resultPopupVisible) {
			closeResultPopup(); // Закрываем popup если он открыт
		  } else {
			spinWheel(); // Иначе крутим колесо
		  }
		});
	  
	  console.log('✅ Обработчик клика мыши переопределен');
    }
    
    // Принудительная отрисовка и изменение размеров
    setTimeout(() => {
      console.log('🔄 Принудительный resize и refresh');
      wheel.resize();
      wheel.refresh();
      
      // НОВОЕ: Инициализируем GIF позиции после создания колеса
      initializeGIFPositionUpdates();
      console.log('🎬 GIF position updates initialized');
      
      // Восстанавливаем GIF элементы если есть сохраненные данные
      restoreGIFElements();
      
    }, 100);
    
  } catch (error) {
    console.error('❌ Ошибка создания колеса:', error);
    throw new Error('Не удалось создать колесо: ' + error.message);
  }
  
  updateItemsList();
  updateUI();
  setupPresetButtons();
	setTimeout(() => {
	  // Загружаем сохраненный язык
	  if (typeof Storage !== 'undefined') {
		const savedLang = localStorage.getItem('wheelLanguage') || 'en';
		switchLanguage(savedLang);
	  } else {
		switchLanguage('en');
	  }
	  
	  console.log('✅ Язык инициализирован');
	}, 200);
}

function setupEventListeners() {
  // Вкладки
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });
  
  // Слайдеры
  setupRangeInputs();
  
  // Пресеты
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      applyPreset(this.dataset.preset);
    });
  });
  
  // Настройка кнопок загрузки файлов
  setupFileButtons();
  
  // ИСПРАВЛЕНИЕ 1: Keyboard shortcuts - используем ту же функцию spinWheel
  document.addEventListener('keydown', function(e) {
	  const activeElement = document.activeElement;
	  const isInputActive = activeElement && (
		activeElement.tagName === 'INPUT' || 
		activeElement.tagName === 'TEXTAREA' || 
		activeElement.isContentEditable
	  );	  
    if (e.code === 'Space') {
      if (isInputActive) {
      return; // Позволяем обычное поведение пробела
      }
      e.preventDefault();
      console.log('⌨️ Нажат пробел');
      // Используем ту же логику что и кнопка "Крутить"
	  if (resultPopupVisible) {
		closeResultPopup(); // Закрываем popup если он открыт
	  } else if (exhibitionMode) {
		spinWheel(); // Иначе крутим колесо
	  }
	} else if (e.code === 'Escape') {
	  if (exhibitionMode) {
		toggleExhibitionMode(); // Выходим из выставочного режима
	  } else {
		stopWheel(); // Обычное поведение - останавливаем колесо
	  }
      stopWheel();
    } else if (e.code === 'Delete') {
      removeSelectedItem();
	} else if (e.code === 'KeyE' && e.ctrlKey) {
	  e.preventDefault();
	  toggleExhibitionMode();  
    }
  });
	// Обработчики для кастомных звуков
	setTimeout(() => {
	  const soundInputs = [
		{ id: 'spin-sound-input', type: 'spin' },
		{ id: 'win-sound-input', type: 'win' }, 
		{ id: 'lose-sound-input', type: 'lose' }
	  ];
	  
	  soundInputs.forEach(({ id, type }) => {
		const input = document.getElementById(id);
		if (input) {
		  input.addEventListener('change', function() {
			if (this.files[0]) {
			  loadCustomSound(type, this);
			}
		  });
		}
	  });
	  
	  // Громкость звука
	  const volumeInput = document.getElementById('sound-volume');
	  if (volumeInput) {
		volumeInput.addEventListener('input', function() {
		  document.getElementById('sound-volume-value').textContent = this.value;
		  updateSoundVolume(this.value);
		});
	  }
	  
	  console.log('✅ Обработчики кастомных звуков настроены');
	}, 100);
	setTimeout(() => {
	  setupThemeHandlers();
	  console.log('✅ Обработчики тем настроены');
	}, 100);
  console.log('✅ Event listeners настроены с унифицированным spinWheel');
}

// Настройка обработчиков файлов
function setupFileButtons() {
  console.log('🔧 Настройка обработчиков файлов с поддержкой GIF...');
  
  setTimeout(() => {
    // Фон приложения
    const backgroundInput = document.getElementById('background-image');
    if (backgroundInput) {
      console.log('✅ Найден input для фона');
      backgroundInput.addEventListener('change', function() {
        if (this.files[0]) {
          console.log('🖼️ Выбран файл фона:', this.files[0].name);
          loadBackgroundImage(this);
        }
      });
    }
    
    // Ободок колеса
    const borderInput = document.getElementById('wheel-border-image');
    if (borderInput) {
      console.log('✅ Найден input для ободка');
      borderInput.addEventListener('change', function() {
        if (this.files[0]) {
          console.log('🖼️ Выбран файл ободка:', this.files[0].name);
          loadWheelBorderImage(this);
        }
      });
    }
    
    // Фон popup
    const popupInput = document.getElementById('popup-background');
    if (popupInput) {
      console.log('✅ Найден input для popup');
      popupInput.addEventListener('change', function() {
        if (this.files[0]) {
          console.log('🖼️ Выбран файл фона popup:', this.files[0].name);
          loadPopupBackground(this);
        }
      });
    }
    
    console.log('✅ Обработчики файлов настроены с поддержкой GIF');
  }, 100);
}

// ОБНОВЛЕННАЯ функция setupRangeInputs с правильным массивом ranges

function setupRangeInputs() {
  const ranges = [
    { id: 'font-size', valueId: 'font-size-value', callback: updateFontSize },
    { id: 'spin-speed', valueId: 'spin-speed-value' },
    { id: 'spin-duration', valueId: 'spin-duration-value' },
    { id: 'border-width', valueId: 'border-width-value', callback: updateBorderWidth } // ДОБАВЛЕН valueId
  ];
  
  ranges.forEach(range => {
    const input = document.getElementById(range.id);
    
    if (input) {
      input.addEventListener('input', function() {
        // Обновляем отображение значения если есть элемент
        const valueSpan = document.getElementById(range.valueId);
        if (valueSpan) {
          valueSpan.textContent = this.value;
        }
        
        // Вызываем callback если есть
        if (range.callback) {
          range.callback(this.value);
        }
      });
    }
  });
  
  // Цвет границы
  const borderColorInput = document.getElementById('border-color');
  if (borderColorInput) {
    borderColorInput.addEventListener('change', function() {
      wheel.borderColor = this.value;
    });
  }
  
  // Цвет текста
  const textColorInput = document.getElementById('text-color');
  if (textColorInput) {
    textColorInput.addEventListener('change', function() {
      wheel.itemLabelColors = [this.value];
    });
  }
  
  // Цвет текста popup
  const popupTextColorInput = document.getElementById('popup-text-color');
  if (popupTextColorInput) {
    popupTextColorInput.addEventListener('change', function() {
      customization.popupTextColor = this.value;
      saveCustomization();
    });
  }
}

function setupPresetButtons() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.preset === currentPreset) {
      btn.classList.add('active');
    }
  });
}

function applyPreset(presetName) {
  if (!window.WheelPresets[presetName]) {
    console.error('Пресет не найден:', presetName);
    return;
  }
  
  // Очищаем все существующие GIF элементы items
  if (window.gifHandler) {
    wheel.items.forEach((item, index) => {
      if (item.imageIsGIF) {
        window.gifHandler.removeItemGIF(index);
      }
    });
  }
  
  currentPreset = presetName;
  wheel.applyPreset(presetName);
  
  // Обновляем UI
  setupPresetButtons();
  updateItemsList();
  updateUI();
  
  // Обновляем статус бар
  document.getElementById('current-preset').textContent = window.WheelPresets[presetName].name;
  
  console.log('✅ Applied preset:', presetName);
  
  // Показываем уведомление если доступно
  if (typeof notifications !== 'undefined') {
    notifications.success(`Applied preset: ${window.WheelPresets[presetName].name}`);
  }
}

function switchTab(tabName) {
  // Убираем активный класс у всех вкладок
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Активируем выбранную вкладку
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function removeSelectedItem() {
  console.log('ℹ️ Удаление элементов отключено. Используйте пресеты для изменения количества секторов.');
}

function editItem(index, property, value) {
  const items = [...wheel.items];
  if (property === 'weight') {
    value = parseFloat(value) || 1;
  }
  items[index][property] = value;
  wheel.items = items;
  updateItemsList();
  updateUI();
}

// ИСПРАВЛЕННАЯ функция загрузки изображения элемента с поддержкой GIF
function uploadItemImage(index, file) {
  if (!file) return;
  
  console.log(`🖼️ Загружаем изображение для элемента ${index}:`, file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    const items = [...wheel.items];
    
    // Проверяем, является ли файл GIF
    if (window.gifHandler && window.gifHandler.isGIF(file)) {
      console.log(`🎬 Обнаружен анимированный GIF для элемента ${index}`);
      
      // Получаем контейнер колеса
      const wheelContainer = document.getElementById('wheel-canvas').parentElement;
      
      // Создаем анимированный GIF для элемента
      window.gifHandler.createItemGIF(dataURL, index, wheelContainer);
      
      // Сохраняем в данных элемента
      items[index].image = dataURL;
      items[index].imageIsGIF = true;
      
      // НЕ устанавливаем изображение в canvas (оно будет как DOM элемент)
      items[index].canvasImage = null;
      
    } else {
      console.log(`🖼️ Обычное изображение для элемента ${index}`);
      
      // Удаляем GIF элемента если был
      if (window.gifHandler) {
        window.gifHandler.removeItemGIF(index);
      }
      
      // Устанавливаем обычное изображение для canvas
      items[index].image = dataURL;
      items[index].imageIsGIF = false;
      items[index].canvasImage = dataURL;
    }
    
    wheel.items = items;
    updateItemsList();
    updateUI();
  };
  reader.readAsDataURL(file);
}

// ИСПРАВЛЕННАЯ функция удаления изображения элемента
function removeItemImage(index) {
  // Удаляем GIF элемента если есть
  if (window.gifHandler) {
    window.gifHandler.removeItemGIF(index);
  }
  
  const items = [...wheel.items];
  items[index].image = null;
  items[index].imageIsGIF = false;
  items[index].canvasImage = null;
  
  wheel.items = items;
  updateItemsList();
  updateUI();
}

// ОБНОВЛЕННАЯ функция обновления списка элементов с поддержкой GIF
function updateItemsList() {
  const t = translations[currentLanguage];
  const container = document.getElementById('items-list');
  container.innerHTML = '';
  
  wheel.items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.addEventListener('click', () => selectItem(index));
    
    const totalWeight = wheel.items.reduce((sum, i) => sum + (i.weight || 1), 0);
    const percentage = Math.round(((item.weight || 1) / totalWeight) * 100);
    
    // Определяем тип изображения для отображения
    const hasImage = item.image && item.image !== null;
    const isGIFImage = item.imageIsGIF || false;
    const imageTypeText = isGIFImage ? '🎬 GIF' : '🖼️';
    
    card.innerHTML = `
      <div class="item-header">
        <div class="item-label">${item.label}</div>
        <div class="item-weight">${percentage}%</div>
      </div>
      <div class="item-controls">
        <input type="text" value="${item.label}" onchange="editItem(${index}, 'label', this.value)" 
               onclick="event.stopPropagation()" class="form-control" style="font-size: 12px;" placeholder="${t.namePlaceholder}">
        <input type="number" value="${item.weight || 1}" onchange="editItem(${index}, 'weight', this.value)" 
               onclick="event.stopPropagation()" class="form-control" style="font-size: 12px;" 
               min="0.1" step="0.1" placeholder="${t.weightPlaceholder}">
        <div class="item-controls-row">
          <input type="color" value="${item.backgroundColor || getDefaultColor(index)}" 
                 onchange="editItem(${index}, 'backgroundColor', this.value)"
                 onclick="event.stopPropagation()" class="color-input" title="Цвет сектора">
          <div class="file-input-wrapper" data-item-index="${index}">
            <input type="file" accept="image/*">
            ${hasImage ? imageTypeText : t.photo}
          </div>
          ${hasImage ? `<div class="image-preview-container">
            ${isGIFImage ? '🎬' : `<img src="${item.image}" class="image-preview" onclick="event.stopPropagation()">`}
          </div>` : ''}
          ${hasImage ? `<button class="btn-small btn-danger" onclick="event.stopPropagation(); removeItemImage(${index})">${t.removePhoto}</button>` : ''}
        </div>
      </div>
    `;
    
    container.appendChild(card);
    
    // Настраиваем обработчик для кнопки загрузки фото элемента
    const fileInput = card.querySelector('input[type="file"]');
    
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        e.stopPropagation();
        if (this.files[0]) {
          console.log('🖼️ Выбран файл для элемента:', index, this.files[0].name, 'Тип:', this.files[0].type);
          uploadItemImage(index, this.files[0]);
        }
      });
    }
  });
}

function selectItem(index) {
  selectedItemIndex = index;
  
  document.querySelectorAll('.item-card').forEach((card, i) => {
    if (i === index) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function getDefaultColor(index) {
  return wheel.itemBackgroundColors[index % wheel.itemBackgroundColors.length];
}

// ИСПРАВЛЕННАЯ функция случайных цветов
function randomizeColors() {
  console.log('🎨 Генерируем случайные цвета');
  
  // Очищаем индивидуальные цвета элементов
  const items = wheel.items.map(item => ({
    ...item,
    backgroundColor: null
  }));
  
  // Создаем случайные цвета
  const colors = [];
  for (let i = 0; i < wheel.items.length; i++) {
    colors.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
  }
  
  wheel.itemBackgroundColors = colors;
  wheel.items = items;
  updateItemsList();
  
  console.log('✅ Случайные цвета применены');
  
  if (typeof notifications !== 'undefined') {
    notifications.success('Random colors applied');
  }
}

// ИСПРАВЛЕННАЯ функция применения цветовой схемы
function applyColorScheme() {
  const scheme = document.getElementById('color-scheme').value;
  
  if (scheme === 'custom') {
    // Для пользовательской схемы показываем интерфейс создания
    showCustomColorSchemeEditor();
    return;
  }
  
  if (!colorSchemes[scheme]) {
    console.error('Цветовая схема не найдена:', scheme);
    return;
  }
  
  console.log('🎨 Применяем цветовую схему:', scheme);
  
  // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Очищаем индивидуальные цвета элементов
  const items = wheel.items.map(item => ({
    ...item,
    backgroundColor: null // Сбрасываем индивидуальные цвета
  }));
  
  // Применяем новую цветовую схему
  wheel.itemBackgroundColors = [...colorSchemes[scheme]];
  wheel.items = items; // Обновляем элементы без индивидуальных цветов
  
  updateItemsList();
  
  console.log('✅ Цветовая схема применена успешно');
  
  if (typeof notifications !== 'undefined') {
    notifications.success(`Applied scheme: ${getColorSchemeName(scheme)}`);
  }
}

// Функция для получения человекочитаемого названия схемы
function getColorSchemeName(scheme) {
  const names = {
    rainbow: 'Rainbow',
    pastel: 'Pastel',
    bright: 'Bright',
    dark: 'Dark',
    neon: 'Neon',
    ocean: 'Ocean',
    sunset: 'Sunset',
    forest: 'Forest',
    custom: 'Custom'
  };
  return names[scheme] || scheme;
}

// НОВАЯ функция для редактора пользовательских цветовых схем
function showCustomColorSchemeEditor() {
  // Создаем модальное окно для редактора цветов
  const modal = document.createElement('div');
  modal.id = 'custom-color-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const currentColors = wheel.itemBackgroundColors || colorSchemes.rainbow;
  
  content.innerHTML = `
    <h3 style="margin-top: 0; color: #333;">🎨 Custom Color Scheme</h3>
    <p style="color: #666; font-size: 14px;">Configure colors for wheel sectors. Colors will repeat cyclically</p>
    
    <div id="color-inputs-container">
      ${currentColors.map((color, index) => `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="width: 60px; font-weight: 600;">Цвет ${index + 1}:</span>
          <input type="color" value="${color}" class="custom-color-input" 
                 style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
          <button onclick="removeCustomColor(${index})" class="btn-small btn-danger" 
                  style="padding: 5px 10px; font-size: 12px;">Delete</button>
        </div>
      `).join('')}
    </div>
    
    <div style="margin: 20px 0;">
      <button onclick="addCustomColor()" class="btn-small btn-success" 
              style="padding: 8px 16px; margin-right: 10px;">Add Color</button>
      <button onclick="resetToRainbow()" class="btn-small btn-secondary" 
              style="padding: 8px 16px;">Reset to default</button>
    </div>
    
    <div style="margin-top: 20px;">
      <label style="font-weight: 600; margin-bottom: 10px; display: block;">Save as named scheme:</label>
      <input type="text" id="scheme-name-input" placeholder="Schema name" 
             style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
      <button onclick="saveCustomScheme()" class="btn-small btn-success" 
              style="padding: 8px 16px; margin-right: 10px;">Save Scheme</button>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-top: 30px;">
      <button onclick="closeCustomColorEditor()" class="btn btn-secondary" 
              style="padding: 10px 20px;">Cancel</button>
      <button onclick="applyCustomColors()" class="btn btn-primary" 
              style="padding: 10px 20px;">Apply</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Добавляем обработчик закрытия по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeCustomColorEditor();
    }
  });
}

// Функции для работы с пользовательским редактором цветов
function addCustomColor() {
  const container = document.getElementById('color-inputs-container');
  const index = container.children.length;
  const newColorDiv = document.createElement('div');
  newColorDiv.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';
  newColorDiv.innerHTML = `
    <span style="width: 60px; font-weight: 600;">Цвет ${index + 1}:</span>
    <input type="color" value="#ff0000" class="custom-color-input" 
           style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
    <button onclick="removeCustomColor(${index})" class="btn-small btn-danger" 
            style="padding: 5px 10px; font-size: 12px;">Delete</button>
  `;
  container.appendChild(newColorDiv);
}

function removeCustomColor(index) {
  const container = document.getElementById('color-inputs-container');
  if (container.children.length > 2) { // Минимум 2 цвета
    container.children[index].remove();
    updateColorIndexes();
  } else {
    alert('Must have at least 2 colors');
  }
}

function updateColorIndexes() {
  const container = document.getElementById('color-inputs-container');
  Array.from(container.children).forEach((div, index) => {
    const span = div.querySelector('span');
    const button = div.querySelector('.btn-danger');
    span.textContent = `Цвет ${index + 1}:`;
    button.onclick = () => removeCustomColor(index);
  });
}

function resetToRainbow() {
  const container = document.getElementById('color-inputs-container');
  const rainbowColors = colorSchemes.rainbow;
  
  container.innerHTML = rainbowColors.map((color, index) => `
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
      <span style="width: 60px; font-weight: 600;">Цвет ${index + 1}:</span>
      <input type="color" value="${color}" class="custom-color-input" 
             style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
      <button onclick="removeCustomColor(${index})" class="btn-small btn-danger" 
              style="padding: 5px 10px; font-size: 12px;">Delete</button>
    </div>
  `).join('');
}

function saveCustomScheme() {
  const nameInput = document.getElementById('scheme-name-input');
  const schemeName = nameInput.value.trim();
  
  if (!schemeName) {
    alert('Insert schema name');
    return;
  }
  
  if (colorSchemes[schemeName]) {
    if (!confirm(`Схема "${schemeName}" already exists. Overwrite?`)) {
      return;
    }
  }
  
  const colors = Array.from(document.querySelectorAll('.custom-color-input')).map(input => input.value);
  
  if (colors.length < 2) {
    alert('Must have at least 2 colors');
    return;
  }
  
  // Сохраняем схему
  colorSchemes[schemeName] = colors;
  
  // Обновляем select с цветовыми схемами
  updateColorSchemeSelect();
  
  // Сохраняем в localStorage
  saveCustomColorSchemes();
  
  alert(`Scema "${schemeName}" Saved!`);
  nameInput.value = '';
}

function applyCustomColors() {
  const colors = Array.from(document.querySelectorAll('.custom-color-input')).map(input => input.value);
  
  if (colors.length < 2) {
    alert('Must have at least 2 colors');
    return;
  }
  
  console.log('🎨 Применяем пользовательские цвета:', colors);
  
  // Очищаем индивидуальные цвета элементов
  const items = wheel.items.map(item => ({
    ...item,
    backgroundColor: null
  }));
  
  wheel.itemBackgroundColors = colors;
  wheel.items = items;
  updateItemsList();
  
  closeCustomColorEditor();
  
  if (typeof notifications !== 'undefined') {
    notifications.success('Custom colors applied');
  }
}

function closeCustomColorEditor() {
  const modal = document.getElementById('custom-color-modal');
  if (modal) {
    modal.remove();
  }
}

// Функция для обновления select с цветовыми схемами
function updateColorSchemeSelect() {
  const select = document.getElementById('color-scheme');
  if (!select) return;
  
  // Сохраняем текущий выбор
  const currentValue = select.value;
  
  // Очищаем и заполняем заново
  select.innerHTML = '';
  
  const defaultOptions = [
    { value: 'rainbow', text: 'Rainbow' },
    { value: 'pastel', text: 'Pastel' },
    { value: 'bright', text: 'Bright' },
    { value: 'dark', text: 'Dark' },
    { value: 'neon', text: 'Neon' },
    { value: 'ocean', text: 'Ocean' },
    { value: 'sunset', text: 'Sunset' },
    { value: 'forest', text: 'Forest' }
  ];
  
  // Добавляем стандартные опции
  defaultOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    select.appendChild(optionElement);
  });
  
  // Добавляем разделитель если есть пользовательские схемы
  const customSchemes = Object.keys(colorSchemes).filter(key => 
    !defaultOptions.some(opt => opt.value === key)
  );
  
  if (customSchemes.length > 0) {
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '--- Custom schemas ---';
    select.appendChild(separator);
    
    customSchemes.forEach(schemeName => {
      const option = document.createElement('option');
      option.value = schemeName;
      option.textContent = schemeName;
      select.appendChild(option);
    });
  }
  
  // Добавляем опцию "Пользовательские"
  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = 'Create new scheme';
  select.appendChild(customOption);
  
  // Восстанавливаем выбор
  select.value = currentValue;
}

// Функции для сохранения/загрузки пользовательских схем
function saveCustomColorSchemes() {
  if (typeof Storage !== 'undefined') {
    const customSchemes = {};
    const defaultSchemes = ['rainbow', 'pastel', 'bright', 'dark', 'neon', 'ocean', 'sunset', 'forest'];
    
    Object.keys(colorSchemes).forEach(key => {
      if (!defaultSchemes.includes(key)) {
        customSchemes[key] = colorSchemes[key];
      }
    });
    
    localStorage.setItem('customColorSchemes', JSON.stringify(customSchemes));
  }
}

function loadCustomColorSchemes() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('customColorSchemes');
    if (saved) {
      const customSchemes = JSON.parse(saved);
      Object.assign(colorSchemes, customSchemes);
      updateColorSchemeSelect();
    }
  }
}

// Функция для очистки всех индивидуальных цветов элементов
function clearAllItemColors() {
  console.log('🧹 Очищаем все индивидуальные цвета элементов');
  
  const items = wheel.items.map(item => ({
    ...item,
    backgroundColor: null // Убираем индивидуальные цвета
  }));
  
  wheel.items = items;
  updateItemsList();
  
  console.log('✅ Все индивидуальные цвета очищены');
  
  if (typeof notifications !== 'undefined') {
    notifications.success('Individual sector colors cleared');
  }
}

// Функция для копирования цветов из текущей схемы как индивидуальных
function copyColorsFromScheme() {
  console.log('📋 Копируем цвета из схемы как индивидуальные');
  
  const currentScheme = wheel.itemBackgroundColors || colorSchemes.rainbow;
  
  const items = wheel.items.map((item, index) => ({
    ...item,
    backgroundColor: currentScheme[index % currentScheme.length]
  }));
  
  wheel.items = items;
  updateItemsList();
  
  console.log('✅ Цвета схемы скопированы как индивидуальные');
  
  if (typeof notifications !== 'undefined') {
    notifications.success('Scheme colors set as individual sector colors');
  }
}

// ИСПРАВЛЕННЫЕ функции обновления - замените в app.js

function updateFontSize(value) {
  const size = parseInt(value);
  console.log('🔤 Обновляем размер шрифта:', size);
  
  if (wheel && wheel.itemLabelFontSizeMax !== undefined) {
    wheel.itemLabelFontSizeMax = size;
    
    // ДОБАВЛЯЕМ: Принудительно обновляем внутренний размер шрифта
    wheel._itemLabelFontSize = size;
    
    // ДОБАВЛЯЕМ: Принудительная перерисовка
    wheel.refresh();
    
    console.log('✅ Размер шрифта обновлен:', wheel.itemLabelFontSizeMax);
  } else {
    console.error('❌ Wheel не найден или свойство недоступно');
  }
}

function updateBorderWidth(value) {
  const width = parseInt(value);
  console.log('📏 Обновляем толщину границы:', width);
  
  if (wheel && wheel.borderWidth !== undefined) {
    wheel.borderWidth = width;
    console.log('✅ Толщина границы обновлена:', wheel.borderWidth);
  } else {
    console.error('❌ Wheel не найден или свойство недоступно');
  }
}

// ИСПРАВЛЕННАЯ функция загрузки фонового изображения с поддержкой GIF
function loadBackgroundImage(input) {
  let file;
  
  // Если это файл напрямую (из альтернативного метода)
  if (input instanceof File) {
    file = input;
  } else if (input && input.files && input.files[0]) {
    file = input.files[0];
  } else {
    console.error('❌ Не удалось получить файл из input');
    return;
  }
  
  console.log('🖼️ Загружаем фон:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    // Проверяем, является ли файл GIF
    if (window.gifHandler && window.gifHandler.isGIF(file)) {
      console.log('🎬 Обнаружен анимированный GIF для фона');
      
      // Создаем анимированный GIF фон
      window.gifHandler.createBackgroundGIF(dataURL);
      
      // Сохраняем в кастомизации
      customization.backgroundImage = dataURL;
      customization.backgroundIsGIF = true;
      
    } else {
      console.log('🖼️ Обычное изображение для фона');
      
      // Удаляем GIF фон если был
      if (window.gifHandler) {
        window.gifHandler.removeBackgroundGIF();
      }
      
      // Устанавливаем обычный фон
      document.body.style.backgroundImage = `url(${dataURL})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      
      customization.backgroundImage = dataURL;
      customization.backgroundIsGIF = false;
    }
    
    document.getElementById('background-section').classList.add('has-content');
    saveCustomization();
    console.log('✅ Фон загружен успешно');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Background loaded successfully!');
    }
  };
  reader.readAsDataURL(file);
}

// ИСПРАВЛЕННАЯ функция удаления фонового изображения
function removeBackgroundImage() {
  // Удаляем GIF фон если есть
  if (window.gifHandler) {
    window.gifHandler.removeBackgroundGIF();
  }
  
  customization.backgroundImage = null;
  customization.backgroundIsGIF = false;
  
  // Возвращаем стандартный градиент
  document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  document.body.style.backgroundImage = 'none';
  document.getElementById('background-section').classList.remove('has-content');
  saveCustomization();
  console.log('🗑️ Background removed');
  
  if (typeof notifications !== 'undefined') {
    notifications.info('Background removed');
  }
}

// ИСПРАВЛЕННАЯ функция загрузки ободка колеса с поддержкой GIF
function loadWheelBorderImage(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🖼️ Загружаем ободок:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    // Проверяем, является ли файл GIF
    if (window.gifHandler && window.gifHandler.isGIF(file)) {
      console.log('🎬 Обнаружен анимированный GIF для ободка');
      
      // Получаем контейнер колеса
      const wheelContainer = document.getElementById('wheel-canvas').parentElement;
      
      // Создаем анимированный GIF ободок
      window.gifHandler.createWheelBorderGIF(dataURL, wheelContainer);
      
      // Убираем стандартный ободок из колеса
      if (wheel) {
        wheel.wheelBorderImage = null;
      }
      
      customization.wheelBorderImage = dataURL;
      customization.wheelBorderIsGIF = true;
      
    } else {
      console.log('🖼️ Обычное изображение для ободка');
      
      // Удаляем GIF ободок если был
      if (window.gifHandler) {
        window.gifHandler.removeWheelBorderGIF();
      }
      
      // Устанавливаем обычный ободок
      if (wheel) {
        wheel.wheelBorderImage = dataURL;
      }
      
      customization.wheelBorderImage = dataURL;
      customization.wheelBorderIsGIF = false;
    }
    
    document.getElementById('border-section').classList.add('has-content');
    saveCustomization();
    console.log('✅ Border loaded successfully!');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Border loaded successfully!!');
    }
  };
  reader.readAsDataURL(file);
}

// ИСПРАВЛЕННАЯ функция удаления ободка колеса
function removeWheelBorderImage() {
  // Удаляем GIF ободок если есть
  if (window.gifHandler) {
    window.gifHandler.removeWheelBorderGIF();
  }
  
  customization.wheelBorderImage = null;
  customization.wheelBorderIsGIF = false;
  
  if (wheel) {
    wheel.wheelBorderImage = null;
  }
  
  document.getElementById('border-section').classList.remove('has-content');
  saveCustomization();
  console.log('🗑️ Border removed');
  
  if (typeof notifications !== 'undefined') {
    notifications.info('Border removed');
  }
}

// ИСПРАВЛЕННАЯ функция загрузки фона popup с поддержкой GIF
function loadPopupBackground(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🖼️ Загружаем фон popup:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    customization.popupBackground = dataURL;
    customization.popupBackgroundIsGIF = window.gifHandler && window.gifHandler.isGIF(file);
    
    saveCustomization();
    console.log('✅ Popup background loaded');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Popup background loaded!');
    }
  };
  reader.readAsDataURL(file);
}

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  customization.currentTheme = themeName;
  
  if (!customization.backgroundImage) {
    document.body.style.background = theme.background;
    document.body.style.backgroundImage = 'none';
  }
  
  // Обновляем активную тему в UI
  document.querySelectorAll('.theme-preview').forEach(preview => {
    preview.classList.remove('active');
  });
  
  const themeIndex = Object.keys(themes).indexOf(themeName);
  const themePreview = document.querySelectorAll('.theme-preview')[themeIndex];
  if (themePreview) {
    themePreview.classList.add('active');
  }
  
  saveCustomization();
}

function saveCustomization() {
  if (typeof Storage !== 'undefined') {
    // Добавляем звуки в кастомизацию
    if (sounds && sounds.getSoundData) {
      customization.sounds = sounds.getSoundData();
    }
    
    localStorage.setItem('wheelCustomization', JSON.stringify(customization));
  }
}

// ИСПРАВЛЕННАЯ функция загрузки кастомизации с поддержкой GIF
function loadCustomization() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('wheelCustomization');
    if (saved) {
      customization = { ...customization, ...JSON.parse(saved) };
      
      // Применяем сохраненную кастомизацию
      if (customization.backgroundImage) {
        if (customization.backgroundIsGIF && window.gifHandler) {
          console.log('🎬 Восстанавливаем анимированный GIF фон');
          window.gifHandler.createBackgroundGIF(customization.backgroundImage);
        } else {
          console.log('🖼️ Восстанавливаем обычный фон');
          document.body.style.backgroundImage = `url(${customization.backgroundImage})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
        }
        document.getElementById('background-section').classList.add('has-content');
      }
      
      if (customization.wheelBorderImage && wheel) {
        if (customization.wheelBorderIsGIF && window.gifHandler) {
          console.log('🎬 Восстанавливаем анимированный GIF ободок');
          const wheelContainer = document.getElementById('wheel-canvas').parentElement;
          window.gifHandler.createWheelBorderGIF(customization.wheelBorderImage, wheelContainer);
        } else {
          console.log('🖼️ Восстанавливаем обычный ободок');
          wheel.wheelBorderImage = customization.wheelBorderImage;
        }
        document.getElementById('border-section').classList.add('has-content');
      }
      
      if (customization.popupTextColor) {
        document.getElementById('popup-text-color').value = customization.popupTextColor;
      }
	// Загружаем кастомные звуки
	if (customization.sounds && sounds && sounds.loadSoundData) {
	  sounds.loadSoundData(customization.sounds);
	  
	  // Отмечаем секции с загруженными звуками
	  Object.keys(customization.sounds).forEach(type => {
		const section = document.getElementById(`${type}-sound-section`);
		if (section) {
		  section.classList.add('has-content');
		}
	  });
	}

	// Загружаем громкость звука
	if (customization.soundVolume !== undefined) {
	  document.getElementById('sound-volume').value = customization.soundVolume * 100;
	  document.getElementById('sound-volume-value').textContent = Math.round(customization.soundVolume * 100);
	  sounds.setVolume(customization.soundVolume);
	}
    }
  }
}

// ИСПРАВЛЕННАЯ функция вращения с учетом весов - основная функция для всех способов запуска
function spinWheel() {
  console.log('🎲 spinWheel() вызвана');
  
  if (isSpinning) {
    console.log('⚠️ Колесо уже вращается, игнорируем');
    return;
  }
  
  if (wheel.items.length < 2) {
    alert(translations[currentLanguage].addMinimumItems);
    return;
  }
  
  // НОВОЕ: Фильтруем доступные элементы (исключаем те, что достигли лимита)
  const availableItems = wheel.items.filter((item, index) => {
    const sectorName = item.label;
    const limit = sectorLimits[sectorName];
    
    if (!limit) return true; // Нет лимита - доступен
    
    const currentCount = statistics.results[sectorName] || 0;
    const isAvailable = currentCount < limit.limit;
    
    console.log(`🎯 Сектор "${sectorName}": ${currentCount}/${limit.limit} - ${isAvailable ? 'доступен' : 'заблокирован'}`);
    
    return isAvailable;
  });
  
  // Проверяем, остались ли доступные элементы
  if (availableItems.length === 0) {
    notifications.error('All sectors have reached their limits! Reset statistics or increase limits.');
    return;
  }
  
  if (availableItems.length === 1) {
    notifications.warning('Only one sector available due to limits!');
  }
  
  const duration = parseInt(document.getElementById('spin-duration').value) * 1000;
  
  // ВЗВЕШЕННЫЙ ВЫБОР РЕЗУЛЬТАТА только среди доступных элементов
  const totalWeight = availableItems.reduce((sum, item) => sum + (item.weight || 1), 0);
  let random = Math.random() * totalWeight;
  let selectedItem = null;
  
  for (let i = 0; i < availableItems.length; i++) {
    random -= (availableItems[i].weight || 1);
    if (random <= 0) {
      selectedItem = availableItems[i];
      break;
    }
  }
  
  // Находим индекс выбранного элемента в оригинальном массиве
  const targetIndex = wheel.items.findIndex(item => item === selectedItem);
  
  console.log('🎯 Выбран элемент с учетом весов и лимитов:', targetIndex, selectedItem.label);
  console.log(`📊 Доступно секторов: ${availableItems.length}/${wheel.items.length}`);
  
  wheel.spinToItem(targetIndex, duration, true, 3, 1);
}

function stopWheel() {
  wheel.stop();
  isSpinning = false;
  updateSpinButton();
}

function resetWheel() {
  stopWheel();
  wheel.rotation = 0;
}

function updateSpinButton() {
  const btn = document.getElementById('spin-btn');
  if (isSpinning) {
    btn.textContent = 'SPINING...';
    btn.disabled = true;
  } else {
    btn.textContent = 'SPIN';
    btn.disabled = false;
  }
}

// ИСПРАВЛЕННАЯ функция показа результата с поддержкой GIF в popup
function showResult(winner, index, image) {
  // Обновляем содержимое popup
  resultPopupVisible = true;
  document.getElementById('winner-text').textContent = winner;
  
  const prizeImage = document.getElementById('prize-image');
  if (image) {
    prizeImage.src = image;
    prizeImage.style.display = 'block';
  } else {
    prizeImage.style.display = 'none';
  }
  
  // Применяем кастомный фон popup
  const popup = document.getElementById('result-popup');
  
  // Проверяем, есть ли GIF фон для popup
  if (customization.popupBackground) {
    if (customization.popupBackgroundIsGIF && window.gifHandler) {
      console.log('🎬 Применяем анимированный GIF фон для popup');
      
      // Создаем анимированный фон
      window.gifHandler.createPopupBackgroundGIF(customization.popupBackground, popup);
      
      // Убираем CSS фон
      popup.style.backgroundImage = 'none';
      
    } else {
      console.log('🖼️ Применяем обычный фон для popup');
      
      // Удаляем GIF фон если был
      if (window.gifHandler) {
        window.gifHandler.removePopupBackgroundGIF();
      }
      
      // Устанавливаем CSS фон
      popup.style.backgroundImage = `url(${customization.popupBackground})`;
      popup.style.backgroundSize = 'cover';
      popup.style.backgroundPosition = 'center';
    }
  }
  
  popup.style.color = customization.popupTextColor;
  
  // Показываем popup
  document.getElementById('overlay').classList.add('show');
  document.getElementById('result-popup').classList.add('show');
  document.getElementById('last-result').textContent = winner;
}

function closeResultPopup() {
  resultPopupVisible = false; // Добавь эту строку в начало	
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('result-popup').classList.remove('show');
}

function spinAgain() {
  closeResultPopup();
  setTimeout(() => spinWheel(), 500);
}

function updateStatistics(winner) {
  statistics.totalSpins++;
  statistics.results[winner] = (statistics.results[winner] || 0) + 1;
  
  // Обновляем текущий счетчик в лимитах
  if (sectorLimits[winner]) {
    sectorLimits[winner].current = statistics.results[winner];
    
    // Проверяем достижение лимита
    if (sectorLimits[winner].current >= sectorLimits[winner].limit) {
      notifications.warning(`Sector "${winner}" has reached its limit (${sectorLimits[winner].limit})!`);
    }
  }
  
  document.getElementById('total-spins').textContent = statistics.totalSpins;
  saveStatistics();
  saveSectorLimits(); // Сохраняем обновленные лимиты
}

function saveSectorLimits() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('sectorLimits', JSON.stringify(sectorLimits));
  }
}

function loadSectorLimits() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('sectorLimits');
    if (saved) {
      sectorLimits = JSON.parse(saved);
      console.log('✅ Лимиты секторов загружены:', sectorLimits);
    }
  }
}

function updateUI() {
  document.getElementById('items-count').textContent = wheel.items.length;
  document.getElementById('current-preset').textContent = window.WheelPresets[currentPreset].name;
}

// Звуковые эффекты
function playSpinSound() {
  console.log('🎵 Spin sound effect');
  if (typeof sounds !== 'undefined') {
    sounds.playSpinSound();
  }
}

function playWinSound() {
  console.log('🎵 Win sound effect');
  if (typeof sounds !== 'undefined') {
    sounds.playWinSound();
  }
}

// ИСПРАВЛЕННАЯ функция для работы с весами элементов (НЕ влияет на цвета)
function setEqualWeights() {
  console.log('⚖️ Устанавливаем равные веса');
  
  const newItems = wheel.items.map(item => ({
    ...item,
    weight: 1
    // НЕ трогаем backgroundColor!
  }));
  
  wheel.items = newItems;
  updateItemsList();
  
  if (typeof notifications !== 'undefined') {
    notifications.success('Equal chances set for all sectors');
  }
}

// НОВЫЕ ФУНКЦИИ ДЛЯ ПОДДЕРЖКИ GIF

// Функция для обновления позиций GIF элементов при вращении колеса
function updateGIFPositions() {
  if (window.gifHandler && wheel) {
    const wheelCanvas = document.getElementById('wheel-canvas');
    if (wheelCanvas) {
      window.gifHandler.updateAllItemGIFPositions(wheelCanvas);
    }
  }
}

// Функция для инициализации обновления позиций GIF
function initializeGIFPositionUpdates() {
  if (!window.gifHandler || !wheel) return;
  
  let lastRotation = wheel.rotation || 0;
  let isUpdating = false;
  
  const checkRotation = () => {
    if (isUpdating) return;
    
    const currentRotation = wheel.rotation || 0;
    const rotationDiff = Math.abs(currentRotation - lastRotation);
    
    // Обновляем позиции при значительных изменениях или во время вращения
    if (rotationDiff > 0.5 || isSpinning) {
      isUpdating = true;
      
      requestAnimationFrame(() => {
        updateGIFPositions();
        lastRotation = currentRotation;
        isUpdating = false;
      });
    }
    
    requestAnimationFrame(checkRotation);
  };
  
  checkRotation();
  console.log('🎬 GIF position updates система запущена');
}

// Функция для восстановления GIF элементов после инициализации
function restoreGIFElements() {
  if (!window.gifHandler) return;
  
  console.log('🎬 Восстанавливаем GIF элементы...');
  
  // Восстанавливаем GIF элементы для каждого item
  wheel.items.forEach((item, index) => {
    if (item.imageIsGIF && item.image) {
      console.log(`🎬 Восстанавливаем GIF для элемента ${index}`);
      const wheelContainer = document.getElementById('wheel-canvas').parentElement;
      window.gifHandler.createItemGIF(item.image, index, wheelContainer);
    }
  });
  
  // Обновляем позиции после восстановления
  setTimeout(() => {
    updateGIFPositions();
  }, 100);
}

// Сохранение и загрузка проектов
function saveProject() {
  const projectData = getProjectData();
  
  // Создаем и скачиваем файл
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wheel-project-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('Project saved');
}

function loadProjectFile() {
  document.getElementById('project-file').click();
}

function handleProjectFile(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const projectData = JSON.parse(e.target.result);
      loadProject(projectData);
    } catch (error) {
      alert('Project loading error: ' + error.message);
    }
  };
  reader.readAsText(file);
}

function loadProject(data) {
  try {
    // Загружаем пресет
    if (data.preset && window.WheelPresets[data.preset]) {
      currentPreset = data.preset;
      applyPreset(data.preset);
    }
    
    // Загружаем элементы
    if (data.items) {
      wheel.items = data.items;
    }
    
    // Загружаем настройки колеса
    if (data.colors) wheel.itemBackgroundColors = data.colors;
    if (data.borderWidth) wheel.borderWidth = data.borderWidth;
    if (data.borderColor) wheel.borderColor = data.borderColor;
    if (data.fontSize) wheel.itemLabelFontSizeMax = data.fontSize;
    
    // Загружаем кастомизацию
    if (data.customization) {
      customization = { ...customization, ...data.customization };
      loadCustomization();
    }
    
    updateItemsList();
    updateUI();
    
    // Обновляем элементы интерфейса
    if (data.fontSize) {
      document.getElementById('font-size').value = data.fontSize;
      document.getElementById('font-size-value').textContent = data.fontSize;
    }
    if (data.borderWidth) {
      document.getElementById('border-width').value = data.borderWidth;
    }
    if (data.borderColor) {
      document.getElementById('border-color').value = data.borderColor;
    }
    
    alert('Project loaded successfully');
  } catch (error) {
    alert('Project loading error: ' + error.message);
  }
}

function getProjectData() {
  return {
    preset: currentPreset,
    items: wheel.items.map(item => ({
      label: item.label,
      weight: item.weight,
      backgroundColor: item.backgroundColor,
      image: item.image,
      imageIsGIF: item.imageIsGIF || false  // НОВОЕ поле
    })),
    colors: wheel.itemBackgroundColors,
    borderWidth: wheel.borderWidth,
    borderColor: wheel.borderColor,
    fontSize: wheel.itemLabelFontSizeMax,
    customization: customization,
    version: '2.1.0'  // Обновленная версия с поддержкой GIF
  };
}

function exportImage() {
  const canvas = wheel.canvas;
  const link = document.createElement('a');
  link.download = `wheel-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

// Сохранение статистики
function saveStatistics() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('wheelStatistics', JSON.stringify(statistics));
  }
}

function showStatistics() {
  showDetailedStatistics(); // Вызываем детальную статистику
}

function loadStatistics() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('wheelStatistics');
    if (saved) {
      statistics = JSON.parse(saved);
      document.getElementById('total-spins').textContent = statistics.totalSpins;
    }
  }
}
function resetStatistics() {
  const t = translations[currentLanguage];
  if (confirm(t.resetStatsConfirm)) {
    statistics = { totalSpins: 0, results: {} };
    
    // Сбрасываем текущие счетчики в лимитах, но сохраняем сами лимиты
    Object.keys(sectorLimits).forEach(sector => {
      sectorLimits[sector].current = 0;
    });
    
    document.getElementById('total-spins').textContent = '0';
    document.getElementById('last-result').textContent = '-';
    saveStatistics();
    saveSectorLimits();
    
    notifications.success('Statistics reset successfully!');
  }
}

// Обработка ошибок
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('❌ JavaScript Error:', {
    message: msg,
    source: url,
    line: lineNo,
    column: columnNo,
    error: error
  });
  return false;
};

// Добавляем CSS стили для улучшенного отображения GIF элементов
const additionalGIFStyles = `
.image-preview-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 16px;
  margin: 0 5px;
}

.image-preview {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.file-input-wrapper {
  font-size: 11px;
  padding: 4px 8px;
}
`;

// Добавляем стили в документ
if (!document.getElementById('additional-gif-styles')) {
  const style = document.createElement('style');
  style.id = 'additional-gif-styles';
  style.textContent = additionalGIFStyles;
  document.head.appendChild(style);
}
// Функции для работы с кастомными звуками
async function loadCustomSound(type, input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log(`🎵 Загружаем кастомный звук ${type}:`, file.name);
  
  // Проверяем размер файла (макс 10MB)
  if (file.size > 10 * 1024 * 1024) {
    notifications.error('Sound file too large (max 10MB)');
    return;
  }
  
  try {
    const dataURL = await sounds.loadCustomSound(type, file);
    
    // Отмечаем секцию как имеющую контент
    document.getElementById(`${type}-sound-section`).classList.add('has-content');
    
    // Сохраняем в кастомизации
    if (!customization.sounds) customization.sounds = {};
    customization.sounds[type] = dataURL;
    saveCustomization();
    
    notifications.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sound loaded!`);
    
  } catch (error) {
    console.error(`❌ Ошибка загрузки звука ${type}:`, error);
    notifications.error(`Failed to load ${type} sound: ` + error.message);
  }
}

function removeCustomSound(type) {
  sounds.removeCustomSound(type);
  
  // Убираем отметку о наличии контента
  document.getElementById(`${type}-sound-section`).classList.remove('has-content');
  
  // Удаляем из кастомизации
  if (customization.sounds && customization.sounds[type]) {
    delete customization.sounds[type];
    saveCustomization();
  }
  
  notifications.info(`${type.charAt(0).toUpperCase() + type.slice(1)} sound removed`);
}

function testSound(type) {
  console.log(`🎵 Тестируем звук ${type}`);
  
  switch(type) {
    case 'spin':
      sounds.playSpinSound();
      break;
    case 'win':
      sounds.playWinSound();
      break;
    case 'lose':
      sounds.playLoseSound();
      break;
  }
}

function updateSoundVolume(value) {
  const volume = parseInt(value) / 100;
  sounds.setVolume(volume);
  
  // Сохраняем в кастомизации
  customization.soundVolume = volume;
  saveCustomization();
  
  console.log('🔊 Громкость звука обновлена:', volume);
}

// ЭКСПОРТ ФУНКЦИЙ для использования из HTML (очищенная версия с поддержкой GIF)
window.spinWheel = spinWheel;
window.stopWheel = stopWheel;
window.resetWheel = resetWheel;
window.editItem = editItem;
window.uploadItemImage = uploadItemImage;
window.removeItemImage = removeItemImage;
window.selectItem = selectItem;
window.randomizeColors = randomizeColors;
window.applyColorScheme = applyColorScheme;
window.setEqualWeights = setEqualWeights;
window.applyPreset = applyPreset;
window.loadBackgroundImage = loadBackgroundImage;
window.removeBackgroundImage = removeBackgroundImage;
window.loadWheelBorderImage = loadWheelBorderImage;
window.removeWheelBorderImage = removeWheelBorderImage;
window.loadPopupBackground = loadPopupBackground;
window.showResult = showResult;
window.closeResultPopup = closeResultPopup;
window.spinAgain = spinAgain;
window.showStatistics = showStatistics;
window.resetStatistics = resetStatistics;
window.saveProject = saveProject;
window.loadProjectFile = loadProjectFile;
window.handleProjectFile = handleProjectFile;
window.exportImage = exportImage;

// Новые функции для цветовых схем
window.clearAllItemColors = clearAllItemColors;
window.copyColorsFromScheme = copyColorsFromScheme;
window.showCustomColorSchemeEditor = showCustomColorSchemeEditor;
window.addCustomColor = addCustomColor;
window.removeCustomColor = removeCustomColor;
window.updateColorIndexes = updateColorIndexes;
window.resetToRainbow = resetToRainbow;
window.saveCustomScheme = saveCustomScheme;
window.applyCustomColors = applyCustomColors;
window.closeCustomColorEditor = closeCustomColorEditor;
window.toggleExhibitionMode = toggleExhibitionMode;
window.globalClickHandler = globalClickHandler;
window.switchLanguage = switchLanguage;
window.showDetailedStatistics = showDetailedStatistics;
window.closeStatsModal = closeStatsModal;
window.setSectorLimit = setSectorLimit;
window.exportStatistics = exportStatistics
window.saveSectorLimits = saveSectorLimits;
window.loadSectorLimits = loadSectorLimits;
window.saveSectorLimitValue = saveSectorLimitValue;
window.closeLimitModal = closeLimitModal;
window.loadCustomSound = loadCustomSound;
window.removeCustomSound = removeCustomSound;
window.testSound = testSound;
window.updateSoundVolume = updateSoundVolume;
window.selectTheme = selectTheme;
window.applySelectedTheme = applySelectedTheme;
window.wheelDesignThemes = wheelDesignThemes;
window.applyBorderStyle = applyBorderStyle;
window.createDarkElegantBorder = createDarkElegantBorder;
window.createGoldClassicBorder = createGoldClassicBorder;
window.createNeonGlowBorder = createNeonGlowBorder;
window.createWoodFrameBorder = createWoodFrameBorder;
window.createDottedBorder = createDottedBorder;
window.createGradientBorder = createGradientBorder;
window.createEmeraldLights = createEmeraldLights;
window.createDiscoLights = createDiscoLights;
window.createCarnivalLights = createCarnivalLights;
window.createRoyalBorder = createRoyalBorder;
window.createElectricBorder = createElectricBorder;
window.createDottedLights = createDottedLights;
window.addDiscoBulbsDecoration = addDiscoBulbsDecoration;
window.addCarnivalBulbsDecoration = addCarnivalBulbsDecoration;
window.addLightningBoltsDecoration = addLightningBoltsDecoration;
console.log('✅ App.js с унифицированной функцией spinWheel загружен успешно');