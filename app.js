let instantStopMode = false; // Новый режим честной остановки
let instantStopEnabled = false; // Флаг готовности к остановке
let lastClickTime = 0; // Для предотвращения случайных двойных кликов в handleDoubleClickLogic
let lastStopTime = 0; // Для предотвращения случайных двойных кликов в handleInstantStop
let hideSectorNames = false; // Флаг скрытия имен секторов

let exhaustedOverlayImage = null; // PNG изображение оверлея "НЕТ В НАЛИЧИИ"
let overlayElements = new Map(); // DOM элементы оверлеев для каждого сектора
let wheelContainer = null;
// НОВЫЕ переменные для двойного клика
let isAccelerating = false; // Флаг процесса ускорения
let accelerationPhase = false; // Фаза ускорения (true = ускоряемся, false = медленное вращение)
let instantStopAccelerationMode = true; // true = двойной клик с ускорением, false = одинарный клик постоянная скорость
let singleClickSpeed = 150; // Постоянная скорость для режима с 1 кликом
let slowSpinSpeed  = 30; // Начальная скорость для режима с 2 кликами
let fastSpinSpeed  = 300;
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
let continuousSpinMode = false; // Режим постоянного вращения
let continuousSpinSpeed = 100;  // Скорость постоянного вращения
let isContinuousSpinning = false; // Состояние постоянного вращения
let pendingStop = false; // Ожидание остановки после клика
let prizeImageSettings = {
  size: 150,
  offsetX: 0,
  offsetY: 0,
  scale: 150,
  showImage: true // НОВОЕ СВОЙСТВО
};

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

let resultMessages = {
  // Сообщения победы
  winHeader: '🎉 Congratulations! 🎉',
  winTitle: 'You Won!',
  // Сообщения поражения
  loseHeader: '😞 Better luck next time! 😞',
  loseTitle: 'You Lost!'
};

let autoSaveInterval = null;

function startPeriodicAutoSave() {
  // Останавливаем предыдущий интервал если есть
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  // Запускаем новый интервал автосохранения каждые 5 минут (300000 мс)
  autoSaveInterval = setInterval(() => {
    console.log('⏰ Запуск периодического автосохранения');
    autoSaveCurrentProject();
    
    // Показываем тонкое уведомление
    if (typeof notifications !== 'undefined') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(notification);
      
      // Анимация появления и исчезновения
      setTimeout(() => notification.style.opacity = '1', 10);
      setTimeout(() => notification.style.opacity = '0', 2000);
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 2500);
    }
  }, 300000); // 5 минут
  
  console.log('✅ Периодическое автосохранение активировано (каждые 5 минут)');
}

function stopPeriodicAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('⏹️ Периодическое автосохранение остановлено');
  }
}

// Функция для изменения интервала автосохранения (опционально)
function setAutoSaveInterval(minutes) {
  if (minutes < 1) {
    console.warn('⚠️ Минимальный интервал автосохранения: 1 минута');
    return;
  }
  
  stopPeriodicAutoSave();
  
  autoSaveInterval = setInterval(() => {
    console.log(`⏰ Периодическое автосохранение (каждые ${minutes} мин)`);
    autoSaveCurrentProject();
  }, minutes * 60000);
  
  console.log(`✅ Интервал автосохранения изменен на ${minutes} минут`);
}
function debugContinuousSpin() {
  console.log('🔍 ОТЛАДКА ПОСТОЯННОГО ВРАЩЕНИЯ:', {
    continuousSpinMode,
    isContinuousSpinning,
    pendingStop,
    wheelRotationSpeed: wheel?._rotationSpeed,
    wheelLastSpinFrameTime: wheel?._lastSpinFrameTime,
    windowFlags: {
      continuousSpinMode: window.continuousSpinMode,
      isContinuousSpinning: window.isContinuousSpinning,
      pendingStop: window.pendingStop,
      continuousSpinSpeed: window.continuousSpinSpeed
    }
  });
}

// Экспортируем для вызова из консоли
window.debugContinuousSpin = debugContinuousSpin;

function forceContinuousStop() {
  console.log('🛑 Принудительная остановка постоянного вращения');
  isContinuousSpinning = false;
  pendingStop = false;
  if (wheel) {
    wheel.stop();
  }
  updateSpinButton();
}

// Экспортируем для отладки из консоли
window.forceContinuousStop = forceContinuousStop;
window.startContinuousSpin = startContinuousSpin;

// ФУНКЦИИ ДЛЯ РЕЖИМА ПОСТОЯННОГО ВРАЩЕНИЯ
// ИСПРАВЛЕННАЯ ФУНКЦИЯ toggleContinuousSpinMode
function toggleContinuousSpinMode() {
  const checkbox = document.getElementById('continuous-spin-mode');
  const speedControl = document.getElementById('continuous-speed-control');
  
  // Блокировка честного режима
  const instantStopCheckbox = document.getElementById('instant-stop-mode');
  const instantAccelerationCheckbox = document.getElementById('instant-stop-acceleration');
  
  continuousSpinMode = checkbox.checked;
  speedControl.style.display = continuousSpinMode ? 'block' : 'none';
  
  if (continuousSpinMode) {
    // Блокируем честный режим и режим ускорения
    instantStopCheckbox.disabled = true;
    instantAccelerationCheckbox.disabled = true;
    
    // Выключаем честный режим если он был включен
    if (instantStopMode) {
      instantStopCheckbox.checked = false;
      toggleInstantStopMode();
    }
  } else {
    // Разблокируем честный режим и режим ускорения
    instantStopCheckbox.disabled = false;
    instantAccelerationCheckbox.disabled = false;
  }
  
  console.log(`🔄 Режим постоянного вращения ${continuousSpinMode ? 'включен' : 'выключен'}`);
  
  if (continuousSpinMode) {
    // Закрываем любые открытые результаты
    if (resultPopupVisible) {
      closeResultPopup();
    }
    
    // Запускаем с задержкой
    setTimeout(() => {
      startContinuousSpin();
    }, 500);
  } else {
    stopContinuousSpin();
  }
  
  updateSpinButton();
}

function updateContinuousSpeed() {
  const speedInput = document.getElementById('continuous-speed');
  const speedValue = document.getElementById('continuous-speed-value');
  
  continuousSpinSpeed = parseInt(speedInput.value);
  speedValue.textContent = continuousSpinSpeed;
  
  console.log('🎛️ Скорость постоянного вращения:', continuousSpinSpeed);
  
  if (isContinuousSpinning && wheel) {
    wheel._rotationSpeed = continuousSpinSpeed;
  }
  triggerAutoSave();
}


// ИСПРАВЛЕННАЯ ФУНКЦИЯ startContinuousSpin
// ЗАМЕНИ функцию startContinuousSpin() на эту:
function startContinuousSpin() {
  if ((!continuousSpinMode && !instantStopMode) || wheel.items.length < 2) return;
  
  console.log('🌀 Запуск постоянного вращения');
  
  // Останавливаем любое текущее вращение
  wheel.stop();
  
  // Сбрасываем все флаги
  isSpinning = false;
  pendingStop = false;
  
  // ВАЖНО: Устанавливаем правильные флаги для постоянного вращения
if (instantStopMode) {
  // Для честного режима временно включаем continuousSpinMode в window
  window.continuousSpinMode = true;
  
  // ИСПРАВЛЕНИЕ: используем переданную скорость, а не жёстко slowSpinSpeed
  window.continuousSpinSpeed = continuousSpinSpeed; // Используем уже установленную скорость
  accelerationPhase = false; // Начинаем с медленной фазы
  console.log(`🐌 Честный режим: начинаем со скоростью ${continuousSpinSpeed}`);
} else {
  window.continuousSpinMode = continuousSpinMode;
  window.continuousSpinSpeed = continuousSpinSpeed;
}
  
  window.isContinuousSpinning = true;
  window.pendingStop = false;
  
  // Небольшая задержка для стабилизации
  setTimeout(() => {
    // КРИТИЧНО: Запускаем spin с правильной скоростью
const startSpeed = continuousSpinSpeed; // Всегда используем переданную скорость
    wheel.spin(startSpeed);
    
    // Устанавливаем флаги ПОСЛЕ запуска
    isContinuousSpinning = true;
    
    console.log('✅ Постоянное вращение запущено со скоростью:', startSpeed);
    console.log('🔍 Флаги:', {
      continuousSpinMode: instantStopMode ? 'временно true для честного режима' : continuousSpinMode,
      isContinuousSpinning,
      windowFlags: {
        continuousSpinMode: window.continuousSpinMode,
        isContinuousSpinning: window.isContinuousSpinning,
        continuousSpinSpeed: window.continuousSpinSpeed
      }
    });
    
    updateSpinButton();
  }, 100);

  triggerAutoSave();
}

function stopContinuousSpin() {
  console.log('⏹️ Остановка постоянного вращения');
  
  isContinuousSpinning = false;
  pendingStop = false;
  
  if (wheel) {
    wheel.stop();
  }
  
  updateSpinButton();
}

function beginSlowdown() {
  if (!isContinuousSpinning || pendingStop) return;
  
  console.log('🎯 Начинаем замедление колеса');
  
  pendingStop = true;
  
  // ФИКСИРУЕМ момент нажатия - это наша "точка отсчета"
  const clickMomentRotation = wheel.rotation;
  console.log('📍 Зафиксировали момент клика на угле:', Math.round(clickMomentRotation));
  
  // Останавливаем флаги, но НЕ прерываем вращение
  window.isContinuousSpinning = false;
  isContinuousSpinning = false;
  
  const availableItems = wheel.items.filter((item, index) => {
    const sectorName = item.label;
    const limit = sectorLimits[sectorName];
    
    if (!limit) return true;
    
    const currentCount = statistics.results[sectorName] || 0;
    return currentCount < limit.limit;
  });
  
  if (availableItems.length === 0) {
    notifications.error('All sectors have reached their limits!');
    stopContinuousSpin();
    return;
  }
  
  // Быстрый взвешенный выбор
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
  
  const targetIndex = wheel.items.findIndex(item => item === selectedItem);
  console.log('🎯 Выбран элемент для остановки:', targetIndex, selectedItem.label);
  
  // Рассчитываем финальный угол ОТ МОМЕНТА КЛИКА
	const duration = parseInt(document.getElementById('spin-duration').value) * 1000;

	// Используем точную логику из wheel-lib.js
	const itemAngle = wheel.items[targetIndex].getCenterAngle();
	const pointerAngle = wheel._pointerAngle || 0;
	const targetAngleForWheel = itemAngle - pointerAngle;

	// Функция из wheel-lib.js для точного расчета
	function calcWheelRotationForTargetAngle(currentRotation, targetAngle, direction = 1) {
	  let angle = ((currentRotation % 360) + targetAngle) % 360;
	  angle = Number(angle.toFixed(9));
	  angle = ((direction === 1) ? (360 - angle) : 360 + angle) % 360;
	  angle *= direction;
	  return currentRotation + angle;
	}

	let targetFromClick = calcWheelRotationForTargetAngle(clickMomentRotation, targetAngleForWheel, 1);
	targetFromClick += (360 * 1); // 1 дополнительный оборот

	console.log('📐 Точный расчет (как в wheel-lib.js):', {
	  clickMoment: Math.round(clickMomentRotation),
	  itemAngle: Math.round(itemAngle),
	  pointerAngle: Math.round(pointerAngle),
	  targetAngleForWheel: Math.round(targetAngleForWheel),
	  finalTarget: Math.round(targetFromClick),
	  targetIndex
	});
  
  // КЛЮЧЕВОЙ МОМЕНТ: Ждем немного, потом запускаем анимацию с коррекцией дельты
  setTimeout(() => {
    const currentRotation = wheel.rotation;
    const deltaFromClick = currentRotation - clickMomentRotation;
    const adjustedTarget = targetFromClick - deltaFromClick; // ИСПРАВЛЕНО: МИНУС вместо ПЛЮС
    
    console.log('🎬 Запуск с коррекцией дельты:', {
      clickMoment: Math.round(clickMomentRotation),
      currentNow: Math.round(currentRotation),
      delta: Math.round(deltaFromClick),
      originalTarget: Math.round(targetFromClick),
      adjustedTarget: Math.round(adjustedTarget)
    });
    
    // Запускаем анимацию от текущей позиции к скорректированной цели
    wheel.stop();
    wheel.animate(adjustedTarget, duration);
    isSpinning = true;
    pendingStop = false;
    
  }, 50); // Минимальная задержка для плавности
}

function loadWinPopupBackground(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🖼️ Загружаем фон popup победы:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    customization.winPopupBackground = dataURL;
    customization.winPopupBackgroundIsGIF = window.gifHandler && window.gifHandler.isGIF(file);
    
    saveCustomization();
    console.log('✅ Win popup background loaded');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Win popup background loaded!');
    }
  };
  reader.readAsDataURL(file);
}

function removeWinPopupBackground() {
  customization.winPopupBackground = null;
  customization.winPopupBackgroundIsGIF = false;
  
  saveCustomization();
  console.log('🗑️ Win popup background removed');
  
  if (typeof notifications !== 'undefined') {
    notifications.info('Win popup background removed');
  }
}

// Функции для popup поражения
function loadLosePopupBackground(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🖼️ Загружаем фон popup поражения:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    customization.losePopupBackground = dataURL;
    customization.losePopupBackgroundIsGIF = window.gifHandler && window.gifHandler.isGIF(file);
    
    saveCustomization();
    console.log('✅ Lose popup background loaded');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Lose popup background loaded!');
    }
  };
  reader.readAsDataURL(file);
}

function removeLosePopupBackground() {
  customization.losePopupBackground = null;
  customization.losePopupBackgroundIsGIF = false;
  
  saveCustomization();
  console.log('🗑️ Lose popup background removed');
  
  if (typeof notifications !== 'undefined') {
    notifications.info('Lose popup background removed');
  }
}

function updateWinPopupTextColor() {
  const color = document.getElementById('win-popup-text-color').value;
  customization.winPopupTextColor = color;
  saveCustomization();
}

function updateLosePopupTextColor() {
  const color = document.getElementById('lose-popup-text-color').value;
  customization.losePopupTextColor = color;
  saveCustomization();
}

// Экспортируем функции
window.loadWinPopupBackground = loadWinPopupBackground;
window.removeWinPopupBackground = removeWinPopupBackground;
window.loadLosePopupBackground = loadLosePopupBackground;
window.removeLosePopupBackground = removeLosePopupBackground;
window.updateWinPopupTextColor = updateWinPopupTextColor;
window.updateLosePopupTextColor = updateLosePopupTextColor;

function updateSingleSelect(index) {
  const select = document.querySelector(`select[data-sector="${index}"]`);
  if (!select) return;
  
  const item = wheel.items[index];
  if (!item) return;
  
  // Обновляем только этот селект без перерисовки всего списка
  if (item.isWin === false) {
    select.value = 'lose';
    console.log(`🔄 Селект ${index} обновлен на LOSE`);
  } else {
    select.value = 'win';
    console.log(`🔄 Селект ${index} обновлен на WIN`);
  }
  triggerAutoSave();
}

// Экспортируем функцию
window.updateSingleSelect = updateSingleSelect;

// ДОБАВЬ ЭТУ НОВУЮ ФУНКЦИЮ В APP.JS
// ДОБАВЬ ЭТУ НОВУЮ ФУНКЦИЮ В APP.JS
function setWinLose(index, value) {
  console.log(`🎯 setWinLose вызвана: сектор ${index}, значение "${value}"`);
  
  // ИСПРАВЛЕНИЕ: Напрямую изменяем существующий объект
  if (value === 'win') {
    wheel.items[index].isWin = true;
    console.log(`✅ Сектор ${index} установлен как ПОБЕДА`);
  } else if (value === 'lose') {
    wheel.items[index].isWin = false;
    console.log(`✅ Сектор ${index} установлен как ПОРАЖЕНИЕ`);
  }
  
  // Принудительно обновляем select без полной перерисовки
  const select = document.querySelector(`select[data-sector="${index}"]`);
  if (select) {
    select.value = value;
  }
  
  // ДОБАВЛЯЕМ: Принудительно обновляем колесо
  wheel.refresh();
  
  // НОВОЕ: Принудительно сохраняем проект с обновленными элементами
  setTimeout(() => {
    if (typeof saveAutomaticProject === 'function') {
      saveAutomaticProject();
      console.log('💾 Автоматически сохранен проект с обновленными isWin значениями');
    }
  }, 100);
  
  console.log(`🔍 Результат: сектор ${index} isWin =`, wheel.items[index].isWin);
  
  // ОТЛАДКА: Проверяем что значение действительно сохранилось
  setTimeout(() => {
    console.log(`🔍 Проверка через 200мс: сектор ${index} isWin =`, wheel.items[index].isWin);
    console.log('🔍 Все элементы колеса:', wheel.items.map((item, i) => `${i}: ${item.label} = ${item.isWin}`));
  }, 200);
  triggerAutoSave();
}
// Экспортируем функцию
window.setWinLose = setWinLose;

// Экспортируем функцию
// ДОБАВЬ ЭТИ ФУНКЦИИ В APP.JS
function saveResultMessages() {
  const winHeaderInput = document.getElementById('congratulations-text');
  const winTitleInput = document.getElementById('winner-result-title');
  const loseHeaderInput = document.getElementById('lose-header-text');
  const loseTitleInput = document.getElementById('lose-result-title');
  
  resultMessages.winHeader = winHeaderInput.value || '🎉 Congratulations! 🎉';
  resultMessages.winTitle = winTitleInput.value || 'You Won!';
  resultMessages.loseHeader = loseHeaderInput.value || '😞 Better luck next time! 😞';
  resultMessages.loseTitle = loseTitleInput.value || 'You Lost!';
  
  // Сохраняем в localStorage
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('resultMessages', JSON.stringify(resultMessages));
  }
  
  console.log('💬 Настройки сообщений результата сохранены:', resultMessages);
  notifications.success('Result messages updated!');
}
function loadResultMessages() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('resultMessages');
    if (saved) {
      resultMessages = { ...resultMessages, ...JSON.parse(saved) };
      
      // Восстанавливаем UI
      document.getElementById('congratulations-text').value = resultMessages.winHeader;
      document.getElementById('winner-result-title').value = resultMessages.winTitle;
      document.getElementById('lose-header-text').value = resultMessages.loseHeader;
      document.getElementById('lose-result-title').value = resultMessages.loseTitle;
    }
  }
}

function previewWinMessage() {
  saveResultMessages();
  showResult('Test Winner', 0, null, true); // Явно передаем true для победы
}

function previewLoseMessage() {
  saveResultMessages();
  showResult('Test Loser', 0, null, false); // Явно передаем false для поражения
}
window.saveResultMessages = saveResultMessages;
window.loadResultMessages = loadResultMessages;
window.previewWinMessage = previewWinMessage;
window.previewLoseMessage = previewLoseMessage;

// Экспортируем функции

// Кастомизация с поддержкой GIF
let customization = {
  backgroundImage: null,
  backgroundIsGIF: false,
  wheelBorderImage: null,
  wheelBorderIsGIF: false,
  
  // Отдельные настройки для popup победы и поражения
  winPopupBackground: null,
  winPopupBackgroundIsGIF: false,
  winPopupTextColor: '#ffffff',
  
  losePopupBackground: null,
  losePopupBackgroundIsGIF: false,
  losePopupTextColor: '#ffffff',
  
  currentTheme: 'default'
};
let currentLanguage = 'en';


// ДОБАВЬ ЭТИ ПЕРЕМЕННЫЕ В НАЧАЛО APP.JS (после других переменных)
let exhibitionSecurity = {
  requirePassword: false,
  password: ''
};

// ДОБАВЬ ЭТУ ФУНКЦИЮ В APP.JS ДЛЯ ОТЛАДКИ
function debugSectorsState() {
  console.log('🔍 ОТЛАДКА СОСТОЯНИЯ СЕКТОРОВ:');
  
  if (!wheel || !wheel.items) {
    console.log('❌ Колесо не инициализировано');
    return;
  }
  
  console.log(`Количество секторов: ${wheel.items.length}`);
  console.log(`Цвета колеса: [${wheel.itemBackgroundColors.join(', ')}]`);
  console.log(`Выбранная тема: ${selectedTheme || 'не выбрана'}`);
  
  wheel.items.forEach((item, index) => {
    console.log(`Сектор ${index}:`);
    console.log(`  - label: "${item.label}"`);
    console.log(`  - backgroundColor: ${item.backgroundColor || 'null'}`);
    console.log(`  - sectorBackgroundImage: ${item.sectorBackgroundImage ? 'есть' : 'нет'}`);
    console.log(`  - sectorBackgroundIsGIF: ${item.sectorBackgroundIsGIF || false}`);
  });
  
  // Принудительная перерисовка
  wheel.refresh();
}

// Экспортируем функцию
window.debugSectorsState = debugSectorsState;
function clearAllSectorBackgrounds() {
  console.log('🧹 Очищаем все фоновые изображения секторов');
  
  const items = wheel.items.map(item => ({
    ...item,
    sectorBackgroundImage: null,
    sectorBackgroundIsGIF: false
  }));
  
  wheel.items = items;
  updateItemsList();
  updateUI();
  
  notifications.success('All sector backgrounds cleared');
  console.log('✅ Все фоновые изображения секторов очищены');
}

// Экспортируем функцию
window.clearAllSectorBackgrounds = clearAllSectorBackgrounds;

// ДОБАВЬ ЭТИ ФУНКЦИИ В APP.JS
function saveExhibitionPassword() {
  const passwordInput = document.getElementById('exhibition-password');
  const requireCheckbox = document.getElementById('require-password');
  
  exhibitionSecurity.password = passwordInput.value;
  exhibitionSecurity.requirePassword = requireCheckbox.checked;
  
  // Сохраняем в localStorage
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('exhibitionSecurity', JSON.stringify(exhibitionSecurity));
  }
  
  console.log('🔐 Настройки безопасности выставочного режима сохранены');
  
  if (exhibitionSecurity.requirePassword && !exhibitionSecurity.password) {
    notifications.warning('Set a password to enable exhibition mode security');
  } else if (exhibitionSecurity.requirePassword && exhibitionSecurity.password) {
    notifications.success('Exhibition mode password protection enabled');
  }
}

