// Дополнительные утилиты и эффекты для колеса удачи

// Класс для управления уведомлениями
class NotificationManager {
  constructor() {
    this.container = this.createContainer();
  }
  
  createContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    return container;
  }
  
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.pointerEvents = 'auto';
    notification.textContent = message;
    
    this.container.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Скрываем автоматически
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }
    
    // Скрытие по клику
    notification.addEventListener('click', () => {
      this.hide(notification);
    });
    
    return notification;
  }
  
  hide(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  success(message, duration) { return this.show(message, 'success', duration); }
  error(message, duration) { return this.show(message, 'error', duration); }
  warning(message, duration) { return this.show(message, 'warning', duration); }
  info(message, duration) { return this.show(message, 'info', duration); }
}

// Класс для конфетти эффекта
class ConfettiEffect {
  constructor() {
    this.container = this.createContainer();
  }
  
  createContainer() {
    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      container.className = 'confetti-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1001;
      `;
      document.body.appendChild(container);
    }
    return container;
  }
  
  launch(duration = 3000) {
    const colors = ['#ff6b6b', '#74b9ff', '#00b894', '#fdcb6e', '#e17055', '#a29bfe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
      }, Math.random() * duration);
    }
    
    // Очищаем контейнер после завершения
    setTimeout(() => {
      this.clear();
    }, duration + 1000);
  }
  
  createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${color};
      left: ${Math.random() * 100}%;
      animation: confetti ${Math.random() * 2 + 2}s linear forwards;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    // Добавляем анимацию если ее еще нет
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(confetti);
    
    // Удаляем элемент после анимации
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 4000);
  }
  
  clear() {
    this.container.innerHTML = '';
  }
}

// Класс для звуковых эффектов
// Класс для звуковых эффектов с поддержкой кастомных звуков
class SoundManager {
  constructor() {
    this.sounds = {
      spin: null,    // кастомный звук вращения
      win: null,     // кастомный звук выигрыша
      lose: null     // кастомный звук проигрыша
    };
    this.enabled = true;
    this.volume = 0.5;
  }
  
  // Загрузка кастомного звука
  loadCustomSound(type, file) {
    return new Promise((resolve, reject) => {
      if (!['spin', 'win', 'lose'].includes(type)) {
        reject(new Error('Invalid sound type'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const audio = new Audio(e.target.result);
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        audio.onloadeddata = () => {
          this.sounds[type] = {
            audio: audio,
            dataURL: e.target.result
          };
          console.log(`✅ Кастомный звук ${type} загружен`);
          resolve(e.target.result);
        };
        
        audio.onerror = () => {
          console.error(`❌ Ошибка загрузки звука ${type}`);
          reject(new Error(`Failed to load ${type} sound`));
        };
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Удаление кастомного звука
  removeCustomSound(type) {
    if (this.sounds[type]) {
      this.sounds[type] = null;
      console.log(`🗑️ Кастомный звук ${type} удален`);
    }
  }
  
  // Проверка наличия кастомного звука
  hasCustomSound(type) {
    return this.sounds[type] && this.sounds[type].audio;
  }
  
  // Создание звука из частот (fallback)
  createBeep(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Звук недоступен:', error);
    }
  }
  
  // Воспроизведение звука вращения
playSpinSound() {
  if (!this.enabled) return;
  
  if (this.hasCustomSound('spin')) {
    try {
      const audio = this.sounds.spin.audio.cloneNode();
      audio.volume = this.volume;
      audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
    } catch (error) {
      console.log('Ошибка кастомного звука, используем fallback');
      this.playDefaultSpinSound();
    }
  } else {
    this.playDefaultSpinSound();
  }
}
  // Воспроизведение звука выигрыша
  playWinSound() {
    if (!this.enabled) return;
    
    if (this.hasCustomSound('win')) {
      try {
        const audio = this.sounds.win.audio.cloneNode();
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
      } catch (error) {
        console.log('Ошибка кастомного звука, используем fallback');
        this.playDefaultWinSound();
      }
    } else {
      this.playDefaultWinSound();
    }
  }
  
  // Воспроизведение звука проигрыша
  playLoseSound() {
    if (!this.enabled) return;
    
    if (this.hasCustomSound('lose')) {
      try {
        const audio = this.sounds.lose.audio.cloneNode();
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
      } catch (error) {
        console.log('Ошибка кастомного звука, используем fallback');
        this.playDefaultLoseSound();
      }
    } else {
      this.playDefaultLoseSound();
    }
  }
  
  // Стандартные звуки (fallback)
  playDefaultSpinSound() {
    const frequencies = [200, 300, 400, 500];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.1, 'sawtooth');
      }, i * 100);
    });
  }
  
  playDefaultWinSound() {
    const melody = [523, 659, 784, 1047]; // C, E, G, C
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.3, 'sine');
      }, i * 150);
    });
  }
  
  playDefaultLoseSound() {
    // Печальная мелодия
    const melody = [330, 293, 261, 220]; // E, D, C, A
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.createBeep(freq, 0.4, 'sine');
      }, i * 200);
    });
  }
  
  playClickSound() {
    this.createBeep(800, 0.1, 'square');
  }
  
  // Получение данных для сохранения
  getSoundData() {
    const data = {};
    Object.keys(this.sounds).forEach(type => {
      if (this.sounds[type] && this.sounds[type].dataURL) {
        data[type] = this.sounds[type].dataURL;
      }
    });
    return data;
  }
  
  // Загрузка сохраненных звуков
  loadSoundData(data) {
    Object.keys(data).forEach(type => {
      if (data[type]) {
        const audio = new Audio(data[type]);
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        this.sounds[type] = {
          audio: audio,
          dataURL: data[type]
        };
        
        console.log(`✅ Восстановлен кастомный звук ${type}`);
      }
    });
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Обновляем громкость всех загруженных звуков
    Object.values(this.sounds).forEach(sound => {
      if (sound && sound.audio) {
        sound.audio.volume = this.volume;
      }
    });
  }
}

// Класс для управления анимациями
class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.initializeStyles();
  }
  
  initializeStyles() {
    if (!document.getElementById('animation-styles')) {
      const style = document.createElement('style');
      style.id = 'animation-styles';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(116, 185, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(116, 185, 255, 0.8), 0 0 30px rgba(116, 185, 255, 0.6);
          }
        }
        
        .sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 2s infinite ease-in-out;
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Анимация искр вокруг колеса
  addSparkles(element, count = 20) {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.className = 'sparkles';
    element.appendChild(sparkleContainer);
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createSparkle(sparkleContainer);
      }, Math.random() * 2000);
    }
    
    return sparkleContainer;
  }
  
  createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 2000);
  }
  
  // Анимация пульса для элемента
  addPulse(element, duration = 2000) {
    element.style.animation = `pulse ${duration}ms infinite ease-in-out`;
  }
  
  removePulse(element) {
    element.style.animation = '';
  }
  
  // Анимация свечения
  addGlow(element) {
    element.classList.add('glow-effect');
  }
  
  removeGlow(element) {
    element.classList.remove('glow-effect');
  }
  
  // Тряска элемента
  shake(element, duration = 500) {
    const originalTransform = element.style.transform;
    element.style.animation = `shake ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
      element.style.transform = originalTransform;
    }, duration);
  }
  
  // Плавное появление
  fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }
  
  // Плавное исчезновение
  fadeOut(element, duration = 500) {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
    
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }
}

