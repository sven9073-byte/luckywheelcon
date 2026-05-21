// GIF Animation Handler - Решение проблемы с анимированными GIF
// Добавьте этот код в utils.js или создайте отдельный файл gif-handler.js

class GIFAnimationHandler {
  constructor() {
    this.gifElements = new Map(); // Кеш GIF элементов
    this.gifOverlays = new Map(); // Контейнеры для наложения GIF
  }

  // Проверяем, является ли файл GIF
  isGIF(file) {
    return file && file.type === 'image/gif';
  }

  // Проверяем, является ли строка GIF по data URL
  isGIFDataURL(dataURL) {
    return dataURL && dataURL.startsWith('data:image/gif');
  }

  // Создаем анимированный GIF элемент для фона
  createBackgroundGIF(dataURL) {
    console.log('🎬 Создаем анимированный фон GIF');
    
    // Удаляем старый GIF если есть
    this.removeBackgroundGIF();
    
    const gifElement = document.createElement('img');
    gifElement.src = dataURL;
    gifElement.className = 'animated-background-gif';
    gifElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: -1;
      pointer-events: none;
    `;
    
    document.body.appendChild(gifElement);
    this.gifElements.set('background', gifElement);
    
    return gifElement;
  }

  // Удаляем фоновый GIF
  removeBackgroundGIF() {
    const existing = this.gifElements.get('background');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
      this.gifElements.delete('background');
    }
  }

  // Создаем анимированный GIF ободок поверх колеса
  createWheelBorderGIF(dataURL, wheelContainer) {
    console.log('🎬 Создаем анимированный ободок GIF');
    
    // Удаляем старый ободок если есть
    this.removeWheelBorderGIF();
    
    const wheelCanvas = wheelContainer.querySelector('canvas');
    if (!wheelCanvas) {
      console.error('❌ Canvas колеса не найден');
      return null;
    }

    const gifContainer = document.createElement('div');
    gifContainer.className = 'animated-wheel-border-container';
    gifContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10;
    `;

    const gifElement = document.createElement('img');
    gifElement.src = dataURL;
    gifElement.className = 'animated-wheel-border-gif';
    
    // Подгоняем размер под canvas
    const canvasRect = wheelCanvas.getBoundingClientRect();
    const size = Math.min(canvasRect.width, canvasRect.height) * 1.1; // Чуть больше колеса
    
    gifElement.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      object-fit: contain;
      display: block;
    `;

    gifContainer.appendChild(gifElement);
    
    // Добавляем в контейнер колеса
    const parentContainer = wheelCanvas.parentElement;
    parentContainer.style.position = 'relative'; // Убеждаемся что parent имеет position
    parentContainer.appendChild(gifContainer);
    
    this.gifElements.set('wheelBorder', gifElement);
    this.gifOverlays.set('wheelBorder', gifContainer);
    
    // Обновляем размеры при изменении размера окна
    const resizeObserver = new ResizeObserver(() => {
      this.updateWheelBorderSize(wheelCanvas, gifElement);
    });
    resizeObserver.observe(wheelCanvas);
    
    return gifElement;
  }

  // Обновляем размер ободка при изменении размеров
  updateWheelBorderSize(wheelCanvas, gifElement) {
    const canvasRect = wheelCanvas.getBoundingClientRect();
    const size = Math.min(canvasRect.width, canvasRect.height) * 1.1;
    gifElement.style.width = `${size}px`;
    gifElement.style.height = `${size}px`;
  }

  // Удаляем ободок GIF
// Удаляем ободок GIF (улучшенная версия)
removeWheelBorderGIF() {
    console.log('🎬 Удаляем GIF ободок...');
    
    // Удаляем из кеша элементов
    const gifElement = this.gifElements.get('wheelBorder');
    const gifOverlay = this.gifOverlays.get('wheelBorder');
    
    if (gifElement && gifElement.parentNode) {
        console.log('➜ Удаляем GIF элемент');
        gifElement.parentNode.removeChild(gifElement);
    }
    
    if (gifOverlay && gifOverlay.parentNode) {
        console.log('➜ Удаляем GIF контейнер');
        gifOverlay.parentNode.removeChild(gifOverlay);
    }
    
    // Очищаем кеш
    this.gifElements.delete('wheelBorder');
    this.gifOverlays.delete('wheelBorder');
    
    // Дополнительно: удаляем все элементы с классами GIF ободков
    const allGifBorders = document.querySelectorAll(
        '.animated-wheel-border-gif, .animated-wheel-border-container, .stretched-gif-border'
    );
    allGifBorders.forEach(el => {
        console.log('➜ Принудительно удаляем:', el.className);
        el.remove();
    });
    
    console.log('✅ GIF ободок полностью удален');
}

  // Создаем анимированный GIF для элемента колеса
  createItemGIF(dataURL, itemIndex, wheelContainer) {
    console.log(`🎬 Создаем анимированный GIF для элемента ${itemIndex}`);
    
    // Удаляем старый GIF элемента если есть
    this.removeItemGIF(itemIndex);
    
    const wheelCanvas = wheelContainer.querySelector('canvas');
    if (!wheelCanvas) {
      console.error('❌ Canvas колеса не найден');
      return null;
    }

    const gifContainer = document.createElement('div');
    gifContainer.className = `animated-item-gif-container item-${itemIndex}`;
    gifContainer.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 5;
      transition: transform 1s ease-out;
    `;

    const gifElement = document.createElement('img');
    gifElement.src = dataURL;
    gifElement.className = `animated-item-gif item-${itemIndex}`;
    gifElement.style.cssText = `
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    gifContainer.appendChild(gifElement);
    
    // Добавляем в контейнер колеса
    const parentContainer = wheelCanvas.parentElement;
    parentContainer.style.position = 'relative';
    parentContainer.appendChild(gifContainer);
    
    this.gifElements.set(`item-${itemIndex}`, gifElement);
    this.gifOverlays.set(`item-${itemIndex}`, gifContainer);
    
    // Обновляем позицию
    this.updateItemGIFPosition(itemIndex, wheelCanvas, gifContainer);
    
    return gifElement;
  }

  // Обновляем позицию GIF элемента в зависимости от поворота колеса
  updateItemGIFPosition(itemIndex, wheelCanvas, gifContainer) {
    // Получаем данные о колесе из глобального объекта wheel
    if (!window.wheel || !window.wheel.items || !window.wheel.items[itemIndex]) {
      return;
    }

    const canvasRect = wheelCanvas.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;
    const radius = Math.min(canvasRect.width, canvasRect.height) / 2 * 0.6;
    
    // Вычисляем угол для элемента
    const totalItems = window.wheel.items.length;
    const anglePerItem = (2 * Math.PI) / totalItems;
    const rotation = (window.wheel.rotation || 0) * Math.PI / 180;
    const itemAngle = itemIndex * anglePerItem + rotation - Math.PI / 2;
    
    // Вычисляем позицию
    const x = centerX + Math.cos(itemAngle) * radius - 30; // 30 = половина размера изображения
    const y = centerY + Math.sin(itemAngle) * radius - 30;
    
    gifContainer.style.left = `${x}px`;
    gifContainer.style.top = `${y}px`;
  }

  // Удаляем GIF элемента
  removeItemGIF(itemIndex) {
    const existing = this.gifOverlays.get(`item-${itemIndex}`);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
      this.gifOverlays.delete(`item-${itemIndex}`);
      this.gifElements.delete(`item-${itemIndex}`);
    }
  }

  // Обновляем позиции всех GIF элементов при вращении колеса
// ЗАМЕНИ updateAllItemGIFPositions В gif_handler.js (убери сектора)
	updateAllItemGIFPositions(wheelCanvas) {
	  this.gifOverlays.forEach((container, key) => {
		if (key.startsWith('item-')) {
		  const itemIndex = parseInt(key.replace('item-', ''));
		  this.updateItemGIFPosition(itemIndex, wheelCanvas, container);
		}
		// Убрали всю логику для sector-bg-
	  });
	}

  // Создаем анимированный фон для popup
  createPopupBackgroundGIF(dataURL, popupElement) {
    console.log('🎬 Создаем анимированный фон popup GIF');
    
    // Удаляем старый GIF если есть
    this.removePopupBackgroundGIF();
    
    const gifElement = document.createElement('img');
    gifElement.src = dataURL;
    gifElement.className = 'animated-popup-background-gif';
    gifElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      border-radius: inherit;
    `;
    
    // Устанавливаем position: relative для popup если еще не установлено
    if (getComputedStyle(popupElement).position === 'static') {
      popupElement.style.position = 'relative';
    }
    
    popupElement.insertBefore(gifElement, popupElement.firstChild);
    this.gifElements.set('popupBackground', gifElement);
    
    return gifElement;
  }

  // Удаляем фон popup GIF
  removePopupBackgroundGIF() {
    const existing = this.gifElements.get('popupBackground');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
      this.gifElements.delete('popupBackground');
    }
  }

  // Очищаем все GIF элементы
  clearAll() {
    console.log('🧹 Очищаем все GIF элементы');
    
    this.gifElements.forEach((element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    this.gifOverlays.forEach((overlay) => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
    
    this.gifElements.clear();
    this.gifOverlays.clear();
  }
 

  // Приостанавливаем/возобновляем все анимации (для оптимизации)
  pauseAll() {
    this.gifElements.forEach((element) => {
      if (element.style) {
        element.style.animationPlayState = 'paused';
      }
    });
  }

  resumeAll() {
    this.gifElements.forEach((element) => {
      if (element.style) {
        element.style.animationPlayState = 'running';
      }
    });
  }
}

// Создаем глобальный экземпляр
const gifHandler = new GIFAnimationHandler();

// Экспортируем в window для использования в других файлах
window.GIFAnimationHandler = GIFAnimationHandler;
window.gifHandler = gifHandler;

console.log('🎬 GIF Animation Handler загружен успешно');