function loadExhibitionPassword() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('exhibitionSecurity');
    if (saved) {
      exhibitionSecurity = { ...exhibitionSecurity, ...JSON.parse(saved) };
      
      // Восстанавливаем UI
      document.getElementById('exhibition-password').value = exhibitionSecurity.password;
      document.getElementById('require-password').checked = exhibitionSecurity.requirePassword;
    }
  }
}

function showPasswordPrompt() {
  return new Promise((resolve) => {
    // Создаем модальное окно для ввода пароля
    const modal = document.createElement('div');
    modal.id = 'password-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10002;
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
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    `;
    
    content.innerHTML = `
      <h3 style="margin-top: 0; color: #333;">🔐 Exit Exhibition Mode</h3>
      <p style="color: #666; margin-bottom: 20px;">Enter password to exit exhibition mode:</p>
      <input type="password" id="password-input" 
             style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 20px; font-size: 16px;"
             placeholder="Enter password">
      <div id="password-error" style="color: #ff4757; margin-bottom: 15px; display: none;">
        ❌ Incorrect password. Try again.
      </div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="password-cancel" class="btn btn-secondary" 
                style="padding: 12px 24px;">Cancel</button>
        <button id="password-confirm" class="btn btn-primary" 
                style="padding: 12px 24px;">Exit Exhibition</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const passwordInput = document.getElementById('password-input');
    const errorDiv = document.getElementById('password-error');
    const cancelBtn = document.getElementById('password-cancel');
    const confirmBtn = document.getElementById('password-confirm');
    
    // Фокус на инпут
    setTimeout(() => passwordInput.focus(), 100);
    
    // Функция проверки пароля
    const checkPassword = () => {
      const enteredPassword = passwordInput.value;
      if (enteredPassword === exhibitionSecurity.password) {
        modal.remove();
        resolve(true);
      } else {
        errorDiv.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Встряхиваем окно при ошибке
        content.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          content.style.animation = '';
        }, 500);
      }
    };
    
    // Обработчики событий
    confirmBtn.addEventListener('click', checkPassword);
    
    cancelBtn.addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });
    
    passwordInput.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        checkPassword();
      } else if (e.code === 'Escape') {
        modal.remove();
        resolve(false);
      }
    });
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    });
  });
}

// Экспортируем функции
window.saveExhibitionPassword = saveExhibitionPassword;
window.loadExhibitionPassword = loadExhibitionPassword;
window.showPasswordPrompt = showPasswordPrompt;
// Переменные для кастомизации стрелочки
let pointerCustomization = {
  type: 'default', // 'default' или 'custom'
  image: null,
  imageIsGIF: false,
  size: 100 // процент от базового размера
};

function changePointerType() {
  const type = document.getElementById('pointer-type').value;
  pointerCustomization.type = type;
  
  console.log('🎯 Изменен тип стрелочки:', type);
  
  updatePointerDisplay();
  savePointerCustomization();
}

function updatePointerSize() {
  const size = document.getElementById('pointer-size').value;
  document.getElementById('pointer-size-value').textContent = size;
  
  pointerCustomization.size = parseInt(size);
  
  console.log('📏 Изменен размер стрелочки:', size + '%');
  
  updatePointerDisplay();
  savePointerCustomization();
}

function loadPointerImage(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🎯 Загружаем изображение стрелочки:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    // Проверяем, является ли файл GIF
    if (window.gifHandler && window.gifHandler.isGIF(file)) {
      console.log('🎬 Обнаружен анимированный GIF для стрелочки');
      
      pointerCustomization.image = dataURL;
      pointerCustomization.imageIsGIF = true;
      
      // Для GIF стрелочки создаем анимированный элемент
      createCustomPointerGIF(dataURL);
      
    } else {
      console.log('🖼️ Обычное изображение для стрелочки');
      
      pointerCustomization.image = dataURL;
      pointerCustomization.imageIsGIF = false;
      
      // Удаляем GIF стрелочку если была
      removeCustomPointerGIF();
    }
    
    document.getElementById('pointer-section').classList.add('has-content');
    updatePointerDisplay();
    savePointerCustomization();
    
    notifications.success('Pointer image loaded successfully!');
  };
  reader.readAsDataURL(file);
}

function removePointerImage() {
  // Удаляем GIF стрелочку если есть
  removeCustomPointerGIF();
  
  pointerCustomization.image = null;
  pointerCustomization.imageIsGIF = false;
  
  document.getElementById('pointer-section').classList.remove('has-content');
  updatePointerDisplay();
  savePointerCustomization();
  
  notifications.info('Pointer image removed');
}

function updatePointerDisplay() {
  const pointer = document.querySelector('.pointer');
  if (!pointer) return;
  
  const sizeMultiplier = pointerCustomization.size / 100;
  
  if (pointerCustomization.type === 'custom' && pointerCustomization.image && !pointerCustomization.imageIsGIF) {
    // Кастомное статичное изображение
    pointer.style.cssText = `
      position: absolute;
      top: ${-20 * sizeMultiplier}px;
      left: 50%;
      transform: translateX(-50%);
      width: ${60 * sizeMultiplier}px;
      height: ${60 * sizeMultiplier}px;
      background-image: url(${pointerCustomization.image});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 100;
      filter: drop-shadow(0 ${4 * sizeMultiplier}px ${8 * sizeMultiplier}px rgba(0, 0, 0, 0.3));
      border: none;
    `;
  } else if (pointerCustomization.type === 'custom' && pointerCustomization.imageIsGIF) {
    // Для анимированного GIF прячем CSS стрелочку
    pointer.style.display = 'none';
  } else {
    // Стандартная CSS стрелочка
    pointer.style.cssText = `
      position: absolute;
      top: ${-20 * sizeMultiplier}px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: ${30 * sizeMultiplier}px solid transparent;
      border-right: ${30 * sizeMultiplier}px solid transparent;
      border-top: ${60 * sizeMultiplier}px solid #ff4757;
      z-index: 100;
      filter: drop-shadow(0 ${4 * sizeMultiplier}px ${8 * sizeMultiplier}px rgba(0, 0, 0, 0.3));
      display: block;
    `;
  }
}

function createCustomPointerGIF(dataURL) {
  // Удаляем старый GIF указатель если есть
  removeCustomPointerGIF();
  
  const wheelContainer = document.querySelector('.wheel-container');
  if (!wheelContainer) return;
  
  const gifPointer = document.createElement('img');
  gifPointer.id = 'custom-pointer-gif';
  gifPointer.src = dataURL;
  gifPointer.className = 'custom-pointer-gif';
  
  const sizeMultiplier = pointerCustomization.size / 100;
  const size = 60 * sizeMultiplier;
  
  gifPointer.style.cssText = `
    position: absolute;
    top: ${-20 * sizeMultiplier}px;
    left: 50%;
    transform: translateX(-50%);
    width: ${size}px;
    height: ${size}px;
    z-index: 100;
    filter: drop-shadow(0 ${4 * sizeMultiplier}px ${8 * sizeMultiplier}px rgba(0, 0, 0, 0.3));
    object-fit: contain;
  `;
  
  wheelContainer.appendChild(gifPointer);
  
  console.log('✅ Создана анимированная GIF стрелочка');
}

function removeCustomPointerGIF() {
  const existingGIF = document.getElementById('custom-pointer-gif');
  if (existingGIF && existingGIF.parentElement) {
    existingGIF.parentElement.removeChild(existingGIF);
    console.log('🗑️ Удалена GIF стрелочка');
  }
  
  // Показываем обычную стрелочку
  const pointer = document.querySelector('.pointer');
  if (pointer) {
    pointer.style.display = 'block';
  }
}

function savePointerCustomization() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('pointerCustomization', JSON.stringify(pointerCustomization));
  }
}

function loadPointerCustomization() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('pointerCustomization');
    if (saved) {
      pointerCustomization = { ...pointerCustomization, ...JSON.parse(saved) };
      
      // Восстанавливаем UI
      document.getElementById('pointer-type').value = pointerCustomization.type;
      document.getElementById('pointer-size').value = pointerCustomization.size;
      document.getElementById('pointer-size-value').textContent = pointerCustomization.size;
      
      // Восстанавливаем изображение
      if (pointerCustomization.image) {
        if (pointerCustomization.imageIsGIF) {
          createCustomPointerGIF(pointerCustomization.image);
        }
        document.getElementById('pointer-section').classList.add('has-content');
      }
      
      // Обновляем отображение
      updatePointerDisplay();
    }
  }
}

// Экспортируем функции
window.changePointerType = changePointerType;
window.updatePointerSize = updatePointerSize;
window.loadPointerImage = loadPointerImage;
window.removePointerImage = removePointerImage;
window.updatePointerDisplay = updatePointerDisplay;
window.createCustomPointerGIF = createCustomPointerGIF;
window.removeCustomPointerGIF = removeCustomPointerGIF;
window.savePointerCustomization = savePointerCustomization;
window.loadPointerCustomization = loadPointerCustomization;

function selectTheme(themeName) {
  selectedTheme = themeName;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
  
  console.log('🎨 Выбрана тема:', themeName);
}
// ДОБАВЬ ЭТУ ФУНКЦИЮ В APP.JS ДЛЯ ОТЛАДКИ МАСКИ
function debugClipPath() {
  console.log('🎭 ОТЛАДКА CLIP-PATH МАСКИ:');
  
  const gifContainers = document.querySelectorAll('.animated-sector-bg-container');
  
  gifContainers.forEach((container, index) => {
    const clipPath = container.style.clipPath;
    console.log(`Контейнер ${index}:`);
    console.log(`  - clipPath: ${clipPath}`);
    console.log(`  - webkitClipPath: ${container.style.webkitClipPath}`);
    console.log(`  - размеры: ${container.offsetWidth}x${container.offsetHeight}`);
    
    // ВРЕМЕННО показываем границы контейнера
    container.style.border = '3px solid yellow';
    container.style.background = 'rgba(255,0,0,0.3)';
    
    // ВРЕМЕННО убираем clip-path чтобы увидеть полный контейнер
    container.style.clipPath = 'none';
    container.style.webkitClipPath = 'none';
    
    console.log('⚠️ Временно убрана маска - видишь полный GIF контейнер с желтой рамкой');
  });
  
  // Возвращаем маски через 5 секунд
  setTimeout(() => {
    gifContainers.forEach((container, index) => {
      // Пересоздаем маску
      if (window.gifHandler && window.wheel) {
        const wheelCanvas = document.getElementById('wheel-canvas');
        const gifElement = container.querySelector('img');
        window.gifHandler.updateSectorBackgroundGIF(index, wheelCanvas, container, gifElement);
      }
      
      container.style.border = 'none';
      container.style.background = 'transparent';
      console.log(`✅ Маска восстановлена для контейнера ${index}`);
    });
  }, 5000);
}

// Экспортируем функцию
window.debugClipPath = debugClipPath;
// ДОБАВЬ ЭТИ ФУНКЦИИ В APP.JS

function uploadSectorBackground(index, file) {
  if (!file) return;
  
  console.log(`🎨 Загружаем статичное фоновое изображение для сектора ${index}:`, file.name);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    const items = [...wheel.items];
    
    // Просто сохраняем как статичное изображение
    items[index].sectorBackgroundImage = dataURL;
    items[index].sectorBackgroundIsGIF = false; // Всегда false
    
    wheel.items = items;
    updateItemsList();
    updateUI();
    
    notifications.success(`Фоновое изображение загружено для сектора ${index + 1}`);
  };
  reader.readAsDataURL(file);
}
// ЗАМЕНИ removeSectorBackground В APP.JS
// ЗАМЕНИ removeSectorBackground В APP.JS
function removeSectorBackground(index) {
  const items = [...wheel.items];
  items[index].sectorBackgroundImage = null;
  items[index].sectorBackgroundIsGIF = false;
  
  wheel.items = items;
  updateItemsList();
  updateUI();
  
  notifications.info(`Фоновое изображение удалено для сектора ${index + 1}`);
}
// Экспортируй функции
window.uploadSectorBackground = uploadSectorBackground;
window.removeSectorBackground = removeSectorBackground;

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
  triggerAutoSave();
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
  
  // ИСПРАВЛЕНИЕ: Сохраняем ВСЕ пользовательские данные элементов
  const userItemsData = wheel.items.map(item => ({
    label: item.label,
    weight: item.weight,
    isWin: item.isWin,
    image: item.image,
    imageIsGIF: item.imageIsGIF,
    sectorBackgroundImage: item.sectorBackgroundImage,
    sectorBackgroundIsGIF: item.sectorBackgroundIsGIF
    // НЕ сохраняем backgroundColor - пусть тема его меняет
  }));
  
  // Применяем цвета темы (это заменит индивидуальные цвета)
  wheel.itemBackgroundColors = [...theme.colors];
  wheel.borderWidth = theme.borderWidth;
  wheel.borderColor = theme.borderColor;
  
  // ИСПРАВЛЕНИЕ: Очищаем индивидуальные цвета у элементов, но сохраняем остальные данные
  wheel.items.forEach((item, index) => {
    if (userItemsData[index]) {
      // Восстанавливаем пользовательские данные
      item.label = userItemsData[index].label;
      item.weight = userItemsData[index].weight;
      item.isWin = userItemsData[index].isWin;
      item.image = userItemsData[index].image;
      item.imageIsGIF = userItemsData[index].imageIsGIF;
      item.sectorBackgroundImage = userItemsData[index].sectorBackgroundImage;
      item.sectorBackgroundIsGIF = userItemsData[index].sectorBackgroundIsGIF;
      
      // УБИРАЕМ индивидуальный цвет чтобы тема работала
      item.backgroundColor = null;
    }
  });
  
  // Сохраняем текущую тему для декоративных элементов
  wheel._currentTheme = theme;
  
  // Применяем специальный стиль ободка
  applyBorderStyle(theme.borderStyle, theme);
  
  // Обновляем отображение БЕЗ updateItemsList (чтобы не сбросить select'ы)
  wheel.refresh();
  
  // ИСПРАВЛЕНИЕ: Используем updateItemsListWithoutReset чтобы сохранить select'ы
  updateItemsListWithoutReset();
  
  // Добавляем декоративные элементы
  setTimeout(() => {
    addWheelDecorations();
  }, 100);
  
  notifications.success(`Applied theme: ${theme.name} (user data preserved)`);
  console.log('✅ Тема применена с сохранением пользовательских данных:', selectedTheme);
}