// Класс для работы с файлами
class FileManager {
  static async readFile(file, type = 'text') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      
      switch (type) {
        case 'text':
          reader.readAsText(file);
          break;
        case 'dataurl':
          reader.readAsDataURL(file);
          break;
        case 'arraybuffer':
          reader.readAsArrayBuffer(file);
          break;
        default:
          reader.readAsText(file);
      }
    });
  }
  
  static downloadFile(data, filename, type = 'application/json') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  static async selectFile(accept = '*', multiple = false) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.multiple = multiple;
      input.onchange = e => resolve(multiple ? e.target.files : e.target.files[0]);
      input.click();
    });
  }
}

// Класс для валидации
class Validator {
  static validateWheelItem(item) {
    const errors = [];
    
    if (!item.label || typeof item.label !== 'string') {
      errors.push('Название должно быть строкой');
    }
    
    if (item.label && item.label.trim().length === 0) {
      errors.push('Название не может быть пустым');
    }
    
    if (item.label && item.label.length > 50) {
      errors.push('Название слишком длинное (максимум 50 символов)');
    }
    
    if (typeof item.weight !== 'number' || item.weight <= 0) {
      errors.push('Вес должен быть положительным числом');
    }
    
    if (item.weight > 1000) {
      errors.push('Вес слишком большой (максимум 1000)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateColor(color) {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    return hexPattern.test(color);
  }
  
  static validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const errors = [];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Поддерживаются только JPG, PNG, GIF и WebP изображения');
    }
    
    if (file.size > maxSize) {
      errors.push('Размер файла не должен превышать 5MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Класс для localStorage с обработкой ошибок
class Storage {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      return false;
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
      return defaultValue;
    }
  }
  
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Ошибка удаления из localStorage:', error);
      return false;
    }
  }
  
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error);
      return false;
    }
  }
}