// Экспортируем функцию

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
  triggerAutoSave();
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
  updateExhaustedSectorOverlays();
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
  triggerAutoSave();
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
    sectors10: '10 sectors',
    sectors12: '12 sectors', 
    sectors16: '16 sectors',
    sectors20: '20 sectors',
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
    sectors10: '10 מקטעים',
    sectors12: '12 מקטעים', 
    sectors16: '16 מקטעים',
    sectors20: '20 מקטעים',
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
	loadPrizeImageSettings();
	loadAutoSavedProject();
	startPeriodicAutoSave();
    setTimeout(() => {
	  initializeStatisticsWithAllSectors();
	  loadPrizeImageSettings(); // Также загружаем настройки миниатюр
	}, 1000);
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
window.addEventListener('beforeunload', () => {
  stopPeriodicAutoSave();
  // Финальное сохранение перед закрытием
  autoSaveCurrentProject();
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
  // Если пытаемся ВЫЙТИ из выставочного режима
  if (exhibitionMode) {
    // Проверяем нужен ли пароль
    if (exhibitionSecurity.requirePassword && exhibitionSecurity.password) {
      console.log('🔐 Требуется пароль для выхода из выставочного режима');
      
      const passwordCorrect = await showPasswordPrompt();
      if (!passwordCorrect) {
        console.log('❌ Неверный пароль - остаемся в выставочном режиме');
        return; // Остаемся в выставочном режиме
      }
      
      console.log('✅ Пароль верный - выходим из выставочного режима');
    }
  }
  
  // Переключаем режим
  exhibitionMode = !exhibitionMode;
  
  if (exhibitionMode) {
    // ВКЛЮЧАЕМ ВЫСТАВОЧНЫЙ РЕЖИМ
    
    // Включаем полноэкранный режим через Electron
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-fullscreen', true);
        console.log('🖥️ Полноэкранный режим ВКЛЮЧЕН');
      } catch (error) {
        console.log('❌ Не удалось включить полноэкранный режим:', error);
      }
    }
    
    // Скрываем интерфейс
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.status-bar').style.display = 'none';
    document.querySelector('.main-content').style.padding = '0';
    document.body.style.cursor = 'none';
    
    // Скрываем меню
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-menu', false);
      } catch (error) {
        console.log('❌ Не удалось скрыть меню:', error);
      }
    }
    
    // Настраиваем колесо для полноэкранного режима
    const wheelContainer = document.querySelector('.wheel-container');
    wheelContainer.style.transform = 'none';
    wheelContainer.style.margin = 'auto';
    
    // Добавляем обработчик клика на весь документ
    document.addEventListener('click', globalClickHandler);
    
    console.log('🎭 Выставочный режим ВКЛЮЧЕН (полноэкранный)');
    
    if (typeof notifications !== 'undefined') {
      const exitHint = exhibitionSecurity.requirePassword && exhibitionSecurity.password 
        ? 'Press ESC and enter password to exit'
        : 'Press ESC to exit';
      notifications.info(`Exhibition mode enabled (fullscreen). ${exitHint}`);
    }
    
  } else {
    // ВЫКЛЮЧАЕМ ВЫСТАВОЧНЫЙ РЕЖИМ
    
    // Выключаем полноэкранный режим через Electron
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-fullscreen', false);
        console.log('🖥️ Полноэкранный режим ВЫКЛЮЧЕН');
      } catch (error) {
        console.log('❌ Не удалось выключить полноэкранный режим:', error);
      }
    }
    
    // Возвращаем интерфейс
    document.querySelector('.sidebar').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.status-bar').style.display = 'flex';
    document.querySelector('.main-content').style.padding = '20px';
    document.body.style.cursor = 'default';
    
    // Показываем меню
    if (typeof require !== 'undefined') {
      try {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('toggle-menu', true);
      } catch (error) {
        console.log('❌ Не удалось показать меню:', error);
      }
    }
    
    // Возвращаем обычное позиционирование колеса
    const wheelContainer = document.querySelector('.wheel-container');
    wheelContainer.style.transform = 'none';
    wheelContainer.style.margin = '0 auto';
    
    // Удаляем глобальный обработчик клика
    document.removeEventListener('click', globalClickHandler);
    
    console.log('🎭 Выставочный режим ВЫКЛЮЧЕН');
    
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
		  pendingStop = false;
		  
		  // Сбрасываем флаги постоянного вращения при остановке
		  if (window.isContinuousSpinning) {
			window.isContinuousSpinning = false;
			isContinuousSpinning = false;
		  }
		  
		  updateSpinButton();
		  
		  const winner = wheel.items[event.currentIndex];
		  
		  console.log(`🎲 Выбран сектор ${event.currentIndex}: "${winner.label}", isWin = ${winner.isWin}`);
		  

		  let realWinnerName = winner.label;
			if (hideSectorNames && winner._hiddenLabel) {
			  realWinnerName = winner._hiddenLabel;
			  console.log(`📊 onRest: используем скрытое имя "${realWinnerName}" вместо "${winner.label}"`);
			} else if (!realWinnerName || realWinnerName === '') {
			  realWinnerName = `Sector ${event.currentIndex + 1}`;
			  console.log(`📊 onRest: пустое имя, используем "${realWinnerName}"`);
			}
			showResult(realWinnerName, event.currentIndex, winner.image);
			updateStatistics(realWinnerName);
		  
		  if (document.getElementById('enable-sound').checked) {
			if (winner.isWin === false) {
			  playLoseSound();
			} else {
			  playWinSound();
			}
		  }
		  
		  console.log('🔄 Режим постоянного вращения:', continuousSpinMode, 'Ожидаем закрытия результата');
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
    if (!instantStopMode && !continuousSpinMode) {
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
	}
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
  initializeExhaustedOverlaySystem();
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
function playLoseSound() {
  console.log('🎵 Lose sound effect');
  if (typeof sounds !== 'undefined') {
    sounds.playLoseSound();
  }
}
window.playLoseSound = playLoseSound;
window.updateItemsListWithoutReset = updateItemsListWithoutReset;
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
	document.addEventListener('keydown', async function(e) {
	  const activeElement = document.activeElement;
	  const isInputActive = activeElement && (
		activeElement.tagName === 'INPUT' || 
		activeElement.tagName === 'TEXTAREA' || 
		activeElement.isContentEditable
	  );
	  
	  if (e.code === 'Space') {
		if (isInputActive) {
		  return;
		}
		e.preventDefault();
		console.log('⌨️ Нажат пробел');
		if (resultPopupVisible) {
		  closeResultPopup();
		} else if (exhibitionMode) {
		  spinWheel();
		}
	  } else if (e.code === 'Escape') {
		// НОВАЯ ЛОГИКА ДЛЯ ESC
		if (exhibitionMode) {
		  e.preventDefault();
		  console.log('⌨️ ESC в выставочном режиме');
		  await toggleExhibitionMode(); // Вызываем с проверкой пароля
		} else {
		  stopWheel(); // Обычное поведение
		}
	  } else if (e.code === 'Delete') {
		removeSelectedItem();
	  } else if (e.code === 'KeyE' && e.ctrlKey) {
		e.preventDefault();
		await toggleExhibitionMode();
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
	setTimeout(() => {
	  const continuousCheckbox = document.getElementById('continuous-spin-mode');
	  const speedInput = document.getElementById('continuous-speed');
	  
	  if (continuousCheckbox) {
		continuousCheckbox.addEventListener('change', toggleContinuousSpinMode);
	  }
	  
	  if (speedInput) {
		speedInput.addEventListener('input', updateContinuousSpeed);
	  }
	  
	  console.log('🔄 Обработчики режима постоянного вращения настроены');
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
	// Стрелочка
	  const pointerInput = document.getElementById('pointer-image');
	  if (pointerInput) {
		console.log('✅ Найден input для стрелочки');
		pointerInput.addEventListener('change', function() {
		  if (this.files[0]) {
			console.log('🎯 Выбран файл стрелочки:', this.files[0].name);
			loadPointerImage(this);
		  }
		});
	  }
	    const winPopupInput = document.getElementById('win-popup-background');
		if (winPopupInput) {
		  console.log('✅ Найден input для win popup');
		  winPopupInput.addEventListener('change', function() {
			if (this.files[0]) {
			  console.log('🖼️ Выбран файл фона win popup:', this.files[0].name);
			  loadWinPopupBackground(this);
			}
		  });
		}

		// Lose popup фон
		const losePopupInput = document.getElementById('lose-popup-background');
		if (losePopupInput) {
		  console.log('✅ Найден input для lose popup');
		  losePopupInput.addEventListener('change', function() {
			if (this.files[0]) {
			  console.log('🖼️ Выбран файл фона lose popup:', this.files[0].name);
			  loadLosePopupBackground(this);
			}
		  });
		}

		// Цвета текста
		const winTextColorInput = document.getElementById('win-popup-text-color');
		if (winTextColorInput) {
		  winTextColorInput.addEventListener('change', updateWinPopupTextColor);
		}

		const loseTextColorInput = document.getElementById('lose-popup-text-color');
		if (loseTextColorInput) {
		  loseTextColorInput.addEventListener('change', updateLosePopupTextColor);
		}
	  
	  console.log('✅ Обработчики файлов настроены включая стрелочку'); 
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
	const winTextColorInput = document.getElementById('win-popup-text-color');
	if (winTextColorInput) {
	  winTextColorInput.addEventListener('change', function() {
		customization.winPopupTextColor = this.value;
		saveCustomization();
	  });
	}

	const loseTextColorInput = document.getElementById('lose-popup-text-color');
	if (loseTextColorInput) {
	  loseTextColorInput.addEventListener('change', function() {
		customization.losePopupTextColor = this.value;
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
  initializeStatisticsWithAllSectors
  // Обновляем UI
  setupPresetButtons();
  updateItemsList();
  updateUI();
  
  // Обновляем статус бар
  document.getElementById('current-preset').textContent = window.WheelPresets[presetName].name;
  
  console.log('✅ Applied preset:', presetName);
    setTimeout(() => {
    initializeStatisticsWithAllSectors();
  }, 100);
  
  // Показываем уведомление если доступно
  if (typeof notifications !== 'undefined') {
    notifications.success(`Applied preset: ${window.WheelPresets[presetName].name}`);
  }
  // Показываем уведомление если доступно
  if (typeof notifications !== 'undefined') {
    notifications.success(`Applied preset: ${window.WheelPresets[presetName].name}`);
  }
  applyExhaustedOverlaysToWheel();
  triggerAutoSave();
  restoreItemInputHandlers();
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
  triggerAutoSave();
}

function editItem(index, property, value) {
  if (property === 'weight') {
    value = parseFloat(value) || 1;
  }
  
  // НОВАЯ ЛОГИКА: обработка изменения имени сектора
  if (property === 'label') {
    console.log(`📝 Изменяем имя сектора ${index}: "${wheel.items[index].label}" → "${value}"`);
    
    // Получаем старое имя для статистики
    const oldStatsKey = hideSectorNames && wheel.items[index]._hiddenLabel ? 
                        wheel.items[index]._hiddenLabel : wheel.items[index].label;
    
    // Обновляем имена в зависимости от режима
    if (hideSectorNames) {
      // В режиме скрытых имен обновляем _hiddenLabel, а label оставляем пустым
      wheel.items[index]._hiddenLabel = value;
      wheel.items[index].label = '';
    } else {
      // В обычном режиме обновляем label
      wheel.items[index].label = value;
      // Если есть _hiddenLabel, тоже обновляем для синхронизации
      if (wheel.items[index]._hiddenLabel) {
        wheel.items[index]._hiddenLabel = value;
      }
    }
    
    // Обновляем статистику - переименовываем ключ
    if (oldStatsKey && oldStatsKey !== value) {
      updateStatisticsKey(oldStatsKey, value);
    }
  } else {
    // Обычная логика для остальных свойств
    wheel.items[index][property] = value;
  }
  
  // Обновляем только если это НЕ изменение isWin
  if (property !== 'isWin') {
    updateItemsListWithoutReset();
  }
  
  updateUI();
  
  // Отладка для isWin
  if (property === 'isWin') {
    console.log(`🎯 editItem: установили ${property} = ${value} для сектора ${index}`);
    console.log(`🔍 Проверка: wheel.items[${index}].isWin =`, wheel.items[index].isWin);
  }
  
  setTimeout(() => {
    if (typeof saveAutomaticProject === 'function') {
      saveAutomaticProject();
      console.log(`💾 Автоматически сохранен проект после изменения ${property}`);
    }
  }, 100);
  
  triggerAutoSave();
}

// Добавь эту новую функцию для обновления ключей в статистике
function updateStatisticsKey(oldKey, newKey) {
  if (!statistics.results || oldKey === newKey) return;
  
  // Если старый ключ существует в статистике
  if (statistics.results.hasOwnProperty(oldKey)) {
    // Переносим значение на новый ключ
    statistics.results[newKey] = statistics.results[oldKey];
    // Удаляем старый ключ
    delete statistics.results[oldKey];
    
    console.log(`📊 Переименована статистика: "${oldKey}" → "${newKey}"`);
    saveStatistics();
  } else {
    // Если старого ключа нет, создаем новый с нулевым значением
    if (!statistics.results[newKey]) {
      statistics.results[newKey] = 0;
      console.log(`📊 Создана новая запись в статистике: "${newKey}"`);
    }
  }
}
window.updateStatisticsKey=updateStatisticsKey;
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
  triggerAutoSave();
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
  triggerAutoSave();
}

// ЗАМЕНИ всю функцию updateItemsList на эту исправленную версию
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
    
    const hasImage = item.image && item.image !== null;
    const isGIFImage = item.imageIsGIF || false;
    const imageTypeText = isGIFImage ? '🎬 GIF' : '🖼️';
    
    // ИСПРАВЛЕНИЕ: определяем реальное имя для отображения
    const displayName = hideSectorNames && item._hiddenLabel ? item._hiddenLabel : item.label;
    const inputValue = hideSectorNames && item._hiddenLabel ? item._hiddenLabel : item.label;
    
    card.innerHTML = `
      <div class="item-header">
        <div class="item-label">${displayName}</div>
        <div class="item-weight">${percentage}%</div>
      </div>
      <div class="item-controls">
        <input type="text" value="${inputValue}" onchange="editItem(${index}, 'label', this.value)" 
               onclick="event.stopPropagation()" class="form-control" style="font-size: 12px;" placeholder="${t.namePlaceholder}">
        <input type="number" value="${item.weight || 1}" onchange="editItem(${index}, 'weight', this.value)" 
               onclick="event.stopPropagation()" class="form-control" style="font-size: 12px;" 
               min="0.1" step="0.1" placeholder="${t.weightPlaceholder}">
        <select onchange="setWinLose(${index}, this.value)"
                class="form-control" style="font-size: 12px;" data-sector="${index}">
            <option value="win" ${(item.isWin === undefined || item.isWin === true) ? 'selected' : ''}>🏆 Win</option>
            <option value="lose" ${(item.isWin === false) ? 'selected' : ''}>💔 Lose</option>
        </select>
        <div class="item-controls-row">
          <input type="color" value="${item.backgroundColor || getDefaultColor(index)}" 
                 onchange="editItem(${index}, 'backgroundColor', this.value)"
                 onclick="event.stopPropagation()" class="color-input" title="Цвет сектора">
          
          <div class="file-input-wrapper" data-item-index="${index}">
            <input type="file" accept="image/*">
            ${hasImage ? imageTypeText : t.photo}
          </div>
          
          <div class="file-input-wrapper sector-bg-wrapper" data-item-index="${index}" title="Фоновое изображение сектора">
            <input type="file" accept="image/*" class="sector-bg-input">
            🎨 Sector BG
          </div>
          
          ${hasImage ? `<div class="image-preview-container">
            ${isGIFImage ? '🎬' : `<img src="${item.image}" class="image-preview" onclick="event.stopPropagation()">`}
          </div>` : ''}
          
          ${hasImage ? `<button class="btn-small btn-danger" onclick="event.stopPropagation(); removeItemImage(${index})">${t.removePhoto}</button>` : ''}
          
          ${(item.sectorBackgroundImage && item.sectorBackgroundImage !== null) ? `<button class="btn-small btn-danger" onclick="event.stopPropagation(); removeSectorBackground(${index})">Remove BG</button>` : ''}
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
          uploadItemImage(index, this.files[0]);
        }
      });
    }
    // Настраиваем обработчик для фонового изображения сектора
    const sectorBgInput = card.querySelector('.sector-bg-input');
    if (sectorBgInput) {
      sectorBgInput.addEventListener('change', function(e) {
        e.stopPropagation();
        if (this.files[0]) {
          uploadSectorBackground(index, this.files[0]);
        }
      });
    }
  });
  triggerAutoSave();
}

// ДОБАВЬ эту новую функцию для настройки обработчиков
function setupItemEventHandlers() {
  console.log('🔧 Настройка обработчиков событий для элементов');
  
  // Проверяем, что список элементов существует
  const itemsList = document.getElementById('items-list');
  if (!itemsList) {
    console.warn('⚠️ Список элементов не найден, пропускаем настройку обработчиков');
    return;
  }
  
  // Ждем немного, чтобы DOM успел обновиться
  setTimeout(() => {
    
    try {
      // Обработчики для текстовых полей (названия)
      document.querySelectorAll('.label-input').forEach(input => {
        const index = parseInt(input.dataset.index);
        
        if (isNaN(index) || !wheel.items[index]) {
          return;
        }
        
        // Убираем возможные блокировки
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
        
        input.addEventListener('click', (e) => e.stopPropagation());
        input.addEventListener('input', function() {
          if (wheel.items[index]) {
            wheel.items[index].label = this.value;
            const itemLabel = this.closest('.item-card')?.querySelector('.item-label');
            if (itemLabel) {
              itemLabel.textContent = this.value;
            }
            wheel.refresh();
            if (typeof triggerAutoSave === 'function') triggerAutoSave();
          }
        });
      });
      
      // Обработчики для числовых полей (веса)
      document.querySelectorAll('.weight-input').forEach(input => {
        const index = parseInt(input.dataset.index);
        
        if (isNaN(index) || !wheel.items[index]) {
          return;
        }
        
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
        
        input.addEventListener('click', (e) => e.stopPropagation());
        input.addEventListener('input', function() {
          if (wheel.items[index]) {
            const value = parseFloat(this.value) || 1;
            wheel.items[index].weight = value;
            wheel.refresh();
            if (typeof updateWeightPercentages === 'function') updateWeightPercentages();
            if (typeof triggerAutoSave === 'function') triggerAutoSave();
          }
        });
      });
      
      // Обработчики для селектов (Win/Lose)
      document.querySelectorAll('.win-lose-select').forEach(select => {
        const index = parseInt(select.dataset.index);
        
        if (isNaN(index) || !wheel.items[index]) {
          return;
        }
        
        select.addEventListener('change', function() {
          if (typeof setWinLose === 'function') {
            setWinLose(index, this.value);
          }
        });
      });
      
      // Обработчики для цветовых полей
      document.querySelectorAll('.item-color-input').forEach(input => {
        const index = parseInt(input.dataset.index);
        
        if (isNaN(index) || !wheel.items[index]) {
          return;
        }
        
        input.addEventListener('click', (e) => e.stopPropagation());
        input.addEventListener('change', function() {
          if (wheel.items[index]) {
            wheel.items[index].backgroundColor = this.value;
            wheel.refresh();
            if (typeof triggerAutoSave === 'function') triggerAutoSave();
          }
        });
      });
      
      // Остальные обработчики (файлы, кнопки) остаются такими же
      // Но тоже с проверками...
      
      console.log('✅ Обработчики событий настроены безопасно');
      
    } catch (error) {
      console.error('❌ Ошибка настройки обработчиков:', error);
    }
    
  }, 100);
    triggerAutoSave();
}
// ДОБАВЬ эту новую функцию в app.js
function updateWeightPercentages() {
  const totalWeight = wheel.items.reduce((sum, item) => sum + (item.weight || 1), 0);
  
  document.querySelectorAll('.item-card').forEach((card, index) => {
    const weightDisplay = card.querySelector('.item-weight');
    if (weightDisplay && wheel.items[index]) {
      const percentage = Math.round(((wheel.items[index].weight || 1) / totalWeight) * 100);
      weightDisplay.textContent = `${percentage}%`;
    }
  });
  
  console.log('📊 Проценты обновлены');
}
function updateItemsListWithoutReset() {
  console.log('🔄 Безопасное обновление списка с сохранением значений');
  
  try {
    // Сохраняем текущие значения select'ов И других input'ов
    const currentValues = {};
    document.querySelectorAll('#items-list input, #items-list select').forEach(input => {
      const itemCard = input.closest('.item-card');
      if (itemCard) {
        const cardIndex = Array.from(itemCard.parentElement.children).indexOf(itemCard);
        if (!currentValues[cardIndex]) {
          currentValues[cardIndex] = {};
        }
        
        if (input.tagName === 'SELECT') {
          currentValues[cardIndex].selectValue = input.value;
        } else if (input.type === 'text') {
          currentValues[cardIndex].labelValue = input.value;
        } else if (input.type === 'number') {
          currentValues[cardIndex].weightValue = input.value;
        } else if (input.type === 'color') {
          currentValues[cardIndex].colorValue = input.value;
        }
      }
    });
    
    // Обновляем список
    updateItemsList();
    
    // Восстанавливаем ВСЕ значения БЕЗОПАСНО
    Object.keys(currentValues).forEach(cardIndex => {
      const values = currentValues[cardIndex];
      
      // Восстанавливаем select с проверкой
      if (values.selectValue) {
        const select = document.querySelector(`select[data-sector="${cardIndex}"]`);
        if (select) {
          select.value = values.selectValue;
        }
      }
      
      // ИСПРАВЛЕННАЯ ЧАСТЬ: Восстанавливаем остальные поля с проверками
      if (values.labelValue) {
        const labelInput = document.querySelector(`#items-list .item-card:nth-child(${parseInt(cardIndex) + 1}) input[type="text"]`);
        if (labelInput && labelInput.parentNode) { // ← ДОБАВЛЯЕМ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ
          labelInput.value = values.labelValue;
        }
      }
      
      if (values.weightValue) {
        const weightInput = document.querySelector(`#items-list .item-card:nth-child(${parseInt(cardIndex) + 1}) input[type="number"]`);
        if (weightInput && weightInput.parentNode) { // ← ДОБАВЛЯЕМ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ
          weightInput.value = values.weightValue;
        }
      }
      
      if (values.colorValue) {
        const colorInput = document.querySelector(`#items-list .item-card:nth-child(${parseInt(cardIndex) + 1}) input[type="color"]`);
        if (colorInput && colorInput.parentNode) { // ← ДОБАВЛЯЕМ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ
          colorInput.value = values.colorValue;
        }
      }
    });
    
    console.log('✅ Список обновлен безопасно');
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
    // В случае ошибки просто обновляем список обычным способом
    updateItemsList();
  }

  triggerAutoSave();
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
  triggerAutoSave();
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
  triggerAutoSave();
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
  triggerAutoSave();
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
  triggerAutoSave();
}

// ИСПРАВЛЕННАЯ функция загрузки ободка колеса с поддержкой GIF
function loadWheelBorderImage(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('🖼️ Загружаем ободок с принудительным растягиванием:', file.name, 'Тип:', file.type);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataURL = e.target.result;
    
    // Проверяем, является ли файл GIF
    if (window.gifHandler && window.gifHandler.isGIF(file)) {
      console.log('🎬 Обнаружен анимированный GIF для ободка');
      
      // Получаем контейнер колеса
      const wheelContainer = document.getElementById('wheel-canvas').parentElement;
      
      // Создаем анимированный GIF ободок с ПРИНУДИТЕЛЬНЫМ растягиванием
      createStretchedGIFBorder(dataURL, wheelContainer);
      
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
      
      // Создаем статичный ободок с ПРИНУДИТЕЛЬНЫМ растягиванием
      createStretchedStaticBorder(dataURL);
      
      customization.wheelBorderImage = dataURL;
      customization.wheelBorderIsGIF = false;
    }
    
    document.getElementById('border-section').classList.add('has-content');
    saveCustomization();
    console.log('✅ Ободок загружен с полным растягиванием!');
    
    if (typeof notifications !== 'undefined') {
      notifications.success('Border loaded with full stretch!');
    }
  };
  reader.readAsDataURL(file);
  triggerAutoSave();
}

// Функция для создания растянутого статичного ободка
function createStretchedStaticBorder(imageDataUrl) {
  const canvas = wheel.canvas;
  const container = canvas.parentElement;
  
  // Удаляем старые ободки
  const oldBorders = container.querySelectorAll('.custom-wheel-border, .animated-wheel-border-container');
  oldBorders.forEach(el => el.remove());
  
  const img = new Image();
  img.onload = function() {
    // Создаем canvas для ободка
    const borderCanvas = document.createElement('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    // КРИТИЧНО: используем размер с запасом для полного покрытия
    const size = Math.max(canvasRect.width, canvasRect.height) * 1.1;
    
    borderCanvas.width = size;
    borderCanvas.height = size;
    borderCanvas.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 10;
    `;
    borderCanvas.className = 'custom-wheel-border stretched-border';
    
    const ctx = borderCanvas.getContext('2d');
    
    // ПРИНУДИТЕЛЬНО растягиваем изображение на весь canvas БЕЗ сохранения пропорций
    ctx.drawImage(img, 0, 0, size, size);
    
    container.appendChild(borderCanvas);
    
    // Добавляем обработчик изменения размера
    const resizeObserver = new ResizeObserver(() => {
      updateStaticBorderSize(borderCanvas, canvas);
    });
    resizeObserver.observe(canvas);
    
    console.log('✅ Статичный ободок растянут на размер:', size);
  };
  
  img.onerror = function() {
    console.error('❌ Ошибка загрузки статичного ободка');
  };
  
  img.src = imageDataUrl;
  
  // Убираем ободок из wheel объекта
  if (wheel) {
    wheel.wheelBorderImage = null;
  }
  triggerAutoSave();
}

// Функция для создания растянутого GIF ободка
function createStretchedGIFBorder(imageDataUrl, container) {
  const canvas = wheel.canvas;
  
  // Удаляем старые ободки
  const oldBorders = container.querySelectorAll('.custom-wheel-border, .animated-wheel-border-container');
  oldBorders.forEach(el => el.remove());
  
  const gifContainer = document.createElement('div');
  gifContainer.className = 'animated-wheel-border-container stretched-gif-border';
  gifContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
    border-radius: 50%;
  `;

  const gifElement = document.createElement('img');
  gifElement.src = imageDataUrl;
  gifElement.className = 'animated-wheel-border-gif stretched';
  
  // Получаем размер колеса и ПРИНУДИТЕЛЬНО растягиваем с запасом
  const canvasRect = canvas.getBoundingClientRect();
  const size = Math.max(canvasRect.width, canvasRect.height) * 1.1;
  
  // КРИТИЧНО: принудительное растягивание БЕЗ сохранения пропорций
  gifElement.style.cssText = `
    width: ${size}px !important;
    height: ${size}px !important;
    object-fit: cover !important;
    object-position: center center !important;
    display: block !important;
    min-width: ${size}px !important;
    min-height: ${size}px !important;
    max-width: none !important;
    max-height: none !important;
  `;
  
  gifContainer.style.width = `${size}px`;
  gifContainer.style.height = `${size}px`;
  
  gifContainer.appendChild(gifElement);
  container.appendChild(gifContainer);
  
  // Обновляем размеры при изменении размера окна
  const resizeObserver = new ResizeObserver(() => {
    updateGIFBorderSize(gifElement, gifContainer, canvas);
  });
  resizeObserver.observe(canvas);
  
  // Сохраняем для управления
  if (window.gifHandler) {
    window.gifHandler.gifElements.set('wheelBorder', gifElement);
    window.gifHandler.gifOverlays.set('wheelBorder', gifContainer);
  }
  
  console.log('✅ GIF ободок растянут на размер:', size);
}

// Вспомогательные функции обновления размеров
function updateStaticBorderSize(borderCanvas, wheelCanvas) {
  const canvasRect = wheelCanvas.getBoundingClientRect();
  const size = Math.max(canvasRect.width, canvasRect.height) * 1.01;
  
  borderCanvas.style.width = `${size}px`;
  borderCanvas.style.height = `${size}px`;
  
  // Перерисовываем с новым размером
  if (customization.wheelBorderImage && !customization.wheelBorderIsGIF) {
    const img = new Image();
    img.onload = function() {
      borderCanvas.width = size;
      borderCanvas.height = size;
      const ctx = borderCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = customization.wheelBorderImage;
  }
  triggerAutoSave();
}

function updateGIFBorderSize(gifElement, gifContainer, wheelCanvas) {
  const canvasRect = wheelCanvas.getBoundingClientRect();
  const size = Math.max(canvasRect.width, canvasRect.height) * 1.01;
  
  // Принудительно растягиваем на полный размер
  gifElement.style.width = `${size}px`;
  gifElement.style.height = `${size}px`;
  gifContainer.style.width = `${size}px`;
  gifContainer.style.height = `${size}px`;
  
  console.log('🔄 Размер GIF ободка обновлен с растягиванием:', size);
}
// ИСПРАВЛЕННАЯ функция удаления ободка колеса
function removeWheelBorderImage() {
  console.log('🗑️ Удаляем ободок колеса...');
  
  // 1. Удаляем GIF ободок если есть
  if (window.gifHandler) {
    window.gifHandler.removeWheelBorderGIF();
  }
  
  // 2. Удаляем все кастомные ободки (статичные и GIF)
  const container = wheel ? wheel.canvas.parentElement : document.getElementById('wheel-container');
  if (container) {
    const bordersToRemove = container.querySelectorAll(
      '.custom-wheel-border, ' +
      '.animated-wheel-border-container, ' +
      '.stretched-gif-border, ' +
      '.stretched-border'
    );
    
    console.log('🔍 Найдено ободков для удаления:', bordersToRemove.length);
    
    bordersToRemove.forEach((el, index) => {
      console.log(`➜ Удаляем ободок ${index + 1}:`, el.className);
      el.remove();
    });
  }
  
  // 3. Очищаем настройки кастомизации
  customization.wheelBorderImage = null;
  customization.wheelBorderIsGIF = false;
  
  // 4. Убираем ободок из wheel объекта
  if (wheel) {
    wheel.wheelBorderImage = null;
    wheel._borderImageElement = null;
    // Принудительно обновляем колесо
    wheel.refresh();
  }
  
  // 5. Убираем визуальную отметку о наличии контента
  const borderSection = document.getElementById('border-section');
  if (borderSection) {
    borderSection.classList.remove('has-content');
  }
  
  // 6. Сохраняем изменения
  saveCustomization();
  
  console.log('✅ Ободок полностью удален');
  
  if (typeof notifications !== 'undefined') {
    notifications.info('Border completely removed');
  }
  
  // 7. Дополнительная проверка через небольшую задержку
  setTimeout(() => {
    const remainingBorders = container ? container.querySelectorAll(
      '.custom-wheel-border, .animated-wheel-border-container, .stretched-gif-border'
    ) : [];
    
    if (remainingBorders.length > 0) {
      console.warn('⚠️ Обнаружены оставшиеся ободки, принудительно удаляем...');
      remainingBorders.forEach(el => el.remove());
    }
  }, 100);
  triggerAutoSave();
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
  triggerAutoSave();
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
  triggerAutoSave();
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
        }} else {
          console.log('🖼️ Восстанавливаем обычный ободок');
          wheel.wheelBorderImage = customization.wheelBorderImage;
		  }
        
        document.getElementById('border-section').classList.add('has-content');
      }
      
		if (customization.winPopupTextColor) {
		  document.getElementById('win-popup-text-color').value = customization.winPopupTextColor;
		}
		if (customization.losePopupTextColor) {
		  document.getElementById('lose-popup-text-color').value = customization.losePopupTextColor;
		}

		// ПОДДЕРЖКА СТАРЫХ НАСТРОЕК: если есть старые настройки, переносим их на win popup
		if (customization.popupBackground && !customization.winPopupBackground) {
		  customization.winPopupBackground = customization.popupBackground;
		  customization.winPopupBackgroundIsGIF = customization.popupBackgroundIsGIF || false;
		}
		if (customization.popupTextColor && !customization.winPopupTextColor) {
		  customization.winPopupTextColor = customization.popupTextColor;
		  document.getElementById('win-popup-text-color').value = customization.winPopupTextColor;
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
	loadPointerCustomization();
	loadExhibitionPassword();
	loadResultMessages();
    }
  }


// ИСПРАВЛЕННАЯ функция вращения с учетом весов - основная функция для всех способов запуска
function spinWheel() {
  console.log('🎲 spinWheel() вызвана');
  
  // НОВЫЙ: Режим честной остановки с двойным кликом
  if (instantStopMode) {
    handleDoubleClickLogic();
    return;
  }
  
  // В режиме постоянного вращения - начинаем замедление
  if (continuousSpinMode) {
    if (isContinuousSpinning && !pendingStop) {
      beginSlowdown();
      return;
    } else if (!isContinuousSpinning && !pendingStop) {
      startContinuousSpin();
      return;
    }
    return;
  }
  
  // Стандартный режим (оригинальная логика)
  if (isSpinning) {
    console.log('⚠️ Колесо уже вращается, игнорируем');
    return;
  }
  
  if (wheel.items.length < 2) {
    alert(translations[currentLanguage].addMinimumItems);
    return;
  }
  
  const availableItems = wheel.items.filter((item, index) => {
    const sectorName = item.label;
    const limit = sectorLimits[sectorName];
    
    if (!limit) return true;
    
    const currentCount = statistics.results[sectorName] || 0;
    const isAvailable = currentCount < limit.limit;
    
    return isAvailable;
  });
  
  if (availableItems.length === 0) {
    notifications.error('All sectors have reached their limits! Reset statistics or increase limits.');
    return;
  }
  
  if (availableItems.length === 1) {
    notifications.warning('Only one sector available due to limits!');
  }
  
  const duration = parseInt(document.getElementById('spin-duration').value) * 1000;
  
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
  
  const targetIndex = wheel.items.findIndex(item => item === selectedItem);
  
  console.log('🎯 Выбран элемент с учетом весов и лимитов:', targetIndex, selectedItem.label);
  
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
  
  if (instantStopMode) {
    if (isContinuousSpinning && instantStopEnabled) {
      btn.textContent = 'СТОП! (ЛКМ/ПРОБЕЛ)';
      btn.disabled = false;
    } else if (isContinuousSpinning && !instantStopEnabled) {
      btn.textContent = 'ПОДГОТОВКА...';
      btn.disabled = true;
    } else if (pendingStop) {
      btn.textContent = 'ОСТАНАВЛИВАЕТСЯ...';
      btn.disabled = true;
    } else {
      btn.textContent = 'ЗАПУСТИТЬ ЧЕСТНЫЙ РЕЖИМ';
      btn.disabled = false;
    }
  } else if (continuousSpinMode) {
    if (isContinuousSpinning && !pendingStop) {
      btn.textContent = 'STOP & SPIN';
      btn.disabled = false;
    } else if (pendingStop) {
      btn.textContent = 'STOPPING...';
      btn.disabled = true;
    } else {
      btn.textContent = 'START SPINNING';
      btn.disabled = false;
    }
  } else {
    if (isSpinning) {
      btn.textContent = 'SPINNING...';
      btn.disabled = true;
    } else {
      btn.textContent = 'SPIN WHEEL';
      btn.disabled = false;
    }
  }
}



function showResult(winner, index, image, forceIsWin) {
  resultPopupVisible = true;
  
  // Получаем элемент сектора для доступа к его картинке
  const winnerItem = wheel.items[index];
  
  // Определяем какое изображение использовать: сначала картинку сектора, потом image, потом ничего
  let displayImage = null;

  if (winnerItem && winnerItem.sectorBackgroundImage) {
    // Приоритет - картинка сектора (фон всего сектора)
    displayImage = winnerItem.sectorBackgroundImage;
    console.log('🖼️ Используем картинку сектора как миниатюру');
  } else if (image) {
    // Если нет картинки сектора, используем обычную картинку элемента
    displayImage = image;
    console.log('🖼️ Используем обычную картинку элемента как миниатюру');
  }
  
  let actualIsWin = forceIsWin;
  
  if (actualIsWin === undefined) {
    if (winnerItem && winnerItem.isWin !== undefined) {
      actualIsWin = winnerItem.isWin;
    } else {
      actualIsWin = true;
    }
  }
  
  console.log(`🎭 Показываем результат: winner="${winner}", index=${index}, actualIsWin=${actualIsWin}`);
  let realWinnerName = winner;
  if (hideSectorNames && winnerItem && winnerItem._hiddenLabel) {
    realWinnerName = winnerItem._hiddenLabel;
    console.log(`📊 Скрытые имена: используем "${realWinnerName}" вместо "${winner}" для статистики`);
  } else if (!winner || winner === '') {
    realWinnerName = winnerItem ? (winnerItem.label || `Sector ${index + 1}`) : `Sector ${index + 1}`;
    console.log(`📊 Пустое имя: используем "${realWinnerName}" для статистики`);
  }
  
  
  const popup = document.getElementById('result-popup');
  
  // Устанавливаем соответствующие сообщения и стили
  if (actualIsWin === false) {
    // ПОРАЖЕНИЕ
    document.getElementById('congratulations-header').textContent = resultMessages.loseHeader;
    document.getElementById('popup-result-title').textContent = resultMessages.loseTitle;
    popup.style.border = '3px solid #e74c3c';
    popup.style.color = customization.losePopupTextColor;
    
    // Применяем фон для поражения
    if (customization.losePopupBackground) {
      if (customization.losePopupBackgroundIsGIF && window.gifHandler) {
        window.gifHandler.createPopupBackgroundGIF(customization.losePopupBackground, popup);
        popup.style.backgroundImage = 'none';
      } else {
        if (window.gifHandler) {
          window.gifHandler.removePopupBackgroundGIF();
        }
        popup.style.backgroundImage = `url(${customization.losePopupBackground})`;
        popup.style.backgroundSize = 'cover';
        popup.style.backgroundPosition = 'center';
      }
    } else {
      // Убираем фон если нет кастомного
      popup.style.backgroundImage = 'none';
      if (window.gifHandler) {
        window.gifHandler.removePopupBackgroundGIF();
      }
    }
    
    console.log('💔 Показываем сообщение поражения');
  } else {
    // ПОБЕДА
    document.getElementById('congratulations-header').textContent = resultMessages.winHeader;
    document.getElementById('popup-result-title').textContent = resultMessages.winTitle;
    popup.style.border = '3px solid #00b894';
    popup.style.color = customization.winPopupTextColor;
    
    // Применяем фон для победы
    if (customization.winPopupBackground) {
      if (customization.winPopupBackgroundIsGIF && window.gifHandler) {
        window.gifHandler.createPopupBackgroundGIF(customization.winPopupBackground, popup);
        popup.style.backgroundImage = 'none';
      } else {
        if (window.gifHandler) {
          window.gifHandler.removePopupBackgroundGIF();
        }
        popup.style.backgroundImage = `url(${customization.winPopupBackground})`;
        popup.style.backgroundSize = 'cover';
        popup.style.backgroundPosition = 'center';
      }
    } else {
      // Убираем фон если нет кастомного
      popup.style.backgroundImage = 'none';
      if (window.gifHandler) {
        window.gifHandler.removePopupBackgroundGIF();
      }
    }
    
    console.log('🏆 Показываем сообщение победы');
  }
  
  document.getElementById('winner-text').textContent = winner;

  // Обработка изображения приза
  const prizeImageContainer = document.querySelector('.result-popup');
  let prizeDiv = document.getElementById('prize-background-div');

  // ПРОВЕРЯЕМ НАСТРОЙКУ ОТОБРАЖЕНИЯ
  if (displayImage && prizeImageSettings.showImage) {
    // Удаляем старый div если есть
    if (prizeDiv) {
      prizeDiv.remove();
    }
    
    // Скрываем стандартное изображение
    const prizeImage = document.getElementById('prize-image');
    prizeImage.style.display = 'none';
    
    // Создаем новый div для background
    prizeDiv = document.createElement('div');
    prizeDiv.id = 'prize-background-div';
    prizeDiv.className = 'prize-background-image';
    
    // Вставляем перед кнопками
    const winnerText = document.getElementById('winner-text');
    prizeImageContainer.insertBefore(prizeDiv, winnerText);
    
    // Применяем все стили сразу
    updatePrizeBackgroundDiv(prizeDiv, displayImage);
    
    console.log('🖼️ Создан новый prize div с изображением');
  } else {
    // Скрываем все элементы изображения (либо нет картинки, либо отключено отображение)
    const prizeImage = document.getElementById('prize-image');
    prizeImage.style.display = 'none';
    
    if (prizeDiv) {
      prizeDiv.style.display = 'none';
    }
    
    if (!prizeImageSettings.showImage) {
      console.log('🚫 Отображение картинки отключено пользователем');
    } else {
      console.log('❌ Нет изображения для отображения');
    }
  }
  
  // Показываем popup
  document.getElementById('overlay').classList.add('show');
  document.getElementById('result-popup').classList.add('show');
  document.getElementById('last-result').textContent = winner;
}

function closeResultPopup() {
  resultPopupVisible = false;
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('result-popup').classList.remove('show');
  
  console.log('🔄 Закрытие результата. Режим постоянного вращения:', continuousSpinMode, 'Честный режим:', instantStopMode);
  
  // Если в режиме постоянного вращения - возобновляем вращение
  if (continuousSpinMode && !isContinuousSpinning) {
    console.log('🔄 Возобновляем постоянное вращение после закрытия результата');
    setTimeout(() => {
      startContinuousSpin();
    }, 1000);
  }
if (instantStopMode && !isContinuousSpinning) {
  console.log('🔄 Возобновляем честное вращение после закрытия результата');
  
  // ИСПРАВЛЕНИЕ: сбрасываем все состояния перед перезапуском
  accelerationPhase = false;
  isAccelerating = false;
  
  // ВАЖНО: устанавливаем правильную скорость в зависимости от режима
  const originalSpeed = continuousSpinSpeed;
  if (instantStopAccelerationMode) {
    continuousSpinSpeed = slowSpinSpeed; // 30 для двойного клика
    console.log(`🎯 Восстанавливаем режим 2 клика со скоростью ${slowSpinSpeed}`);
  } else {
    continuousSpinSpeed = singleClickSpeed; // 150 для одинарного клика  
    console.log(`🎯 Восстанавливаем режим 1 клик со скоростью ${singleClickSpeed}`);
  }
  
  setTimeout(() => {
    startContinuousSpin();
    // Возвращаем оригинальную скорость
    continuousSpinSpeed = originalSpeed;
    
    setTimeout(() => {
      instantStopEnabled = true;
      updateSpinButton();
      console.log('✅ Честный режим снова готов к остановке');
    }, 1000);
  }, 500);
}
}

function spinAgain() {
  closeResultPopup();
  setTimeout(() => spinWheel(), 500);
}

// НАЙДИ функцию updateStatistics и ЗАМЕНИ её на эту версию с отладкой:

function updateStatistics(winner) {
  console.log('🎯 ОБНОВЛЯЕМ статистику для:', winner);
  console.log('🎯 updateStatistics вызвана с:', winner);
  console.log('🔍 Откуда вызвана:', new Error().stack);
    if (!winner || winner.trim() === '') {
    console.error('❌ Попытка добавить в статистику пустое имя, пропускаем');
    return;
  }
  const cleanWinner = winner.trim();
  let statsKey = winner;
  if (hideSectorNames) {
    const winnerItem = wheel.items.find(item => 
      (item._originalLabel || item.label) === winner
    );
    statsKey = winnerItem ? (winnerItem._originalLabel || winnerItem.label) : winner;
  }
  
  statistics.totalSpins++;
  statistics.results[statsKey] = (statistics.results[statsKey] || 0) + 1;
  
  console.log('📊 После обновления:', JSON.stringify(statistics));
  
  // Обновляем лимиты если есть
  if (sectorLimits[winner]) {
    sectorLimits[winner].current = statistics.results[winner];
   
  }
  
  document.getElementById('total-spins').textContent = statistics.totalSpins;
  console.log('📱 Обновили UI на:', statistics.totalSpins);
  
  // ВАЖНО: Сохраняем после каждого обновления
  console.log('💾 Вызываем saveStatistics...');
  saveStatistics();
  saveSectorLimits();
  console.log('✅ Сохранение завершено');
  triggerAutoSave();
  
  // ДОБАВЬ ЭТУ СТРОКУ В САМЫЙ КОНЕЦ ФУНКЦИИ:
  updateExhaustedSectorOverlays();
}

function saveSectorLimits() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('sectorLimits', JSON.stringify(sectorLimits));
  }
  applyExhaustedOverlaysToWheel();
  triggerAutoSave();
}

function loadSectorLimits() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('sectorLimits');
    if (saved) {
      sectorLimits = JSON.parse(saved);
      console.log('✅ Лимиты секторов загружены:', sectorLimits);
    }
  }
  applyExhaustedOverlaysToWheel();
  triggerAutoSave();
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
  
  // Быстрое сохранение с автоименем
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const fileName = `wheel-project-${timestamp}.json`;
  
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  notifications.success('Project saved successfully!');
  console.log('💾 Проект быстро сохранен:', fileName);
}

// Экспортируем функцию

// ЗАМЕНИ loadProject В APP.JS НА ЭТУ ПОЛНУЮ ВЕРСИЮ

// ЗАМЕНИ saveProjectWithName В APP.JS НА ЭТУ ВЕРСИЮ БЕЗ PROMPT
function saveProjectWithName() {
  // Создаем кастомное модальное окно вместо prompt
  const modal = document.createElement('div');
  modal.id = 'save-project-modal';
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
    <h3 style="margin-top: 0; color: #333;">💾 Save Project</h3>
    <p style="color: #666;">Enter project name:</p>
    <input type="text" id="project-name-input" value="My Wheel Project" 
           placeholder="Project name" 
           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; margin: 15px 0;">
    <div style="margin-top: 20px;">
      <button onclick="confirmSaveProject()" class="btn btn-primary" 
              style="margin-right: 10px; padding: 10px 20px;">Save</button>
      <button onclick="closeSaveProjectModal()" class="btn btn-secondary" 
              style="padding: 10px 20px;">Cancel</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Фокус на инпут и выделяем текст
  setTimeout(() => {
    const input = document.getElementById('project-name-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
  
  // Закрытие по ESC
  const handleKeydown = (e) => {
    if (e.code === 'Escape') {
      closeSaveProjectModal();
      document.removeEventListener('keydown', handleKeydown);
    } else if (e.code === 'Enter') {
      confirmSaveProject();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
  
  // Закрытие по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeSaveProjectModal();
    }
  });
}

function confirmSaveProject() {
  const input = document.getElementById('project-name-input');
  const projectName = input ? input.value.trim() : '';
  
  if (!projectName) {
    notifications.error('Please enter a project name');
    return;
  }
  
  const projectData = getProjectData();
  projectData.projectMetadata.name = projectName;
  
  // Создаем и скачиваем файл с именем проекта
  const fileName = `${projectName.replace(/[^a-zA-Z0-9-_\s]/g, '_')}-${Date.now()}.json`;
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  closeSaveProjectModal();
  notifications.success(`Project "${projectName}" saved successfully!`);
  console.log('💾 Проект сохранен с именем:', projectName);
}

function closeSaveProjectModal() {
  const modal = document.getElementById('save-project-modal');
  if (modal) {
    modal.remove();
  }
}

function exportProjectSummary(data) {
  const summary = {
    projectName: data.projectMetadata?.name || 'Unnamed',
    version: data.projectMetadata?.version || 'Unknown',
    createdAt: data.projectMetadata?.createdAt || 'Unknown',
    preset: data.preset,
    itemsCount: data.items?.length || 0,
    hasCustomization: {
      backgroundImage: !!data.customization?.backgroundImage,
      wheelBorder: !!data.customization?.wheelBorderImage,
      customPointer: !!data.pointerCustomization?.image,
      customSounds: !!(data.customization?.sounds && Object.keys(data.customization.sounds).length > 0),
      passwordProtection: !!data.exhibitionSecurity?.requirePassword,
      sectorLimits: !!(data.sectorLimits && Object.keys(data.sectorLimits).length > 0)
    }
  };
  
  console.log('📋 Сводка проекта:', summary);
  return summary;
}

// Экспортируем функции
window.saveProjectWithName = saveProjectWithName;
window.exportProjectSummary = exportProjectSummary;

function loadProjectFile() {
  const input = document.getElementById('project-file');
  if (input) {
    input.click();
  } else {
    console.error('❌ Элемент project-file не найден');
    notifications.error('File input not found');
  }
  restoreItemInputHandlers();
}

function handleProjectFile(input) {
  const file = input.files[0];
  if (!file) return;
  
  console.log('📁 Выбран файл проекта:', file.name);
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const projectData = JSON.parse(e.target.result);
      
      // Показываем информацию о проекте
      const projectName = projectData.projectMetadata?.name || 'Unnamed Project';
      const projectVersion = projectData.projectMetadata?.version || 'Unknown';
      const itemsCount = projectData.items?.length || 0;
      
      const confirmMessage = `Load project "${projectName}" (v${projectVersion})?\n\nItems: ${itemsCount}\nThis will replace current settings.`;
      
      if (confirm(confirmMessage)) {
        loadProject(projectData);
      } else {
        console.log('❌ Загрузка проекта отменена пользователем');
      }
      
    } catch (error) {
      console.error('❌ Ошибка парсинга файла проекта:', error);
      notifications.error('Invalid project file format: ' + error.message);
    }
  };
  
  reader.onerror = function() {
    console.error('❌ Ошибка чтения файла проекта');
    notifications.error('Failed to read project file');
  };
  
  reader.readAsText(file);
}

// Экспортируем функции
window.saveProjectWithName = saveProjectWithName;
window.confirmSaveProject = confirmSaveProject;
window.closeSaveProjectModal = closeSaveProjectModal;
window.loadProjectFile = loadProjectFile;
window.handleProjectFile = handleProjectFile;