// Класс для работы с drag and drop
class DragDropManager {
  constructor() {
    this.setupGlobalDragDrop();
  }
  
  setupGlobalDragDrop() {
    // Предотвращаем стандартное поведение для всей страницы
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, this.preventDefaults, false);
    });
    
    // Подсвечиваем зоны при перетаскивании
    ['dragenter', 'dragover'].forEach(eventName => {
      document.addEventListener(eventName, this.highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, this.unhighlight, false);
    });
  }
  
  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  highlight(e) {
    const dropZone = e.target.closest('.customization-section');
    if (dropZone) {
      dropZone.classList.add('dragover');
    }
  }
  
  unhighlight(e) {
    const dropZone = e.target.closest('.customization-section');
    if (dropZone) {
      dropZone.classList.remove('dragover');
    }
  }
  
  setupDropZone(element, callback) {
    element.addEventListener('drop', (e) => {
      this.preventDefaults(e);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && callback) {
        callback(files[0]);
      }
    });
  }
}

// Класс для аналитики использования
class Analytics {
  constructor() {
    this.events = Storage.get('wheelAnalytics', []);
  }
  
  track(event, data = {}) {
    const record = {
      event,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.events.push(record);
    
    // Ограничиваем количество записей
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    Storage.set('wheelAnalytics', this.events);
  }
  
  getStats() {
    const stats = {
      totalEvents: this.events.length,
      uniqueDays: new Set(this.events.map(e => new Date(e.timestamp).toDateString())).size,
      eventTypes: {},
      timeline: []
    };
    
    this.events.forEach(event => {
      stats.eventTypes[event.event] = (stats.eventTypes[event.event] || 0) + 1;
    });
    
    return stats;
  }
  
  export() {
    return {
      events: this.events,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }
}

// Инициализация утилит
const notifications = new NotificationManager();
const confetti = new ConfettiEffect();
const sounds = new SoundManager();
const animations = new AnimationManager();
const dragDrop = new DragDropManager();
const analytics = new Analytics();

// Глобальные функции для использования в приложении
window.showNotification = (message, type, duration) => notifications.show(message, type, duration);
window.showConfetti = (duration) => confetti.launch(duration);
window.playSound = (type) => {
  switch (type) {
    case 'spin': sounds.playSpinSound(); break;
    case 'win': sounds.playWinSound(); break;
    case 'click': sounds.playClickSound(); break;
  }
};

// Улучшенные звуковые эффекты для приложения
function playSpinSound() {
  sounds.playSpinSound();
}

function playWinSound() {
  sounds.playWinSound();
  // Запускаем конфетти при выигрыше
  confetti.launch(3000);
}

// Добавляем drag and drop функциональность после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎛️ Инициализация утилит...');
  
  // Настраиваем drop зоны для кастомизации
  const backgroundSection = document.getElementById('background-section');
  const borderSection = document.getElementById('border-section');
  
  if (backgroundSection) {
    dragDrop.setupDropZone(backgroundSection, (file) => {
      const validation = Validator.validateImageFile(file);
      if (!validation.isValid) {
        notifications.error(validation.errors.join(', '));
        return;
      }
      
      // Используем функцию из app.js если она доступна
      if (typeof loadBackgroundImage === 'function') {
        const fakeInput = { files: [file] };
        loadBackgroundImage(fakeInput);
      }
    });
  }
  
  if (borderSection) {
    dragDrop.setupDropZone(borderSection, (file) => {
      const validation = Validator.validateImageFile(file);
      if (!validation.isValid) {
        notifications.error(validation.errors.join(', '));
        return;
      }
      
      // Используем функцию из app.js если она доступна
      if (typeof loadWheelBorderImage === 'function') {
        const fakeInput = { files: [file] };
        loadWheelBorderImage(fakeInput);
      }
    });
  }
  
  console.log('✅ Утилиты инициализированы успешно');
});

// Экспорт утилит для использования в других файлах
window.WheelUtils = {
  notifications,
  confetti,
  sounds,
  animations,
  dragDrop,
  analytics,
  FileManager,
  Validator,
  Storage
};

// Дополнительные вспомогательные функции
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

window.throttle = function(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Улучшенная обработка ошибок
window.addEventListener('error', function(e) {
  console.error('❌ Глобальная ошибка:', e.error);
  notifications.error('Произошла ошибка: ' + e.message);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('❌ Необработанное отклонение Promise:', e.reason);
  notifications.error('Ошибка загрузки: ' + e.reason);
});

console.log('🎛️ Utils.js загружен успешно');