function loadProject(data) {
  try {
    console.log('📁 Загружаем проект:', data.projectMetadata?.name || 'Unnamed Project');
    console.log('🔍 Данные проекта:', Object.keys(data));
    console.log('🔍 Проверяем первый элемент из data.items:', data.items[0]);
    console.log('🔍 _hiddenLabel первого элемента:', data.items[0]._hiddenLabel, typeof data.items[0]._hiddenLabel);
    
    // ... остальной код ...
    // Показываем индикатор загрузки
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8); color: white; padding: 20px;
      border-radius: 10px; z-index: 10000; text-align: center;
    `;
    loadingDiv.innerHTML = `<div>📁 Loading Project...</div>`;
    document.body.appendChild(loadingDiv);
    
    const safeUpdate = (fn, delay = 50) => {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            fn();
            resolve();
          } catch (error) {
            console.error('❌ Ошибка:', error.message);
            resolve();
          }
        }, delay);
      });
    };
    
    // ПРАВИЛЬНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ
    Promise.resolve()
      
      // ШАГ 1: СНАЧАЛА ПРЕСЕТ!
      .then(() => safeUpdate(() => {
        if (data.preset && window.WheelPresets[data.preset]) {
          console.log('🎨 ШАГ 1: Применяем пресет ПЕРВЫМ:', data.preset);
          currentPreset = data.preset;
          applyPreset(data.preset);
          console.log('✅ ШАГ 1 ВЫПОЛНЕН: Пресет применен');
        }
      }))
      
		// ШАГ 2: НАКЛАДЫВАЕМ ДАННЫЕ ПРОЕКТА
		.then(() => safeUpdate(() => {
		  if (data.items && Array.isArray(data.items)) {
			console.log('🎯 ШАГ 2: Накладываем данные проекта ПОВЕРХ пресета');
			
			// Проверяем что в проекте
			console.log('🔍 Данные из проекта:');
			data.items.forEach((item, i) => {
			  console.log(`  Сектор ${i}: label="${item.label}" (длина: ${item.label?.length || 0}), _hiddenLabel="${item._hiddenLabel}"`);
			});
			
			// ПОЛНОСТЬЮ ЗАМЕНЯЕМ элементы данными из проекта
			wheel.items = data.items.map((projectItem, index) => {
			  console.log(`Создаем элемент ${index}:`, {
				label: projectItem.label,
				_hiddenLabel: projectItem._hiddenLabel,
				hasHiddenLabel: projectItem.hasOwnProperty('_hiddenLabel')
			  });
			  
			  const newItem = {
				weight: projectItem.weight || 1,
				backgroundColor: projectItem.backgroundColor || '#ffffff',
				image: projectItem.image || null,
				imageIsGIF: projectItem.imageIsGIF || false,
				sectorBackgroundImage: projectItem.sectorBackgroundImage || null,
				sectorBackgroundIsGIF: projectItem.sectorBackgroundIsGIF || false,
				isWin: projectItem.isWin !== false
			  };
			  
			  // ЛОГИКА ВОССТАНОВЛЕНИЯ ИМЕН:
			  if (projectItem.hasOwnProperty('_hiddenLabel') && projectItem._hiddenLabel) {
				// Есть скрытое имя - это означает что был режим скрытых имен
				newItem._hiddenLabel = projectItem._hiddenLabel;
				newItem.label = projectItem._hiddenLabel; // ВОССТАНАВЛИВАЕМ имя из _hiddenLabel
				console.log(`✅ Восстановлено имя для элемента ${index}: "${newItem.label}" из _hiddenLabel`);
			  } else {
				// Обычное имя
				newItem.label = projectItem.label || '';
				console.log(`📝 Обычное имя для элемента ${index}: "${newItem.label}"`);
			  }
			  
			  return newItem;
			});
			
			console.log('✅ ШАГ 2 ВЫПОЛНЕН: Элементы заменены данными из проекта');
			updateItemsList();
			updateUI();
		  }
		}))
      
      // ШАГ 3: НАСТРОЙКИ КОЛЕСА
      .then(() => safeUpdate(() => {
        console.log('🎨 ШАГ 3: Применяем настройки дизайна');
        if (data.colors && Array.isArray(data.colors)) wheel.itemBackgroundColors = [...data.colors];
        if (data.borderWidth !== undefined) wheel.borderWidth = data.borderWidth;
        if (data.borderColor) wheel.borderColor = data.borderColor;
        if (data.fontSize !== undefined) wheel.itemLabelFontSizeMax = data.fontSize;
        if (data.textColor) wheel.itemLabelColors = [data.textColor];
        if (data.spinSpeed !== undefined) wheel.rotationSpeedMax = data.spinSpeed;
        if (data.spinDuration !== undefined) wheel.rotationResistance = data.spinDuration;
        if (data.wheelSettings) Object.assign(wheel, data.wheelSettings);
        console.log('✅ ШАГ 3 ВЫПОЛНЕН: Настройки дизайна применены');
      }))
      
      // ШАГ 4: КАСТОМИЗАЦИЯ
		.then(() => safeUpdate(() => {
		  console.log('🎭 ШАГ 4: Применяем кастомизацию');
		  if (data.customization) {
			const oldWinTextColor = customization.winPopupTextColor;
            const oldLoseTextColor = customization.losePopupTextColor;
			customization = { ...customization, ...data.customization };
			  if (customization.winPopupTextColor && customization.winPopupTextColor !== oldWinTextColor) {
				console.log('🎨 Устанавливаем цвет текста победы:', customization.winPopupTextColor);
				const winColorInput = document.getElementById('win-popup-text-color');
				if (winColorInput) winColorInput.value = customization.winPopupTextColor;
			  }
			  
			  if (customization.losePopupTextColor && customization.losePopupTextColor !== oldLoseTextColor) {
				console.log('🎨 Устанавливаем цвет текста поражения:', customization.losePopupTextColor);
				const loseColorInput = document.getElementById('lose-popup-text-color');
				if (loseColorInput) loseColorInput.value = customization.losePopupTextColor;
			  }
			// Обрабатываем режим скрытых имен ПОСЛЕ восстановления имен
			if (typeof data.customization.hideSectorNames !== 'undefined') {
			  hideSectorNames = data.customization.hideSectorNames;
			  document.getElementById('hide-sector-names').checked = hideSectorNames;
			  console.log('🔧 Устанавливаем hideSectorNames:', hideSectorNames);
			  
			  if (hideSectorNames) {
				console.log('🙈 Скрываем имена секторов (режим включен)');
				wheel.items.forEach((item, index) => {
				  if (item._hiddenLabel) {
					console.log(`Скрываем label для сектора ${index}: "${item.label}" -> ""`);
					item.label = '';
				  }
				});
			  }
			  
			  wheel.refresh();
			  updateItemsList();
			}
			if (customization.backgroundImage) {
			  if (customization.backgroundIsGIF && window.gifHandler) {
				window.gifHandler.createBackgroundGIF(customization.backgroundImage);
			  } else {
				document.body.style.backgroundImage = `url(${customization.backgroundImage})`;
			  }
			}
          
          if (customization.wheelBorderImage && wheel) {
            if (customization.wheelBorderIsGIF && window.gifHandler) {
              const wheelContainer = document.getElementById('wheel-canvas').parentElement;
              window.gifHandler.createWheelBorderGIF(customization.wheelBorderImage, wheelContainer);
            } else {
              wheel.wheelBorderImage = customization.wheelBorderImage;
            }
            document.getElementById('border-section').classList.add('has-content');
          }
        }
        console.log('✅ ШАГ 4 ВЫПОЛНЕН: Кастомизация применена');
      }))
      
      // ШАГ 5: УКАЗАТЕЛЬ
      .then(() => safeUpdate(() => {
        if (data.pointerCustomization) {
          pointerCustomization = { ...pointerCustomization, ...data.pointerCustomization };
          if (pointerCustomization.image) {
            if (pointerCustomization.isGIF && window.gifHandler) {
              const pointerContainer = document.querySelector('.pointer-container') || 
                                    document.getElementById('wheel-canvas').parentElement;
              window.gifHandler.createPointerGIF(pointerCustomization.image, pointerContainer);
            } else if (wheel) {
              wheel.pointerImage = pointerCustomization.image;
            }
            document.getElementById('pointer-section').classList.add('has-content');
          }
        }
      }))
      
      // ШАГ 6: БЕЗОПАСНОСТЬ И ЛИМИТЫ
      .then(() => safeUpdate(() => {
        if (data.exhibitionSecurity) exhibitionSecurity = { ...exhibitionSecurity, ...data.exhibitionSecurity };
        if (data.sectorLimits) sectorLimits = { ...data.sectorLimits };
        if (data.currentLanguage && typeof switchLanguage === 'function') switchLanguage(data.currentLanguage);
      }))
      
      // ШАГ 7: СТАТИСТИКА
      .then(() => safeUpdate(() => {
        if (data.statistics) {
          console.log('📊 Загружаем статистику из проекта');
          statistics = { ...data.statistics };
          saveStatistics();
          document.getElementById('total-spins').textContent = statistics.totalSpins;
        }
      }))
      
      // ШАГ 8: ФИНАЛЬНОЕ ОБНОВЛЕНИЕ + WIN/LOSE СЕЛЕКТЫ
      .then(() => safeUpdate(() => {
        console.log('🔄 ШАГ 8: Финальное обновление');
        updateItemsList();
        updateUI();
        
        // Проверяем финальные имена
        console.log('📝 ФИНАЛЬНЫЕ ИМЕНА СЕКТОРОВ:');
        wheel.items.forEach((item, i) => {
          console.log(`  ${i}: "${item.label}" (длина: ${item.label?.length || 0})`);
        });
        
        // ВОССТАНАВЛИВАЕМ WIN/LOSE СЕЛЕКТЫ ИЗ ПРОЕКТА
        if (data.items) {
          console.log('🏆 Применяем win/lose статусы из проекта');
          
          // Применяем isWin значения из проекта
          data.items.forEach((projectItem, index) => {
            if (wheel.items[index]) {
              wheel.items[index].isWin = projectItem.isWin !== false;
              console.log(`🔧 Сектор ${index}: "${projectItem.label}" isWin=${wheel.items[index].isWin}`);
            }
          });
          
          // Обновляем select'ы через короткую задержку
          setTimeout(() => {
            wheel.items.forEach((item, index) => {
              const select = document.querySelector(`select[data-sector="${index}"]`);
              if (select) {
                const correctValue = (item.isWin === false) ? 'lose' : 'win';
                select.value = correctValue;
                console.log(`✅ Select ${index} установлен в: ${correctValue} (isWin: ${item.isWin})`);
              }
            });
          }, 100);
        }
      }))
		.then(() => safeUpdate(() => {
		  console.log('👁️ ШАГ: Применяем настройки скрытия имен');
		  
		  if (typeof data.customization.hideSectorNames !== 'undefined') {
			hideSectorNames = data.customization.hideSectorNames;
			
			// ОБЯЗАТЕЛЬНО обновляем чекбокс
			const checkbox = document.getElementById('hide-sector-names');
			if (checkbox) {
			  checkbox.checked = hideSectorNames;
			  console.log('🔧 Чекбокс Hide Names установлен:', hideSectorNames);
			}
			
			// ПРИНУДИТЕЛЬНО ПРИМЕНЯЕМ СКРЫТИЕ/ПОКАЗ имен
			wheel.items.forEach((item, index) => {
			  if (hideSectorNames) {
				// Если нужно скрыть, сохраняем label и очищаем отображение
				if (item.label && !item._hiddenLabel) {
				  item._hiddenLabel = item.label;
				  item.label = '';
				}
			  } else {
				// Если нужно показать, восстанавливаем из _hiddenLabel
				if (item._hiddenLabel) {
				  item.label = item._hiddenLabel;
				  delete item._hiddenLabel;
				}
			  }
			});
			
			// Принудительная перерисовка
			wheel.refresh();
			console.log('✅ Настройки скрытия имен применены');
		  }
		}))
      // ЗАВЕРШЕНИЕ
      .then(() => {
        if (loadingDiv.parentElement) loadingDiv.parentElement.removeChild(loadingDiv);
        
        saveCustomization();
        savePointerCustomization();
        saveExhibitionPassword();
        saveSectorLimits();
        
        const projectName = data.projectMetadata?.name || 'Project';
        console.log('✅ ПРОЕКТ ЗАГРУЖЕН УСПЕШНО!');
        notifications.success(`Project "${projectName}" loaded successfully!`);
        
        // Финальная перерисовка
        setTimeout(() => {
          if (wheel) {
            wheel.preloadImages();
            wheel.items.forEach((item, index) => {
              if (item.sectorBackgroundImage) {
                const img = new Image();
                img.onload = () => {
                  if (wheel._imageCache) wheel._imageCache.set(item.sectorBackgroundImage, img);
                };
                img.src = item.sectorBackgroundImage;
              }
            });
            wheel.resize();
            wheel.refresh();
          }
        }, 200);
      })
			  
      .catch(error => {
        if (loadingDiv.parentElement) loadingDiv.parentElement.removeChild(loadingDiv);
        console.error('❌ Ошибка загрузки:', error);
        notifications.error('Project loading error: ' + error.message);
      });
      
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    notifications.error('Critical error: ' + error.message);
  }
  applyExhaustedOverlaysToWheel();
  autoResizeBorderAfterProjectLoad();
}

function getProjectData() {
  return {
    // Основные настройки
    preset: currentPreset,
    items: wheel.items.map(item => {
	  const savedItem = {
		label: item.label,
		weight: item.weight,
		backgroundColor: item.backgroundColor,
		image: item.image,
		imageIsGIF: item.imageIsGIF || false,
		sectorBackgroundImage: item.sectorBackgroundImage,
		sectorBackgroundIsGIF: item.sectorBackgroundIsGIF || false,
		isWin: item.isWin,
        exhaustedOverlay: exhaustedOverlayImage

	  };
	  
	  // ИСПРАВЛЕНИЕ: всегда сохраняем _hiddenLabel если он есть
	  if (item._hiddenLabel) {
		savedItem._hiddenLabel = item._hiddenLabel;
		console.log('Сохраняем _hiddenLabel:', item._hiddenLabel);
	  }
	  
	  return savedItem;
	}),
    
    // Настройки колеса (все параметры дизайна)
    colors: wheel.itemBackgroundColors ? [...wheel.itemBackgroundColors] : [],
    borderWidth: wheel.borderWidth,
    borderColor: wheel.borderColor,
    fontSize: wheel.itemLabelFontSizeMax,
    textColor: wheel.itemLabelColors ? wheel.itemLabelColors[0] : '#ffffff',
    spinSpeed: wheel.rotationSpeedMax,
    spinDuration: wheel.rotationResistance,
    
    // НОВОЕ: Сохраняем все настройки колеса
    wheelSettings: {
      pointerAngle: wheel.pointerAngle || 0,
      itemLabelFont: wheel.itemLabelFont || 'Arial',
      itemLabelFontSize: wheel.itemLabelFontSize || 16,
      itemLabelFontSizeMax: wheel.itemLabelFontSizeMax || 16,
      itemLabelColors: wheel.itemLabelColors ? [...wheel.itemLabelColors] : ['#ffffff'],
      borderWidth: wheel.borderWidth || 5,
      borderColor: wheel.borderColor || '#000000'
    },
    
    // Полная кастомизация
    customization: {
      backgroundImage: customization.backgroundImage,
      backgroundIsGIF: customization.backgroundIsGIF,
      wheelBorderImage: customization.wheelBorderImage,
      wheelBorderIsGIF: customization.wheelBorderIsGIF,
      popupBackground: customization.popupBackground,
      popupBackgroundIsGIF: customization.popupBackgroundIsGIF,
      popupTextColor: customization.popupTextColor,
      currentTheme: customization.currentTheme,
      sounds: customization.sounds || {},
      soundVolume: customization.soundVolume || 0.5,
      
      // НОВОЕ: Сохраняем дополнительные настройки UI
      enableSounds: document.getElementById('enable-sounds') ? document.getElementById('enable-sounds').checked : false,
      fontSizeValue: document.getElementById('font-size') ? document.getElementById('font-size').value : 16,
      borderWidthValue: document.getElementById('border-width') ? document.getElementById('border-width').value : 5,
      textColorValue: document.getElementById('text-color') ? document.getElementById('text-color').value : '#ffffff',
      borderColorValue: document.getElementById('border-color') ? document.getElementById('border-color').value : '#000000',
	  hideSectorNames: hideSectorNames
    },
    
    // Кастомизация стрелочки
    pointerCustomization: {
      type: pointerCustomization.type,
      image: pointerCustomization.image,
      imageIsGIF: pointerCustomization.imageIsGIF,
      size: pointerCustomization.size
    },
    
    // Настройки безопасности
    exhibitionSecurity: {
      requirePassword: exhibitionSecurity.requirePassword,
      password: exhibitionSecurity.password
    },
    
    // Лимиты секторов
    sectorLimits: { ...sectorLimits },
    
    // НОВОЕ: Статистика (если нужно сохранять)
    statistics: (function() {
      try {
        const stats = JSON.parse(localStorage.getItem('wheelStatistics') || '{}');
        return {
          totalSpins: stats.totalSpins || 0,
          results: stats.results || {},
          sessionStats: stats.sessionStats || {}
        };
      } catch (e) {
        return { totalSpins: 0, results: {}, sessionStats: {} };
      }
    })(),
    
    // Выбранная тема дизайна
    selectedTheme: selectedTheme,
    
    // НОВОЕ: Все кастомные цветовые схемы пользователя
    customColorSchemes: (function() {
      try {
        return JSON.parse(localStorage.getItem('customColorSchemes') || '{}');
      } catch (e) {
        return {};
      }
    })(),
    
    // Настройки языка
    currentLanguage: currentLanguage,
    
    // НОВОЕ: Состояние табов и UI
    uiState: {
      activeTab: document.querySelector('.tab-button.active') ? 
                 document.querySelector('.tab-button.active').getAttribute('data-tab') : 'presets',
      lastUsedPreset: currentPreset,
      exhibitionMode: document.body.classList.contains('exhibition-mode'),
      
      // Сохраняем значения всех input полей
      formValues: (function() {
        const inputs = {};
        document.querySelectorAll('input[type="range"], input[type="color"], input[type="number"], input[type="text"], input[type="password"]').forEach(input => {
          if (input.id) {
            inputs[input.id] = input.type === 'checkbox' ? input.checked : input.value;
          }
        });
        return inputs;
      })()
    },
    
    // Метаданные проекта (обновленные)
    projectMetadata: {
      name: 'Wheel Project',
      createdAt: new Date().toISOString(),
      version: '2.3.0', // Увеличиваем версию для полного сохранения
      description: 'Complete wheel project with ALL settings and customizations',
      
      // НОВОЕ: Дополнительная информация
      itemsCount: wheel.items ? wheel.items.length : 0,
      hasCustomImages: wheel.items ? wheel.items.some(item => item.image) : false,
      hasCustomSounds: Object.keys(customization.sounds || {}).length > 0,
      hasPasswordProtection: exhibitionSecurity.requirePassword,
      hasSectorLimits: Object.keys(sectorLimits).length > 0,
      
      // Контрольная сумма для проверки целостности
      checksum: Date.now().toString(36)
    }
  };
}
// Функция для проверки полноты сохраненных данных
function validateProjectData(data) {
  const checks = {
    hasItems: data.items && data.items.length > 0,
    hasPreset: !!data.preset,
    hasCustomization: !!data.customization,
    hasPointerCustomization: !!data.pointerCustomization,
    hasWheelSettings: !!data.wheelSettings,
    hasMetadata: !!data.projectMetadata,
    hasUIState: !!data.uiState
  };
  
  const missingData = Object.entries(checks)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingData.length > 0) {
    console.warn('⚠️ Отсутствуют данные:', missingData);
  } else {
    console.log('✅ Все данные проекта присутствуют');
  }
  
  return {
    isComplete: missingData.length === 0,
    missingData: missingData,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.keys(checks).length - missingData.length
  };
}

// Экспортируем функцию для использования
window.validateProjectData = validateProjectData;
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
    try {
      console.log('💾 СОХРАНЯЕМ статистику:', statistics);
      localStorage.setItem('wheelStatistics', JSON.stringify(statistics));
      
      // ПРОВЕРЯЕМ что действительно сохранилось
      const saved = localStorage.getItem('wheelStatistics');
      console.log('✅ ПРОВЕРКА: сохранено в localStorage:', saved);
      
    } catch (error) {
      console.error('❌ Ошибка сохранения статистики:', error);
    }
  } else {
    console.error('❌ localStorage недоступен!');
  }
    triggerAutoSave();
}

function showStatistics() {
  showDetailedStatistics(); // Вызываем детальную статистику
}

function loadStatistics() {
  if (typeof Storage !== 'undefined') {
    try {
      const saved = localStorage.getItem('wheelStatistics');
      console.log('📊 ЗАГРУЖАЕМ статистику из localStorage:', saved);
      
      if (saved) {
        statistics = JSON.parse(saved);
        console.log('✅ Статистика успешно загружена:', statistics);
        
        document.getElementById('total-spins').textContent = statistics.totalSpins;
        console.log('📱 Обновили UI, totalSpins:', statistics.totalSpins);
      } else {
        console.log('⚠️ Сохраненной статистики не найдено, используем пустую');
        statistics = { totalSpins: 0, results: {} };
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки статистики:', error);
      statistics = { totalSpins: 0, results: {} };
    }
  } else {
    console.error('❌ localStorage недоступен!');
    statistics = { totalSpins: 0, results: {} };
  }
    triggerAutoSave();
}
function resetStatistics() {
  const t = translations[currentLanguage];
  if (confirm(t.resetStatsConfirm)) {
    statistics = { totalSpins: 0, results: {} };
    Object.keys(statistics.results).forEach(key => {
      if (!key || key.trim() === '') {
        delete statistics.results[key];
      }
    });
    // Сбрасываем текущие счетчики в лимитах, но сохраняем сами лимиты
    Object.keys(sectorLimits).forEach(sector => {
      sectorLimits[sector].current = 0;
    });
    
    document.getElementById('total-spins').textContent = '0';
    document.getElementById('last-result').textContent = '-';
    
    // ДОБАВЛЯМ: Переинициализируем статистику всеми секторами
    initializeStatisticsWithAllSectors();
    
    saveStatistics();
    saveSectorLimits();
    
    notifications.success('Statistics reset successfully!');
    
    // ДОБАВЬ ЭТУ СТРОКУ В САМЫЙ КОНЕЦ:
    updateExhaustedSectorOverlays();
  }
  triggerAutoSave();
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
  triggerAutoSave();
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
  triggerAutoSave();
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
function updatePrizeImageSize(value) {
  const size = parseInt(value);
  prizeImageSettings.size = size;
  
  // Обновляем отображение значения
  document.getElementById('prize-size-value').textContent = size + 'px';
  
  // Применяем стили
  applyPrizeImageStyles();
  
  // Сохраняем настройки
  savePrizeImageSettings();
  triggerAutoSave();
}

function updatePrizeImageOffset() {
  const offsetX = parseInt(document.getElementById('prize-image-offset-x').value);
  const offsetY = parseInt(document.getElementById('prize-image-offset-y').value);
  
  prizeImageSettings.offsetX = offsetX;
  prizeImageSettings.offsetY = offsetY;
  
  // Обновляем отображение значений с более понятными подписями
  let xLabel = offsetX === 0 ? 'Center' : (offsetX > 0 ? `Right ${offsetX}` : `Left ${Math.abs(offsetX)}`);
  let yLabel = offsetY === 0 ? 'Center' : (offsetY > 0 ? `Down ${offsetY}` : `Up ${Math.abs(offsetY)}`);
  
  document.getElementById('prize-offset-x-value').textContent = xLabel;
  document.getElementById('prize-offset-y-value').textContent = yLabel;
  
  // Применяем стили
  applyPrizeImageStyles();
  
  // Сохраняем настройки
  savePrizeImageSettings();
  triggerAutoSave();
}

function applyPrizeImageStyles() {
  const prizeDiv = document.getElementById('prize-background-div');
  if (prizeDiv && prizeDiv.style.backgroundImage) {
    // Обновляем размер
    prizeDiv.style.width = prizeImageSettings.size + 'px';
    prizeDiv.style.height = prizeImageSettings.size + 'px';
    
    // Обновляем позицию background
    const bgPositionX = 50 + (prizeImageSettings.offsetX * 0.5);
    const bgPositionY = 50 + (prizeImageSettings.offsetY * 0.5);
    
    prizeDiv.style.backgroundPosition = `${bgPositionX}% ${bgPositionY}%`;
    
    console.log('🖼️ Обновлены настройки миниатюры:', {
      size: prizeImageSettings.size,
      backgroundPosition: `${bgPositionX}% ${bgPositionY}%`
    });
  }
  triggerAutoSave();
}

function resetPrizeImageSettings() {
  prizeImageSettings = {
    size: 150,
    offsetX: 0,
    offsetY: 0,
    scale: 150,
    showImage: true
  };
  
  // Обновляем все элементы управления
  document.getElementById('show-prize-image').checked = true;
  document.getElementById('prize-image-size').value = 150;
  document.getElementById('prize-image-scale').value = 150;
  document.getElementById('prize-image-offset-x').value = 0;
  document.getElementById('prize-image-offset-y').value = 0;
  
  // Обновляем отображения значений
  document.getElementById('prize-size-value').textContent = '150px';
  document.getElementById('prize-scale-value').textContent = '150%';
  document.getElementById('prize-offset-x-value').textContent = 'Center';
  document.getElementById('prize-offset-y-value').textContent = 'Center';
  
  // Включаем все контролы
  updateShowPrizeImage();
  
  // Применяем стили
  applyPrizeImageStyles();
  
  // Сохраняем настройки
  savePrizeImageSettings();
  
  notifications.success('Prize image settings reset to default!');
  triggerAutoSave();
}

function testPrizeImageSettings() {
  // Показываем тестовое изображение - используем реальную картинку сектора если есть
  let testImage = null;
  
  // Пробуем взять картинку из первого сектора
  if (wheel && wheel.items && wheel.items[0] && wheel.items[0].sectorBackgroundImage) {
    testImage = wheel.items[0].sectorBackgroundImage;
  } else {
    // Используем тестовое SVG изображение
    testImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b2AtY29sb3I9IiMwMGI4OTQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDc0ZDkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmFkKSIvPjx0ZXh0IHg9IjEwMCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNFTlRFUjwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVCBJTUFHRTwvdGV4dD48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxODAiIHI9IjEwIiBmaWxsPSIjZmY2YjZiIi8+PC9zdmc+';
  }
  
  showResult('🎯 Test Prize Position', 0, testImage, true);
}

function savePrizeImageSettings() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('prizeImageSettings', JSON.stringify(prizeImageSettings));
  }
}

function loadPrizeImageSettings() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('prizeImageSettings');
    if (saved) {
      prizeImageSettings = { ...prizeImageSettings, ...JSON.parse(saved) };
      
      // Обновляем элементы управления
      document.getElementById('show-prize-image').checked = prizeImageSettings.showImage;
      document.getElementById('prize-image-size').value = prizeImageSettings.size;
      document.getElementById('prize-image-scale').value = prizeImageSettings.scale || 150;
      document.getElementById('prize-image-offset-x').value = prizeImageSettings.offsetX;
      document.getElementById('prize-image-offset-y').value = prizeImageSettings.offsetY;
      
      // Обновляем отображения значений
      document.getElementById('prize-size-value').textContent = prizeImageSettings.size + 'px';
      document.getElementById('prize-scale-value').textContent = (prizeImageSettings.scale || 150) + '%';
      
      let xLabel = prizeImageSettings.offsetX === 0 ? 'Center' : (prizeImageSettings.offsetX > 0 ? `Right ${prizeImageSettings.offsetX}` : `Left ${Math.abs(prizeImageSettings.offsetX)}`);
      let yLabel = prizeImageSettings.offsetY === 0 ? 'Center' : (prizeImageSettings.offsetY > 0 ? `Down ${prizeImageSettings.offsetY}` : `Up ${Math.abs(prizeImageSettings.offsetY)}`);
      
      document.getElementById('prize-offset-x-value').textContent = xLabel;
      document.getElementById('prize-offset-y-value').textContent = yLabel;
      
      // Применяем состояние чекбокса
      updateShowPrizeImage();
      
      console.log('✅ Настройки миниатюры загружены:', prizeImageSettings);
    }
  }
}
function updatePrizeBackgroundDiv(element, imageUrl) {
  if (!element) return;
  
  // Определяем количество секторов для автокоррекции
  const sectorCount = wheel ? wheel.items.length : 8;
  
  // Автоматическая коррекция для секторных изображений
  let baseX = 50, baseY = 50;
  
  // Определяем оптимальную базовую позицию в зависимости от количества секторов
  if (sectorCount === 4) {
    baseX = 50; baseY = 25; // Сильно выше центра для треугольных секторов
  } else if (sectorCount === 8) {
    baseX = 50; baseY = 30;
  } else if (sectorCount === 10) {
    baseX = 50; baseY = 35;
  } else if (sectorCount === 12) {	  
    baseX = 50; baseY = 38;
  } else if (sectorCount === 14) {
    baseX = 50; baseY = 49; //	
  } else if (sectorCount === 16) {
    baseX = 50; baseY = 40;
  } else if (sectorCount === 20) {
    baseX = 50; baseY = 42;
  } else {
    baseX = 50; baseY = 45;
  }
  
  // Применяем пользовательские смещения поверх автокоррекции
  const bgPositionX = baseX + (prizeImageSettings.offsetX * 0.3);
  const bgPositionY = baseY + (prizeImageSettings.offsetY * 0.3);
  
  // Используем больший масштаб для секторных изображений
  const scale = prizeImageSettings.scale || 150;
  
  element.style.cssText = `
    width: ${prizeImageSettings.size}px;
    height: ${prizeImageSettings.size}px;
    border-radius: 50%;
    margin: 15px auto;
    border: 4px solid white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    background-image: url('${imageUrl}');
    background-size: ${scale}%;
    background-position: ${bgPositionX}% ${bgPositionY}%;
    background-repeat: no-repeat;
    transition: transform 0.3s ease, background-position 0.3s ease;
    display: block;
    cursor: pointer;
  `;
  
  element.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
  element.onmouseout = function() { this.style.transform = 'scale(1)'; };
  
  console.log('✅ Обновлен prize div с автокоррекцией для секторных изображений:', {
    sectorCount,
    size: prizeImageSettings.size,
    basePosition: `${baseX}% ${baseY}%`,
    finalPosition: `${bgPositionX}% ${bgPositionY}%`,
    scale: `${scale}%`
  });
}

function updateShowPrizeImage() {
  const checkbox = document.getElementById('show-prize-image');
  prizeImageSettings.showImage = checkbox.checked;
  
  // Делаем слайдеры активными/неактивными в зависимости от чекбокса
  const imageControls = [
    'prize-image-size',
    'prize-image-scale', 
    'prize-image-offset-x',
    'prize-image-offset-y'
  ];
  
  imageControls.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.disabled = !prizeImageSettings.showImage;
      element.style.opacity = prizeImageSettings.showImage ? '1' : '0.5';
    }
  });
  
  // Если есть открытый popup, обновляем его
  const existingDiv = document.getElementById('prize-background-div');
  if (existingDiv) {
    if (prizeImageSettings.showImage) {
      existingDiv.style.display = 'block';
    } else {
      existingDiv.style.display = 'none';
    }
  }
  
  savePrizeImageSettings();
  
  console.log('🖼️ Обновлено отображение картинки:', prizeImageSettings.showImage);
  triggerAutoSave();
}

// Функция для обновления масштаба (которую мы добавляли ранее)
function updatePrizeImageScale() {
  const scale = parseInt(document.getElementById('prize-image-scale').value);
  prizeImageSettings.scale = scale;
  
  document.getElementById('prize-scale-value').textContent = scale + '%';
  
  // Применяем к существующему div
  const prizeDiv = document.getElementById('prize-background-div');
  if (prizeDiv) {
    prizeDiv.style.backgroundSize = scale + '%';
  }
  
  savePrizeImageSettings();
  triggerAutoSave();
}


// ИСПРАВЬ функцию initializeStatisticsWithAllSectors:
function initializeStatisticsWithAllSectors() {
  console.log('📊 Инициализируем статистику всеми секторами');
  
  let addedCount = 0;
  let updatedCount = 0;
  
  wheel.items.forEach(item => {
    const sectorName = item.label;
    
    // НЕ перезаписываем существующие значения!
    if (statistics.results[sectorName] === undefined) {
      statistics.results[sectorName] = 0;
      console.log(`➕ Добавлен новый сектор: "${sectorName}" = 0`);
      addedCount++;
    } else {
      console.log(`✅ Сектор "${sectorName}" уже существует, значение: ${statistics.results[sectorName]}`);
      updatedCount++;
    }
  });
  
  // Сохраняем только если добавили новые сектора
  if (addedCount > 0) {
    saveStatistics();
    console.log(`✅ Добавлено ${addedCount} новых секторов`);
  }
  
  if (updatedCount > 0) {
    console.log(`✅ Сохранено ${updatedCount} существующих секторов`);
  }
  
  console.log('📊 Финальная статистика:', statistics);
}
function forceCleanAllBorders() {
    console.log('🧹 Принудительная очистка всех ободков...');
    
    // Находим все возможные контейнеры
    const containers = [
        document.getElementById('wheel-container'),
        document.querySelector('.wheel-container'),
        wheel ? wheel.canvas.parentElement : null
    ].filter(Boolean);
    
    containers.forEach(container => {
        const allBorders = container.querySelectorAll(
            '.custom-wheel-border, ' +
            '.animated-wheel-border-container, ' +
            '.animated-wheel-border-gif, ' +
            '.stretched-gif-border, ' +
            '.stretched-border, ' +
            '[class*="border"], ' +
            '[class*="Border"]'
        );
        
        console.log(`🔍 В контейнере найдено ${allBorders.length} элементов ободков`);
        allBorders.forEach((el, i) => {
            console.log(`➜ Удаляем элемент ${i + 1}:`, el.className);
            el.remove();
        });
    });
    
    // Очищаем GIF handler
    if (window.gifHandler) {
        window.gifHandler.removeWheelBorderGIF();
    }
    
    // Очищаем настройки
    customization.wheelBorderImage = null;
    customization.wheelBorderIsGIF = false;
    saveCustomization();
    
    console.log('✅ Принудительная очистка завершена');
}
// Автосохранение подготовленного проекта
function autoSaveCurrentProject() {
  try {
    const projectData = getProjectData();
    projectData.projectMetadata.name = 'Auto-saved Project';
    projectData.projectMetadata.autoSaved = true;
    projectData.projectMetadata.savedAt = new Date().toISOString();
    
    localStorage.setItem('wheel-autosave-project', JSON.stringify(projectData));
    console.log('✅ Проект автоматически сохранен');
    
    // Показываем небольшое уведомление
  } catch (error) {
    console.error('❌ Ошибка автосохранения:', error);
  }
}

// Загрузка автосохраненного проекта при запуске
function loadAutoSavedProject() {
  try {
    const autoSaved = localStorage.getItem('wheel-autosave-project');
    if (autoSaved) {
      const projectData = JSON.parse(autoSaved);
      
      // Проверяем, что это действительно автосохранение
      if (projectData.projectMetadata?.autoSaved) {
        console.log('🔄 Найден автосохраненный проект');
        
        // Загружаем автосохраненный проект без подтверждения
        loadProject(projectData);
        
        // Показываем уведомление о восстановлении
        setTimeout(() => {
          if (typeof notifications !== 'undefined') {
            notifications.success('Auto-saved project restored');
          }
        }, 1000);
      }
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки автосохранения:', error);
  }
  autoResizeBorderAfterProjectLoad();
}

// Запускаем автосохранение при любых изменениях настроек
function triggerAutoSave() {
  // Задержка чтобы не сохранять слишком часто
  clearTimeout(window.autoSaveTimeout);
  window.autoSaveTimeout = setTimeout(autoSaveCurrentProject, 2000);
}

// ЗАМЕНИ функцию resetToDefaultSettings на эту ОКОНЧАТЕЛЬНУЮ версию
function resetToDefaultSettings() {
  console.log('🔄 Запуск полного сброса настроек через существующие функции');
  
  try {
    // Останавливаем автосохранение на время сброса
    stopPeriodicAutoSave();
    
    // 1-6. Все сбросы как раньше
    if (typeof removeBackgroundImage === 'function') {
      removeBackgroundImage();
    }
    
    if (typeof removeWheelBorderImage === 'function') {
      removeWheelBorderImage();
    }
    
    if (typeof removeWinPopupBackground === 'function') {
      removeWinPopupBackground();
    }
    
    if (typeof removeLosePopupBackground === 'function') {
      removeLosePopupBackground();
    }
    
    if (typeof removePopupBackground === 'function') {
      removePopupBackground();
    }
    
    if (typeof clearAllItemColors === 'function') {
      clearAllItemColors();
    }
    
    if (typeof resetStatistics === 'function') {
      resetStatistics();
    }
    
    // 7. Дополнительные сбросы
    resetAdditionalSettings();
    
    // 8. Очистка localStorage
    localStorage.removeItem('wheel-autosave-project');
    localStorage.removeItem('wheel-statistics');
    localStorage.removeItem('wheel-settings');
    
    // 9. Применяем базовый пресет (ИСПРАВЛЕННОЕ НАЗВАНИЕ)
    if (typeof applyPreset === 'function') {
      applyPreset('sectors8');
    }
    
    // 10. Просто ждем чтобы все применилось
    setTimeout(() => {
      startPeriodicAutoSave();
      console.log('✅ Полный сброс настроек завершен');
      
      if (typeof notifications !== 'undefined') {
        notifications.success('All settings reset to default');
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Ошибка при сбросе настроек:', error);
    startPeriodicAutoSave();
    
    if (typeof notifications !== 'undefined') {
      notifications.error('Error resetting settings: ' + error.message);
    }
  }
  triggerAutoSave();
}
function restoreItemInputHandlers() {
  console.log('🔧 Восстанавливаем обработчики событий для input полей');
  
  setTimeout(() => {
    // Восстанавливаем обработчики для текстовых полей названий
    document.querySelectorAll('#items-list input[type="text"]').forEach((input, index) => {
      const itemCard = input.closest('.item-card');
      if (itemCard) {
        const cardIndex = Array.from(itemCard.parentElement.children).indexOf(itemCard);
        
        // Удаляем старые обработчики
        input.removeEventListener('input', input._wheelInputHandler);
        input.removeEventListener('change', input._wheelInputHandler);
        
        // Создаем новый обработчик
        const handler = function(e) {
          if (wheel.items[cardIndex]) {
            wheel.items[cardIndex].label = this.value;
            wheel.refresh();
            triggerAutoSave(); // Автосохранение при изменении
          }
        };
        
        // Сохраняем ссылку на обработчик
        input._wheelInputHandler = handler;
        
        // Добавляем обработчики
        input.addEventListener('input', handler);
        input.addEventListener('change', handler);
        
        // Убираем возможные блокировки
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
      }
    });
    
    // Восстанавливаем обработчики для числовых полей весов
    document.querySelectorAll('#items-list input[type="number"]').forEach((input, index) => {
      const itemCard = input.closest('.item-card');
      if (itemCard) {
        const cardIndex = Array.from(itemCard.parentElement.children).indexOf(itemCard);
        
        // Удаляем старые обработчики
        input.removeEventListener('input', input._wheelNumberHandler);
        input.removeEventListener('change', input._wheelNumberHandler);
        
        // Создаем новый обработчик
        const handler = function(e) {
          if (wheel.items[cardIndex]) {
            const value = parseFloat(this.value) || 1;
            wheel.items[cardIndex].weight = value;
            wheel.refresh();
            triggerAutoSave(); // Автосохранение при изменении
          }
        };
        
        // Сохраняем ссылку на обработчик
        input._wheelNumberHandler = handler;
        
        // Добавляем обработчики
        input.addEventListener('input', handler);
        input.addEventListener('change', handler);
        
        // Убираем возможные блокировки
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
      }
    });
    
    // Восстанавливаем обработчики для цветовых полей
    document.querySelectorAll('#items-list input[type="color"]').forEach((input, index) => {
      const itemCard = input.closest('.item-card');
      if (itemCard) {
        const cardIndex = Array.from(itemCard.parentElement.children).indexOf(itemCard);
        
        // Удаляем старые обработчики
        input.removeEventListener('change', input._wheelColorHandler);
        
        // Создаем новый обработчик
        const handler = function(e) {
          if (wheel.items[cardIndex]) {
            wheel.items[cardIndex].backgroundColor = this.value;
            wheel.refresh();
            triggerAutoSave(); // Автосохранение при изменении
          }
        };
        
        // Сохраняем ссылку на обработчик
        input._wheelColorHandler = handler;
        
        // Добавляем обработчики
        input.addEventListener('change', handler);
        
        // Убираем возможные блокировки
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
      }
    });
    
    console.log('✅ Обработчики событий восстановлены');
    
  }, 100); // Небольшая задержка чтобы DOM успел обновиться
}

// Дополнительные сбросы, которые нет в отдельных функциях
function resetAdditionalSettings() {
  try {
    // Сброс кастомизации
    if (typeof customization !== 'undefined') {
      customization.popupTextColor = '#333333';
      customization.winPopupTextColor = '#ffffff';
      customization.losePopupTextColor = '#ffffff';
      customization.currentTheme = 'default';
      customization.sounds = {};
      customization.soundVolume = 50;
    }
    
    // Сброс кастомизации стрелочки
    if (typeof pointerCustomization !== 'undefined') {
      pointerCustomization.type = 'default';
      pointerCustomization.image = '';
      pointerCustomization.imageIsGIF = false;
      pointerCustomization.size = 100;
    }
    
    // Сброс настроек безопасности
    if (typeof exhibitionSecurity !== 'undefined') {
      exhibitionSecurity.requirePassword = false;
      exhibitionSecurity.password = '';
    }
    
    // Сброс лимитов секторов
    if (typeof sectorLimits !== 'undefined') {
      try {
        Object.keys(sectorLimits).forEach(key => {
          delete sectorLimits[key];
        });
      } catch (e) {
        console.log('Лимиты секторов уже пусты');
      }
    }
    
    // Сброс темы и языка
    if (typeof selectedTheme !== 'undefined') {
      selectedTheme = 'default';
    }
    
    if (typeof currentLanguage !== 'undefined') {
      currentLanguage = 'en';
    }
    
    // Очистка всех GIF анимаций
    if (typeof window.gifHandler !== 'undefined') {
      window.gifHandler.clearAll();
    }
    
    console.log('✅ Дополнительные настройки сброшены');
    
  } catch (error) {
    console.error('❌ Ошибка дополнительного сброса:', error);
  }
}

// Новая функция для безопасного сброса визуальных эффектов
function resetVisualEffects() {
  try {
    // Удаляем фоновое изображение
    document.body.style.backgroundImage = '';
    document.body.style.background = '';
    
    // Очищаем все GIF анимации если есть GIF handler
    if (typeof window.gifHandler !== 'undefined') {
      window.gifHandler.clearAll();
    }
    
    // Удаляем все анимированные элементы фона
    const animatedBgs = document.querySelectorAll('.animated-background-gif');
    animatedBgs.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Удаляем анимированные ободки
    const animatedBorders = document.querySelectorAll('.animated-wheel-border-container');
    animatedBorders.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Удаляем фоны popup'ов
    const popupBgs = document.querySelectorAll('.animated-popup-background-gif');
    popupBgs.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    console.log('✅ Визуальные эффекты очищены');
    
  } catch (error) {
    console.error('❌ Ошибка очистки визуальных эффектов:', error);
  }
}

// Улучшенная функция сброса UI элементов
// ЗАМЕНИ функцию resetUIElementsSafely на эту исправленную версию
function resetUIElementsSafely() {
  try {
    console.log('🔧 Начинаем безопасный сброс UI элементов');
    
    // Сброс полей ввода с проверкой существования
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="color"], textarea');
    inputs.forEach((input, index) => {
      try {
        if (input && input.parentNode && input.tagName) {
          // Проверяем, что элемент не в списке items (их мы не трогаем)
          const isItemInput = input.closest('#items-list');
          if (!isItemInput) {
            if (input.dataset.defaultValue) {
              input.value = input.dataset.defaultValue;
            } else if (input.type === 'color') {
              input.value = input.type === 'color' ? '#ffffff' : '';
            } else {
              input.value = '';
            }
          }
        }
      } catch (e) {
        console.log(`Пропускаем проблемный input ${index}:`, e.message);
      }
    });
    
    // Сброс селектов (кроме тех что в items-list)
    const selects = document.querySelectorAll('select');
    selects.forEach((select, index) => {
      try {
        if (select && select.parentNode && select.tagName) {
          const isItemSelect = select.closest('#items-list');
          if (!isItemSelect) {
            select.selectedIndex = 0;
          }
        }
      } catch (e) {
        console.log(`Пропускаем проблемный select ${index}:`, e.message);
      }
    });
    
    // Сброс чекбоксов
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      try {
        if (checkbox && checkbox.parentNode && checkbox.tagName) {
          checkbox.checked = false;
        }
      } catch (e) {
        console.log(`Пропускаем проблемный checkbox ${index}:`, e.message);
      }
    });
    
    // Сброс слайдеров
    const ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach((range, index) => {
      try {
        if (range && range.parentNode && range.tagName) {
          if (range.dataset.defaultValue) {
            range.value = range.dataset.defaultValue;
          } else {
            range.value = range.min || 0;
          }
        }
      } catch (e) {
        console.log(`Пропускаем проблемный range ${index}:`, e.message);
      }
    });
    
    // Очистка превью изображений
    const previews = document.querySelectorAll('.image-preview, .gif-preview');
    previews.forEach((preview, index) => {
      try {
        if (preview && preview.style) {
          preview.style.display = 'none';
          if (preview.src) preview.src = '';
        }
      } catch (e) {
        console.log(`Пропускаем проблемный preview ${index}:`, e.message);
      }
    });
    
    console.log('✅ UI элементы сброшены безопасно');
    
  } catch (error) {
    console.error('❌ Ошибка сброса UI:', error);
  }
}

// Функция сброса UI элементов
function resetUIElements() {
  try {
    // Сброс полей ввода
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="color"], textarea');
    inputs.forEach(input => {
      if (input.dataset.defaultValue) {
        input.value = input.dataset.defaultValue;
      } else {
        input.value = '';
      }
    });
    
    // Сброс селектов
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      select.selectedIndex = 0;
    });
    
    // Сброс чекбоксов
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Сброс слайдеров
    const ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach(range => {
      if (range.dataset.defaultValue) {
        range.value = range.dataset.defaultValue;
      } else {
        range.value = range.min || 0;
      }
    });
    
    // Очистка превью изображений
    const previews = document.querySelectorAll('.image-preview, .gif-preview');
    previews.forEach(preview => {
      preview.style.display = 'none';
      preview.src = '';
    });
    
    // Удаление фоновых изображений
    document.body.style.backgroundImage = '';
    
    console.log('✅ UI элементы сброшены');
    
  } catch (error) {
    console.error('❌ Ошибка сброса UI:', error);
  }
}

// Функция подтверждения сброса
function confirmResetToDefault() {
  const confirmed = confirm(
    '⚠️ WARNING: This will reset ALL settings to default!\n\n' +
    '• All wheel items will be deleted\n' +
    '• All customizations will be removed\n' +
    '• All statistics will be cleared\n' +
    '• Auto-saved project will be deleted\n\n' +
    'This action cannot be undone!\n\n' +
    'Are you sure you want to continue?'
  );
  
  if (confirmed) {
    resetToDefaultSettings();
  } else {
    console.log('❌ Сброс настроек отменен пользователем');
  }
}

// ЗАМЕНИ autoResizeBorderAfterProjectLoad на эту исправленную версию:
// ЗАМЕНИ autoResizeBorderAfterProjectLoad на эту финальную версию:
function autoResizeBorderAfterProjectLoad() {
  console.log('🔧 Автоматическая проверка и растягивание ободка после загрузки проекта');
  
  setTimeout(() => {
    try {
      if (customization.wheelBorderImage) {
        console.log('🖼️ Найден ободок, применяем растягивание');
        
        const wheelCanvas = document.getElementById('wheel-canvas');
        const wheelContainer = wheelCanvas?.parentElement;
        
        if (!wheelCanvas || !wheelContainer) {
          console.warn('⚠️ wheel-canvas или контейнер не найден');
          return;
        }
        
        if (customization.wheelBorderIsGIF) {
          // Для GIF ободка
          console.log('✅ Пересоздаем растянутый GIF ободок');
          if (typeof createStretchedGIFBorder === 'function') {
            createStretchedGIFBorder(customization.wheelBorderImage, wheelContainer);
            console.log('✅ GIF ободок автоматически растянут через createStretchedGIFBorder');
          } else {
            console.warn('⚠️ Функция createStretchedGIFBorder не найдена');
          }
          
        } else {
          // Для статичного ободка
          console.log('✅ Пересоздаем растянутый статичный ободок');
          if (typeof createStretchedStaticBorder === 'function') {
            createStretchedStaticBorder(customization.wheelBorderImage);
            console.log('✅ Статичный ободок автоматически растянут через createStretchedStaticBorder');
          } else {
            console.warn('⚠️ Функция createStretchedStaticBorder не найдена');
          }
        }
      } else {
        console.log('ℹ️ Ободок не найден в customization');
      }
    } catch (error) {
      console.error('❌ Ошибка при автоматическом растягивании ободка:', error);
    }
  }, 800);
}
function handleInstantStop() {
  console.log('🔥 handleInstantStop() ВЫЗВАНА!');
  console.log('🔍 Проверка условий: instantStopMode =', instantStopMode, ', instantStopEnabled =', instantStopEnabled, ', isContinuousSpinning =', isContinuousSpinning);
  
  if (!instantStopMode || !instantStopEnabled || !isContinuousSpinning) {
    console.log('❌ handleInstantStop: условия не выполнены, выходим');
    return;
  }
  
  const now = Date.now();
  if (now - lastStopTime < 500) {
    console.log('❌ handleInstantStop: слишком быстрый повторный вызов');
    return;
  }
  lastStopTime = now;
  
  instantStopEnabled = false;
  pendingStop = true;
  updateSpinButton();
  
  console.log('⚡ Точная остановка активирована');
  
  // Более точный расчет текущей позиции
  const currentRotation = wheel.rotation % 360;
  const sectorAngle = 360 / wheel.items.length;
  
  // Учитываем что стрелка указывает вверх (на 12 часов)
  const adjustedRotation = (360 - currentRotation) % 360;
  let targetSectorIndex = Math.floor(adjustedRotation / sectorAngle) % wheel.items.length;
  
  console.log('🎯 Текущий угол:', Math.round(currentRotation), 'Целевой сектор:', targetSectorIndex);
  
  // Проверяем лимиты
  const result = findAvailableSector(targetSectorIndex);
  const finalSectorIndex = result.sectorIndex;
  const jumpsCount = result.jumpsCount;
  const sectorChanged = jumpsCount > 0;
  
  if (sectorChanged) {
    console.log(`🔄 Переключаемся с сектора ${targetSectorIndex} на ${finalSectorIndex}, перепрыгнули ${jumpsCount} секторов`);
  }
  
  // Останавливаем текущее вращение
  wheel.stop();
  
  // Точно позиционируем на центр сектора
  const targetAngle = finalSectorIndex * sectorAngle + sectorAngle / 2;
  let finalRotation = 360 - targetAngle;
  
  // ИСПРАВЛЕНИЕ 1: Нормализуем финальную позицию в пределах [0, 360)
  finalRotation = ((finalRotation % 360) + 360) % 360;
  
  // Плавная анимация к финальной позиции
  let startRotation = wheel.rotation % 360;
  if (startRotation < 0) startRotation += 360;
  
  let rotationDiff = finalRotation - startRotation;
  
  // ИСПРАВЛЕНИЕ 2: Улучшенная нормализация - выбираем кратчайший путь БЕЗ лишних оборотов
  if (Math.abs(rotationDiff) > 180) {
    if (rotationDiff > 0) {
      rotationDiff -= 360;
    } else {
      rotationDiff += 360;
    }
  }
  
  // НОВАЯ ЛОГИКА: Динамическая продолжительность в зависимости от количества прыжков
  let duration;
  if (jumpsCount === 0) {
    duration = 200; // Быстрая остановка на том же секторе
  } else {
    // Базовое время + дополнительное время за каждый прыжок
    const baseTime = 600;           // Базовое время для первого прыжка
    const timePerJump = 500;        // Дополнительное время за каждый прыжок
    duration = baseTime + (jumpsCount * timePerJump);
    
    console.log(`⏱️ Прыжков: ${jumpsCount}, время анимации: ${duration}ms (${baseTime} + ${jumpsCount} × ${timePerJump})`);
  }
  
  console.log(`📐 Поворот: ${Math.round(startRotation)}° → ${Math.round(finalRotation)}° (разность: ${Math.round(rotationDiff)}°, время: ${duration}ms)`);
  
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function для плавности (более мягкий для изменения сектора)
    const easeOut = sectorChanged 
      ? 1 - Math.pow(1 - progress, 2) // Более мягкий easing для перехода между секторами
      : 1 - Math.pow(1 - progress, 3); // Обычный easing для остановки на том же секторе
    
    const currentRotation = startRotation + (rotationDiff * easeOut);
    wheel.rotation = currentRotation;
    wheel.refresh();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // ВАЖНО: Устанавливаем точное финальное значение
      wheel.rotation = finalRotation;
      
      // КРИТИЧНО: Останавливаем все внутренние процессы библиотеки
      wheel._lastSpinFrameTime = null;
      wheel._rotationSpeed = 0;
      wheel._spinToTimeEnd = null;
      
      wheel.refresh();
      
      // Принудительно вызываем событие onRest
      console.log('🎯 Анимация завершена, финальный угол:', Math.round(wheel.rotation));
      
      // Устанавливаем флаги как при обычной остановке
      isSpinning = false;
      pendingStop = false;
      
      // Сбрасываем флаги постоянного вращения при остановке
      if (window.isContinuousSpinning) {
        window.isContinuousSpinning = false;
        isContinuousSpinning = false;
      }
      
      updateSpinButton();
      
      const winner = wheel.items[finalSectorIndex];
		let realWinnerName = winner.label;
		if (hideSectorNames && winner._hiddenLabel) {
		  realWinnerName = winner._hiddenLabel;
		  console.log(`📊 Скрытые имена в handleInstantStop: используем "${realWinnerName}" вместо "${winner.label}"`);
		}
		updateStatistics(realWinnerName);
		showResult(realWinnerName, finalSectorIndex, winner.image);


      // Звуки
      if (document.getElementById('enable-sound').checked) {
        if (winner.isWin === false) {
          playLoseSound();
        } else {
          playWinSound();
        }
      }
      
      console.log('🔄 Режим постоянного вращения:', continuousSpinMode, 'Ожидаем закрытия результата');
    }
  }
  
  requestAnimationFrame(animate);
}

function findAvailableSector(startIndex) {
  console.log(`🔍 Ищем доступный сектор начиная с ${startIndex} (против часовой стрелки)`);
  
  // Проверяем все сектора начиная с текущего ПРОТИВ ЧАСОВОЙ СТРЕЛКИ
  for (let i = 0; i < wheel.items.length; i++) {
    // ИСПРАВЛЕНИЕ: поиск против часовой стрелки
    const sectorIndex = (startIndex - i + wheel.items.length) % wheel.items.length;
    const item = wheel.items[sectorIndex];
    
    // Используем hiddenLabel для проверки лимитов
    let sectorName;
    if (hideSectorNames && item._hiddenLabel) {
      sectorName = item._hiddenLabel;
    } else {
      sectorName = item.label || `Sector ${sectorIndex + 1}`;
    }
    
    const limit = sectorLimits[sectorName];
    
    if (!limit) {
      console.log(`✅ Сектор ${sectorIndex} ("${sectorName}") доступен (нет лимита), прыжков: ${i}`);
      return { sectorIndex: sectorIndex, jumpsCount: i };
    }
    
    const currentCount = statistics.results[sectorName] || 0;
    const isAvailable = currentCount < limit.limit;
    
    if (isAvailable) {
      console.log(`✅ Сектор ${sectorIndex} ("${sectorName}") доступен (${currentCount}/${limit.limit}), прыжков: ${i}`);
      return { sectorIndex: sectorIndex, jumpsCount: i };
    } else {
      console.log(`❌ Сектор ${sectorIndex} ("${sectorName}") заблокирован (${currentCount}/${limit.limit})`);
    }
  }
  
  console.log(`⚠️ Все сектора заблокированы, возвращаем исходный ${startIndex}`);
  return { sectorIndex: startIndex, jumpsCount: 0 };
}

function isSectorAvailable(index) {
  const sectorName = wheel.items[index].label;
  if (!sectorLimits[sectorName]) return true;
  
  const currentCount = statistics.results[sectorName] || 0;
  return currentCount < sectorLimits[sectorName].limit;
}



// Обновляем функцию updateSpinButton
function updateSpinButton() {
  const btn = document.getElementById('spin-btn');
  
  if (instantStopMode) {
    if (isContinuousSpinning && instantStopEnabled) {
      btn.textContent = 'STOP - SPACE)';
      btn.disabled = false;
    } else if (isContinuousSpinning && !instantStopEnabled) {
      btn.textContent = 'PREPARE...';
      btn.disabled = true;
    } else if (pendingStop) {
      btn.textContent = 'SLOWDOWN...';
      btn.disabled = true;
    } else {
      btn.textContent = 'START TR';
      btn.disabled = false;
    }
  } else if (continuousSpinMode) {
    if (isContinuousSpinning && !pendingStop) {
      btn.textContent = 'STOP & SPIN';
      btn.disabled = false;
    } else if (pendingStop) {
      btn.textContent = 'STOPPING...';
      btn.disabled = true;
    } else {
      btn.textContent = 'START SPINNING';
      btn.disabled = false;
    }
  } else {
    if (isSpinning) {
      btn.textContent = 'SPINNING...';
      btn.disabled = true;
    } else {
      btn.textContent = 'SPIN WHEEL';
      btn.disabled = false;
    }
  }
}
document.addEventListener('mousedown', function(e) {
  if (e.button === 0 && instantStopMode) { // Левая кнопка мыши
    
    // НЕ обрабатываем клик если:
    // 1. Показан popup результата
    if (resultPopupVisible) {
      console.log('🚫 Игнорируем клик - показан popup результата');
      return;
    }
    
    // 2. Клик по кнопкам, инпутам и другим элементам интерфейса
    const target = e.target;
    if (target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('.sidebar') ||
        target.closest('.controls') ||
        target.closest('.result-popup') ||
        target.closest('.overlay')) {
      console.log('🚫 Игнорируем клик по UI элементу:', target.tagName);
      return;
    }
    
    console.log('✅ Разрешен клик для двойного режима');
    handleDoubleClickLogic(); // Используем новую логику
  }
});

// Обработчик нажатия клавиш (тоже обновляем)
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && instantStopMode) {
    e.preventDefault();
    handleDoubleClickLogic(); // Используем новую логику
  }
});
document.getElementById('instant-stop-mode').addEventListener('change', function(e) {
  instantStopMode = e.target.checked;
  
  if (instantStopMode) {
    // Останавливаем любое текущее вращение
    if (isContinuousSpinning) {
      wheel.stop();
      isContinuousSpinning = false;
    }
    instantStopEnabled = false;
  }
  
  updateSpinButton();
});
function addSectorOverlay(sectorIndex, message = "НЕДОСТУПЕН") {
  // Эта функция будет готова для твоего оверлея
  // Пока просто логируем
  console.log(`Сектор ${sectorIndex} заблокирован: ${message}`);
  
  // Здесь ты добавишь свой оверлей когда будет готов
}

function toggleInstantStopMode() {
  const checkbox = document.getElementById('instant-stop-mode');
  instantStopMode = checkbox.checked;
  
  // Блокировка режима постоянного вращения
  const continuousSpinCheckbox = document.getElementById('continuous-spin-mode');
  const instantAccelerationCheckbox = document.getElementById('instant-stop-acceleration');
  
  console.log(`🎯 Честный режим ${instantStopMode ? 'включен' : 'выключен'}`);
  
  if (instantStopMode) {
    // Блокируем режим постоянного вращения
    continuousSpinCheckbox.disabled = true;
    
    // Выключаем режим постоянного вращения если он был включен
    if (continuousSpinMode) {
      continuousSpinCheckbox.checked = false;
      toggleContinuousSpinMode();
    }
    
    // Разблокируем чекбокс ускорения
    instantAccelerationCheckbox.disabled = false;
  } else {
    // Разблокируем режим постоянного вращения
    continuousSpinCheckbox.disabled = false;
    
    // Блокируем чекбокс ускорения когда честный режим выключен
    instantAccelerationCheckbox.disabled = true;
  }
  
  // НОВОЕ: показываем/скрываем контролы скорости
  toggleSpeedControls();
  
  if (instantStopMode) {
    // Отключаем другие режимы
    if (continuousSpinMode) {
      document.getElementById('continuous-spin-mode').checked = false;
      toggleContinuousSpinMode();
    }
    
    // Сбрасываем состояния ускорения
    accelerationPhase = false;
    isAccelerating = false;
    
    // НОВОЕ: Устанавливаем нужную скорость в зависимости от режима
    const originalSpeed = continuousSpinSpeed;
    if (instantStopAccelerationMode) {
      continuousSpinSpeed = slowSpinSpeed; // для двойного клика
      console.log(`🌀 Запускаем режим 2 клика со скоростью ${slowSpinSpeed}`);
    } else {
      continuousSpinSpeed = singleClickSpeed; // для одинарного клика
      console.log(`🌀 Запускаем режим 1 клик со скоростью ${singleClickSpeed}`);
    }
    
    startContinuousSpin();
    
    // Возвращаем оригинальную скорость
    continuousSpinSpeed = originalSpeed;
    
    // Через секунду включаем возможность остановки
    setTimeout(() => {
      instantStopEnabled = true;
      console.log('✅ Честный режим готов к остановке (ЛКМ/Пробел)');
      updateSpinButton();
    }, 1000);
    
  } else {
    // Останавливаем честный режим
    console.log('⏹️ Останавливаем честный режим');
    if (isContinuousSpinning) {
      wheel.stop();
      isContinuousSpinning = false;
    }
    instantStopEnabled = false;
    pendingStop = false;
    accelerationPhase = false;
    isAccelerating = false;
  }
  
  updateSpinButton();
}

// Функция для перезапуска честного режима после показа результата
function restartInstantModeAfterResult() {
  if (instantStopMode && !isContinuousSpinning) {
    console.log('🔄 Перезапускаем вращение в честном режиме');
    setTimeout(() => {
      startInstantSpin();
      setTimeout(() => {
        instantStopEnabled = true;
        updateSpinButton();
        console.log('✅ Честный режим снова готов к остановке');
      }, 1000);
    }, 500);
  }
}
function toggleInstantStopMode() {
  const checkbox = document.getElementById('instant-stop-mode');
  instantStopMode = checkbox.checked;
  
  console.log(`🎯 Честный режим ${instantStopMode ? 'включен' : 'выключен'}`);
  
  if (instantStopMode) {
    // Отключаем другие режимы
    if (continuousSpinMode) {
      document.getElementById('continuous-spin-mode').checked = false;
      toggleContinuousSpinMode();
    }
    
    // Сбрасываем состояния ускорения
    accelerationPhase = false;
    isAccelerating = false;
    
    console.log('🌀 Запускаем постоянное вращение для честного режима');
    
    // ИСПРАВЛЕНИЕ: правильно устанавливаем continuousSpinSpeed перед вызовом
    const originalSpeed = continuousSpinSpeed;
    if (instantStopAccelerationMode) {
      continuousSpinSpeed = slowSpinSpeed; // 30
      console.log(`⚡ Режим 2 клика: начинаем со скорости ${slowSpinSpeed}`);
    } else {
      continuousSpinSpeed = singleClickSpeed; // 150
      console.log(`⚡ Режим 1 клик: используем скорость ${singleClickSpeed}`);
    }
    
    startContinuousSpin();
    
    // Возвращаем оригинальную скорость
    continuousSpinSpeed = originalSpeed;
    
    setTimeout(() => {
      instantStopEnabled = true;
      console.log('✅ Честный режим готов к остановке (ЛКМ/Пробел)');
      updateSpinButton();
    }, 1000);
    
  } else {
    console.log('ℹ️ Останавливаем честный режим');
    if (isContinuousSpinning) {
      wheel.stop();
      isContinuousSpinning = false;
    }
    instantStopEnabled = false;
    pendingStop = false;
    accelerationPhase = false;
    isAccelerating = false;
  }
  const continuousSpinCheckbox = document.getElementById('continuous-spin-mode');
  continuousSpinCheckbox.disabled = instantStopMode;
  updateSpinButton();
}
function handleDoubleClickLogic() {
  if (!instantStopMode || !isContinuousSpinning) {
    console.log('❌ handleDoubleClickLogic: режим не активен или колесо не вращается');
    return;
  }
  
  const now = Date.now();
  if (now - lastClickTime < 300) {
    console.log('❌ handleDoubleClickLogic: слишком быстрый клик, игнорируем');
    return; // Защита от слишком быстрых кликов
  }
  lastClickTime = now; // ИСПОЛЬЗУЕМ ОТДЕЛЬНУЮ ПЕРЕМЕННУЮ
  
  console.log('🎯 handleDoubleClickLogic: accelerationPhase =', accelerationPhase, ', instantStopEnabled =', instantStopEnabled, ', isAccelerating =', isAccelerating);
  console.log('🔄 Режим ускорения:', instantStopAccelerationMode ? 'двойной клик' : 'одинарный клик');
  
  if (instantStopAccelerationMode) {
    // РЕЖИМ С ДВОЙНЫМ КЛИКОМ (оригинальная логика)
    if (!accelerationPhase) {
      // ПЕРВЫЙ КЛИК: Начинаем ускорение
      console.log('🚀 ПЕРВЫЙ КЛИК: начинаем ускорение');
      startAcceleration();
    } else if (instantStopEnabled && !isAccelerating) {
      // ВТОРОЙ КЛИК: Останавливаем колесо
      console.log('⏹️ ВТОРОЙ КЛИК: останавливаем колесо');
      
      // ВАЖНО: Проверяем что функция существует
      if (typeof handleInstantStop === 'function') {
        console.log('✅ Вызываем handleInstantStop()');
        handleInstantStop();
      } else {
        console.error('❌ Функция handleInstantStop не найдена!');
      }
    } else {
      console.log('⚠️ Клик проигнорирован: ускорение =', isAccelerating, ', остановка доступна =', instantStopEnabled);
    }
  } else {
    // РЕЖИМ С ОДИНАРНЫМ КЛИКОМ (новая логика)
    console.log(`⏹️ ОДИНАРНЫЙ КЛИК: мгновенная остановка (скорость была ${singleClickSpeed})`);
    
    if (typeof handleInstantStop === 'function') {
      console.log('✅ Вызываем handleInstantStop()');
      handleInstantStop();
    } else {
      console.error('❌ Функция handleInstantStop не найдена!');
    }
  }
}
function startAcceleration() {
  if (isAccelerating) {
    console.log('❌ startAcceleration: уже ускоряемся');
    return; // Уже ускоряемся
  }
  
  console.log('🚀 startAcceleration: начинаем ускорение с', slowSpinSpeed, 'до', fastSpinSpeed);
  
  isAccelerating = true;
  accelerationPhase = true;
  instantStopEnabled = false; // Блокируем остановку во время ускорения
  updateSpinButton();
  
  const startSpeed = slowSpinSpeed;
  const targetSpeed = fastSpinSpeed;
  const accelerationDuration = 2000; // 2 секунды
  const startTime = performance.now();
  
  function accelerate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / accelerationDuration, 1);
    
    // Плавное ускорение
    const easeOut = 1 - Math.pow(1 - progress, 2);
    const currentSpeed = startSpeed + (targetSpeed - startSpeed) * easeOut;
    
    // Обновляем скорость колеса
    if (wheel && wheel._rotationSpeed !== undefined) {
      wheel._rotationSpeed = currentSpeed;
      window.continuousSpinSpeed = currentSpeed;
    }
    
    // Логируем только каждые 200ms чтобы не засорять консоль
    if (Math.floor(elapsed / 200) !== Math.floor((elapsed - 16) / 200)) {
      console.log(`🏃 Ускорение: ${Math.round(currentSpeed)} (прогресс: ${Math.round(progress * 100)}%)`);
    }
    
    if (progress < 1) {
      requestAnimationFrame(accelerate);
    } else {
      // Ускорение завершено
      console.log('✅ Ускорение завершено! Готов к остановке');
      console.log('🔍 Финальное состояние: isAccelerating =', false, ', instantStopEnabled =', true);
      
      isAccelerating = false;
      instantStopEnabled = true;
      updateSpinButton();
    }
  }
  
  requestAnimationFrame(accelerate);
}

// Функция для сброса состояния при перезапуске
function resetDoubleClickState() {
  isAccelerating = false;
  accelerationPhase = false;
  instantStopEnabled = false;
  console.log('🔄 Сброс состояния двойного клика');
}
document.getElementById('instant-stop-acceleration').addEventListener('change', function(e) {
  instantStopAccelerationMode = e.target.checked;
    
  console.log('🔄 ИЗМЕНЕНИЕ РЕЖИМА:', instantStopAccelerationMode ? 'ДВОЙНОЙ КЛИК' : 'ОДИНАРНЫЙ КЛИК');
  console.log('🔍 Значение чекбокса:', e.target.checked);
  console.log('🔍 Переменная instantStopAccelerationMode:', instantStopAccelerationMode);
  
  // Сбрасываем состояния при переключении режима
  accelerationPhase = false;
  isAccelerating = false;
  
  console.log(`🔄 Переключен режим: ${instantStopAccelerationMode ? `двойной клик (${slowSpinSpeed}→${fastSpinSpeed})` : `одинарный клик (${singleClickSpeed})`}`);
  
  // Если честный режим активен, перезапускаем с новой скоростью
  if (instantStopMode && isContinuousSpinning) {
    // Останавливаем текущее вращение
    wheel.stop();
    isContinuousSpinning = false;
    
    // Запускаем заново с нужной скоростью
    const originalSpeed = continuousSpinSpeed;
    continuousSpinSpeed = instantStopAccelerationMode ? slowSpinSpeed : singleClickSpeed;
    
    setTimeout(() => {
      startContinuousSpin();
      continuousSpinSpeed = originalSpeed;
    }, 100);
  }
});

function updateSingleClickSpeed() {
  const speedInput = document.getElementById('single-click-speed');
  const speedValue = document.getElementById('single-click-speed-value');
  
  singleClickSpeed = parseInt(speedInput.value);
  speedValue.textContent = singleClickSpeed;
  
  console.log('🎯 Скорость одинарного клика:', singleClickSpeed);
  
  // Если активен режим одинарного клика, обновляем скорость на лету
  if (instantStopMode && !instantStopAccelerationMode && isContinuousSpinning) {
    wheel._rotationSpeed = singleClickSpeed;
  }
  
  triggerAutoSave();
}

function updateDoubleClickMinSpeed() {
  const speedInput = document.getElementById('double-click-min-speed');
  const speedValue = document.getElementById('double-click-min-speed-value');
  
  slowSpinSpeed = parseInt(speedInput.value);
  speedValue.textContent = slowSpinSpeed;
  
  console.log('🐌 Минимальная скорость двойного клика:', slowSpinSpeed);
  
  // Если активен режим двойного клика и колесо медленно крутится, обновляем скорость
  if (instantStopMode && instantStopAccelerationMode && isContinuousSpinning && !accelerationPhase) {
    wheel._rotationSpeed = slowSpinSpeed;
  }
  
  triggerAutoSave();
}

function updateDoubleClickMaxSpeed() {
  const speedInput = document.getElementById('double-click-max-speed');
  const speedValue = document.getElementById('double-click-max-speed-value');
  
  fastSpinSpeed = parseInt(speedInput.value);
  speedValue.textContent = fastSpinSpeed;
  
  console.log('⚡ Максимальная скорость двойного клика:', fastSpinSpeed);
  triggerAutoSave();
}

// Функция для показа/скрытия контролов скорости
function toggleSpeedControls() {
  const speedControls = document.getElementById('instant-stop-speed-controls');
  speedControls.style.display = instantStopMode ? 'block' : 'none';
}
function toggleSectorNames() {
  const checkbox = document.getElementById('hide-sector-names');
  hideSectorNames = checkbox.checked;
  
  console.log(`👁️ Имена секторов ${hideSectorNames ? 'скрыты' : 'показаны'}`);
  
  // Временно меняем label для отрисовки
  wheel.items.forEach((item, index) => {
    if (hideSectorNames) {
      // Скрываем: сохраняем оригинал и ставим пустую строку
      if (!item.hasOwnProperty('_hiddenLabel')) {
        item._hiddenLabel = item.label; // Сохраняем оригинальный label
      }
      item.label = ''; // Убираем отображение
    } else {
      // Показываем: восстанавливаем оригинальный label
      if (item.hasOwnProperty('_hiddenLabel')) {
        item.label = item._hiddenLabel; // Восстанавливаем
        delete item._hiddenLabel; // Удаляем временное поле
      }
    }
  });
  
  // Принудительно перерисовываем колесо
  wheel.refresh();
  
  console.log('🔄 Колесо обновлено, labels:', wheel.items.map(item => item.label));
  
  triggerAutoSave();
}
function loadExhaustedOverlay(file) {
  console.log('📎 Загружаем универсальный оверлей для исчерпанных секторов');
  
  if (!file || file.type !== 'image/png') {
    alert('Пожалуйста, выберите PNG файл');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    exhaustedOverlayImage = e.target.result;
    console.log('✅ Универсальный оверлей загружен');
    saveExhaustedOverlay();
    
    // Обновляем превью
    updateExhaustedOverlayPreview();
    
    // Применяем оверлеи к колесу
    console.log('🔄 Применяем оверлеи к колесу...');
    applyExhaustedOverlaysToWheel();
  };
  reader.readAsDataURL(file);
}

// Функция для удаления оверлея
function removeExhaustedOverlay() {
  console.log('🗑️ Удаляем универсальный оверлей');
  
  exhaustedOverlayImage = null;
  
  // Очищаем оверлеи с колеса
  clearAllOverlayElements();
  
  saveExhaustedOverlay();
  
  // Обновляем UI настроек
  const fileInput = document.getElementById('exhausted-overlay-input');
  if (fileInput) {
    fileInput.value = '';
  }
  
  const preview = document.getElementById('exhausted-overlay-preview');
  if (preview) {
    preview.style.display = 'none';
  }
}

// Функция для сохранения оверлея в localStorage
function saveExhaustedOverlay() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('exhaustedOverlayImage', exhaustedOverlayImage || '');
    console.log('💾 Универсальный оверлей сохранен');
  }
  triggerAutoSave();
}

// Функция для загрузки оверлея из localStorage
function loadExhaustedOverlayfromStorage() {
  if (typeof Storage !== 'undefined') {
    const saved = localStorage.getItem('exhaustedOverlayImage');
    if (saved && saved !== '') {
      exhaustedOverlayImage = saved;
      console.log('✅ Универсальный оверлей загружен из сохранения');
      return true;
    }
  }
  return false;
}

// Функция инициализации системы оверлеев
function initializeExhaustedOverlaySystem() {
  console.log('🚀 Инициализация системы оверлеев исчерпанных секторов');
  
  // Находим контейнер колеса
  wheelContainer = document.getElementById('wheel-container');
  if (!wheelContainer) {
    console.error('❌ Контейнер колеса не найден');
    return;
  }
  
  // Загружаем сохраненный оверлей
  if (loadExhaustedOverlayfromStorage()) {
    updateExhaustedOverlayPreview();
    
    // Применяем оверлеи если колесо уже готово
    if (wheel && wheel.items) {
      applyExhaustedOverlaysToWheel();
    }
  }
  
  // Подписываемся на вращение колеса для обновления позиций
  if (wheel) {
    setupWheelRotationListener();
  }
  
  console.log('✅ Система оверлеев инициализирована');
}

// ГЛАВНАЯ ФУНКЦИЯ: Применяет оверлеи к исчерпанным секторам
function applyExhaustedOverlaysToWheel() {
  console.log('🔍 Применяем оверлеи к исчерпанным секторам');
  
  if (!exhaustedOverlayImage || !wheel || !wheel.items || !wheelContainer) {
    console.log('❌ Нет оверлея, колеса или контейнера для применения');
    return;
  }
  
  // Сначала очищаем все существующие оверлеи
  clearAllOverlayElements();
  
  // Проходим по всем секторам и проверяем их лимиты
  wheel.items.forEach((item, index) => {
    let sectorName;
    
    // Определяем имя сектора (учитываем скрытые названия)
    if (hideSectorNames && item._hiddenLabel) {
      sectorName = item._hiddenLabel;
    } else {
      sectorName = item.label || `Sector ${index + 1}`;
    }
    
    // Проверяем лимит
    const limit = sectorLimits[sectorName];
    if (limit) {
      const currentCount = statistics.results[sectorName] || 0;
      const isExhausted = currentCount >= limit.limit;
      
      console.log(`🎯 Сектор "${sectorName}": ${currentCount}/${limit.limit} ${isExhausted ? '(ИСЧЕРПАН)' : '(доступен)'}`);
      
      if (isExhausted) {
        createOverlayElement(index, sectorName);
      }
    }
  });
  
  // Обновляем позиции всех оверлеев
  updateAllOverlayPositions();
  
  console.log(`✅ Создано ${overlayElements.size} оверлеев`);
}

// Создает DOM элемент оверлея для конкретного сектора
function createOverlayElement(sectorIndex, sectorName) {
  console.log(`🎨 Создаем оверлей для сектора ${sectorIndex}`);
  
  // Создаем div элемент для оверлея
  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'sector-exhausted-overlay';
  overlayDiv.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("${exhaustedOverlayImage}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
    z-index: 1000;
    opacity: 1.0;
    transform-origin: center center;
  `;
  
  // Добавляем в контейнер колеса
  wheelContainer.appendChild(overlayDiv);
  
  // Сохраняем в коллекции
  overlayElements.set(`sector_${sectorIndex}`, {
    element: overlayDiv,
    sectorIndex: sectorIndex,
    sectorName: sectorName
  });
  
  console.log(`✅ Оверлей создан для сектора ${sectorIndex}`);
}

// Обновляет позиции всех оверлеев согласно повороту колеса
function updateAllOverlayPositions() {
  if (!wheel || !wheel.canvas || overlayElements.size === 0) {
    return;
  }
  
  const canvas = wheel.canvas;
  const centerX = canvas.offsetWidth / 2;
  const centerY = canvas.offsetHeight / 2;
  const wheelRotation = wheel.rotation || 0;
  
  overlayElements.forEach((overlayData) => {
    updateSingleOverlayPosition(overlayData, centerX, centerY, wheelRotation);
  });
}

// Обновляет позицию одного оверлея
function updateSingleOverlayPosition(overlayData, centerX, centerY, wheelRotation) {
  const { element, sectorIndex } = overlayData;
  const sectorCount = wheel.items.length;
  const sectorAngle = 360 / sectorCount;
  
  // Вычисляем угол сектора с учетом поворота колеса
  const baseSectorAngle = (sectorIndex * sectorAngle) - 90; 
  const angleCorrection = sectorAngle / 2; // Смещение на половину сектора для центрирования
  const currentAngle = baseSectorAngle + wheelRotation + angleCorrection;
  const angleRad = (currentAngle * Math.PI) / 180;
  
  // ПРОСТЫЕ НАСТРОЙКИ (теперь в процентах от размера колеса):
  const distancePercent = 0.7; // Расстояние от центра в % от радиуса колеса (ИЗМЕНИ ЭТО)
  const sizePercent = 0.25; // Размер оверлея в % от радиуса колеса (ИЗМЕНИ ЭТО)
  
  // Вычисляем фактические размеры на основе размера колеса
  const wheelRadius = Math.min(centerX, centerY);
  const distance = wheelRadius * distancePercent;
  const overlaySize = wheelRadius * sizePercent;
  
  // Вычисляем точную позицию
  const x = centerX + Math.cos(angleRad) * distance;
  const y = centerY + Math.sin(angleRad) * distance;
  
  // Применяем к элементу
  element.style.width = `${overlaySize}px`;
  element.style.height = `${overlaySize}px`;
  element.style.transform = `
    translate(${x - overlaySize/2}px, ${y - overlaySize/2}px)
    rotate(${currentAngle + 90}deg)
  `;
  
  // Отладка для первого элемента
  if (sectorIndex === 0) {
    console.log(`🎯 Сектор 0: центр(${centerX},${centerY}) -> позиция(${x.toFixed(0)},${y.toFixed(0)}) угол ${currentAngle.toFixed(1)}°`);
  }
}

// Настройка слушателя вращения колеса
function setupWheelRotationListener() {
  console.log('🔄 Настраиваем слушатель вращения колеса');
  
  // Сохраняем оригинальную функцию refresh колеса
  if (wheel.refresh && !wheel._originalRefresh) {
    wheel._originalRefresh = wheel.refresh.bind(wheel);
    
    // Переопределяем refresh для обновления позиций оверлеев
    wheel.refresh = function() {
      // Сначала вызываем оригинальную отрисовку
      wheel._originalRefresh();
      
      // Затем обновляем позиции оверлеев
      updateAllOverlayPositions();
    };
    
    console.log('✅ Слушатель вращения настроен');
  }
}

// Очищает все DOM элементы оверлеев (БЕЗОПАСНАЯ ВЕРСИЯ)
function clearAllOverlayElements() {
  console.log(`🧹 Очищаем ${overlayElements.size} оверлеев (безопасно)`);
  
  overlayElements.forEach((overlayData, key) => {
    try {
      const element = overlayData.element;
      
      // БЕЗОПАСНАЯ ПРОВЕРКА перед удалением
      if (element && element.parentNode && element.parentNode.contains(element)) {
        element.parentNode.removeChild(element);
        console.log(`✅ Удален оверлей: ${key}`);
      } else {
        console.log(`⚠️ Оверлей ${key} уже был удален или не в DOM`);
      }
    } catch (error) {
      console.log(`⚠️ Не удалось удалить оверлей ${key}:`, error.message);
    }
  });
  
  overlayElements.clear();
  console.log('✅ Все оверлеи очищены');
}

// Функция для обновления превью оверлея в настройках
function updateExhaustedOverlayPreview() {
  const preview = document.getElementById('exhausted-overlay-preview');
  if (preview && exhaustedOverlayImage) {
    preview.src = exhaustedOverlayImage;
    preview.style.display = 'block';
  } else if (preview) {
    preview.style.display = 'none';
  }
}

// ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ (вызывать при изменениях статистики/лимитов)
function updateExhaustedSectorOverlays() {
  console.log('🔄 Обновляем оверлеи исчерпанных секторов');
  applyExhaustedOverlaysToWheel();
}

// Отладочная функция
function debugExhaustedOverlays() {
  console.log('🔧 === ОТЛАДКА СИСТЕМЫ ОВЕРЛЕЕВ ===');
  console.log('🖼️ exhaustedOverlayImage:', !!exhaustedOverlayImage);
  console.log('🏠 wheelContainer:', !!wheelContainer);
  console.log('🎡 wheel:', !!wheel);
  console.log('📱 Активных оверлеев:', overlayElements.size);
  
  overlayElements.forEach((overlayData, key) => {
    const { element, sectorIndex, sectorName } = overlayData;
    console.log(`   ${key}: сектор ${sectorIndex} "${sectorName}", элемент в DOM: ${!!element.parentNode}`);
    console.log(`      Размер: ${element.style.width} x ${element.style.height}`);
    console.log(`      Transform: ${element.style.transform}`);
  });
  
  if (wheel && wheel.items) {
    let exhaustedCount = 0;
    wheel.items.forEach((item, index) => {
      let sectorName;
      if (hideSectorNames && item._hiddenLabel) {
        sectorName = item._hiddenLabel;
      } else {
        sectorName = item.label || `Sector ${index + 1}`;
      }
      
      const limit = sectorLimits[sectorName];
      if (limit) {
        const currentCount = statistics.results[sectorName] || 0;
        const isExhausted = currentCount >= limit.limit;
        if (isExhausted) exhaustedCount++;
      }
    });
    console.log('🚫 Исчерпанных секторов по лимитам:', exhaustedCount);
  }
  
  console.log('🔧 === КОНЕЦ ОТЛАДКИ ===');
}
function safeRemoveElement(element, description = 'элемент') {
  if (!element) {
    console.log(`⚠️ ${description} не существует`);
    return false;
  }
  
  try {
    if (element.parentNode && element.parentNode.contains(element)) {
      element.parentNode.removeChild(element);
      console.log(`✅ ${description} удален безопасно`);
      return true;
    } else {
      console.log(`⚠️ ${description} уже не в DOM`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Ошибка удаления ${description}:`, error.message);
    return false;
  }
}

// Используй эту функцию везде где удаляешь DOM элементы:
// Например, в removeExhaustedOverlay():
function removeExhaustedOverlay() {
  console.log('🗑️ Удаляем универсальный оверлей');
  
  exhaustedOverlayImage = null;
  exhaustedOverlayImageObject = null;
  
  // Безопасная очистка
  clearAllOverlayElements();
  
  saveExhaustedOverlay();
  
  // Безопасная очистка UI элементов
  const fileInput = document.getElementById('exhausted-overlay-input');
  if (fileInput) {
    fileInput.value = '';
  }
  
  const preview = document.getElementById('exhausted-overlay-preview');
  if (preview) {
    preview.style.display = 'none';
  }
}
// Экспортируем функции
window.debugExhaustedOverlays = debugExhaustedOverlays;
window.updateExhaustedSectorOverlays = updateExhaustedSectorOverlays;
window.applyExhaustedOverlaysToWheel = applyExhaustedOverlaysToWheel;
document.getElementById('hide-sector-names').addEventListener('change', toggleSectorNames);
document.getElementById('single-click-speed').addEventListener('input', updateSingleClickSpeed);
document.getElementById('double-click-min-speed').addEventListener('input', updateDoubleClickMinSpeed);
document.getElementById('double-click-max-speed').addEventListener('input', updateDoubleClickMaxSpeed);
window.toggleSectorNames = toggleSectorNames;

// Экспортируем функции
window.updateSingleClickSpeed = updateSingleClickSpeed;
window.updateDoubleClickMinSpeed = updateDoubleClickMinSpeed;
window.updateDoubleClickMaxSpeed = updateDoubleClickMaxSpeed;
window.toggleSpeedControls = toggleSpeedControls;
// Экспортируем функции
window.handleDoubleClickLogic = handleDoubleClickLogic;
window.startAcceleration = startAcceleration;
window.resetDoubleClickState = resetDoubleClickState;
// Экспортируем функцию
window.toggleInstantStopMode = toggleInstantStopMode;
window.restartInstantModeAfterResult = restartInstantModeAfterResult;
window.handleInstantStop = handleInstantStop;
window.findAvailableSector = findAvailableSector;
window.isSectorAvailable = isSectorAvailable;
// ДОБАВЬ эту новую функцию в app.js:
window.autoResizeBorderAfterProjectLoad=autoResizeBorderAfterProjectLoad;
window.confirmResetToDefault = confirmResetToDefault;
window.resetToDefaultSettings = resetToDefaultSettings;
// Экспортируем для отладки
window.forceCleanAllBorders = forceCleanAllBorders;
// Экспортируем функцию

// Экспортируем функции
window.updateShowPrizeImage = updateShowPrizeImage;
window.updatePrizeImageScale = updatePrizeImageScale;
window.initializeStatisticsWithAllSectors = initializeStatisticsWithAllSectors;


window.updatePrizeImageScale = updatePrizeImageScale;

// Экспортируем функции
window.updatePrizeImageSize = updatePrizeImageSize;
window.updatePrizeImageOffset = updatePrizeImageOffset;
window.resetPrizeImageSettings = resetPrizeImageSettings;
window.testPrizeImageSettings = testPrizeImageSettings;

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
window.loadProject = loadProject;
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
window.toggleContinuousSpinMode = toggleContinuousSpinMode;
window.updateContinuousSpeed = updateContinuousSpeed;
window.startContinuousSpin = startContinuousSpin;
window.stopContinuousSpin = stopContinuousSpin;
window.beginSlowdown = beginSlowdown;
window.continuousSpinMode = () => continuousSpinMode;
window.isContinuousSpinning = () => isContinuousSpinning;
window.pendingStop = () => pendingStop;