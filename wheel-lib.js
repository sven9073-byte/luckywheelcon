// Улучшенная версия wheel-lib.js с пресетами и кастомизацией

// Пресеты колеса
const WheelPresets = {
  sectors4: {
    count: 4,
    angleOffset: 45,
    name: "4 Sectors", // было "4 сектора"
    defaultItems: [
      { label: 'Prize 1', weight: 1, backgroundColor: '#ff0000' }, // было 'Приз 1'
      { label: 'Prize 2', weight: 1, backgroundColor: '#00ff00' },
      { label: 'Prize 3', weight: 1, backgroundColor: '#0000ff' },
      { label: 'Prize 4', weight: 1, backgroundColor: '#ffff00' }
    ]
  },
  sectors8: {
    count: 8,
    angleOffset: 22.5,
    name: "8 Sectors", // было "8 секторов"
    defaultItems: [
      { label: 'Prize 1', weight: 1, backgroundColor: '#ff0000' },
      { label: 'Prize 2', weight: 1, backgroundColor: '#ff8000' },
      { label: 'Prize 3', weight: 1, backgroundColor: '#ffff00' },
      { label: 'Prize 4', weight: 1, backgroundColor: '#00ff00' },
      { label: 'Prize 5', weight: 1, backgroundColor: '#00ffff' },
      { label: 'Prize 6', weight: 1, backgroundColor: '#0000ff' },
      { label: 'Prize 7', weight: 1, backgroundColor: '#8000ff' },
      { label: 'Prize 8', weight: 1, backgroundColor: '#ff00ff' }
    ]
  },
  sectors16: {
    count: 16,
    angleOffset: 11.25,
    name: "16 Sectors", // было "16 секторов"
    defaultItems: Array.from({length: 16}, (_, i) => ({
      label: `Prize ${i + 1}`, // было `Приз ${i + 1}`
      weight: 1,
      backgroundColor: `hsl(${(i * 360) / 16}, 70%, 60%)`
    }))
  },
  sectors32: {
    count: 32,
    angleOffset: 5.625,
    name: "32 Sectors", // было "32 сектора"
    defaultItems: Array.from({length: 32}, (_, i) => ({
      label: `Prize ${i + 1}`, // было `Приз ${i + 1}`
      weight: 1,
      backgroundColor: `hsl(${(i * 360) / 32}, 70%, 60%)`
    }))
  }
};

// Утилиты
function getRandomFloat(min = 0, max = 0, round = 14) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(round));
}

function degRad(degrees = 0) {
  return degrees * Math.PI / 180;
}

function isObject(v) {
  return typeof v === 'object' && !Array.isArray(v) && v !== null;
}

function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n);
}

function setProp({val, isValid, errorMessage, defaultValue, action = null}) {
  if (isValid) {
    return (action) ? action() : val;
  } else if (val === undefined) {
    return defaultValue;
  }
  throw new Error(errorMessage);
}

function easeSinOut(n) {
  return Math.sin((n * Math.PI) / 2);
}

function calcWheelRotationForTargetAngle(currentRotation = 0, targetAngle = 0, direction = 1) {
  let angle = ((currentRotation % 360) + targetAngle) % 360;
  angle = Number(angle.toFixed(9));
  angle = ((direction === 1) ? (360 - angle) : 360 + angle) % 360;
  angle *= direction;
  
  return currentRotation + angle;
}

function getResizeObserver(element = {}, callBack = {}) {
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => {
      callBack({redraw: true});
    });
    
    observer.observe(element);
    
    return {
      stop: () => {
        observer.unobserve(element);
        observer.disconnect();
      },
    };
  }
  
  window.addEventListener('resize', callBack);
  
  return {
    stop: () => {
      window.removeEventListener('resize', callBack);
    },
  };
}

// Константы
const arcAdjust = -90;
const baseCanvasSize = 500;

const Defaults = Object.freeze({
  wheel: {
    borderColor: '#000',
    borderWidth: 3,
    itemBackgroundColors: ['#fff'],
    itemLabelColors: ['#000'],
    itemLabelFont: 'Arial',
    itemLabelFontSizeMax: 30,
    items: [],
    rotation: 0,
    rotationResistance: -35,
    rotationSpeedMax: 300,
    onCurrentIndexChange: null,
    onRest: null,
    onSpin: null,
    pointerAngle: 0,
    // Новые настройки кастомизации
    backgroundImage: null,
    wheelBorderImage: null,
    preset: 'sectors4'
  },
  item: {
    backgroundColor: null,
    image: null,
    label: '',
    labelColor: null,
    value: null,
    weight: 1,
  },
});

// Класс Item с поддержкой изображений
class Item {
  constructor(wheel, props = {}) {
    if (!isObject(wheel)) throw new Error('wheel must be an instance of Wheel');
    if (!isObject(props) && props !== null) throw new Error('props must be an Object or null');
    
    this._wheel = wheel;
    
    for (const i of Object.keys(Defaults.item)) {
      this['_' + i] = Defaults.item[i];
    }
    
    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.item);
    }
  }
  
  init(props = {}) {
    this.backgroundColor = props.backgroundColor;
    this.image = props.image;
    this.label = props.label;
    this.labelColor = props.labelColor;
    this.value = props.value;
    this.weight = props.weight;
  }
  
  // Геттеры и сеттеры
  get backgroundColor() { return this._backgroundColor; }
  set backgroundColor(val) {
    if (typeof val === 'string') {
      this._backgroundColor = val;
    } else {
      this._backgroundColor = Defaults.item.backgroundColor;
    }
    this._wheel.refresh();
  }
  
  get image() { return this._image; }
  set image(val) {
    if (val instanceof HTMLImageElement || typeof val === 'string') {
      this._image = val;
    } else {
      this._image = Defaults.item.image;
    }
    this._wheel.refresh();
  }
  
  get label() { return this._label; }
  set label(val) {
    if (typeof val === 'string') {
      this._label = val;
    } else {
      this._label = Defaults.item.label;
    }
    this._wheel.refresh();
  }
  
  get labelColor() { return this._labelColor; }
  set labelColor(val) {
    if (typeof val === 'string') {
      this._labelColor = val;
    } else {
      this._labelColor = Defaults.item.labelColor;
    }
    this._wheel.refresh();
  }
  
  get value() { return this._value; }
  set value(val) {
    if (val !== undefined) {
      this._value = val;
    } else {
      this._value = Defaults.item.value;
    }
  }
  
  get weight() { return this._weight; }
  set weight(val) {
    if (typeof val === 'number') {
      this._weight = val;
    } else {
      this._weight = Defaults.item.weight;
    }
  }
  
  getIndex() {
    const index = this._wheel.items.findIndex(i => i === this);
    if (index === -1) throw new Error('Item not found in parent Wheel');
    return index;
  }
  
  getCenterAngle() {
    const angle = this._wheel.getItemAngles()[this.getIndex()];
    return angle.start + ((angle.end - angle.start) / 2);
  }
  
  getStartAngle() {
    return this._wheel.getItemAngles()[this.getIndex()].start;
  }
  
  getEndAngle() {
    return this._wheel.getItemAngles()[this.getIndex()].end;
  }
  
  getRandomAngle() {
    return getRandomFloat(this.getStartAngle(), this.getEndAngle());
  }
}

// Улучшенный класс Wheel
class Wheel {
  constructor(container, props = {}) {
    if (!(container instanceof Element)) throw new Error('container must be an instance of Element');
    if (!isObject(props) && props !== null) throw new Error('props must be an Object or null');
    
    this._frameRequestId = null;
    this._rotationSpeed = 0;
    this._rotationDirection = 1;
    this._spinToTimeEnd = null;
    this._lastSpinFrameTime = null;
    this._currentPreset = 'sectors4';
    
    // ИСПРАВЛЕНИЕ: Кеш для изображений
    this._imageCache = new Map();
    this._borderImageElement = null;
    
    // Инициализируем значения по умолчанию
    for (const i of Object.keys(Defaults.wheel)) {
      this['_' + i] = Defaults.wheel[i];
    }
    
    this.add(container);
    
    if (props) {
      this.init(props);
    } else {
      this.init(Defaults.wheel);
    }
    
    // Принудительная отрисовка после создания
    setTimeout(() => {
      console.log('🔄 Force refresh after creation');
      this.resize();
      this.refresh();
    }, 50);
  }
  
  init(props = {}) {
    this._isInitialising = true;
    
    // Инициализация всех свойств
    this.borderColor = props.borderColor;
    this.borderWidth = props.borderWidth;
    this.itemBackgroundColors = props.itemBackgroundColors;
    this.itemLabelColors = props.itemLabelColors;
    this.itemLabelFont = props.itemLabelFont;
    this.itemLabelFontSizeMax = props.itemLabelFontSizeMax;
    this.items = props.items;
    this.rotationSpeedMax = props.rotationSpeedMax;
    this.rotation = props.rotation;
    this.rotationResistance = props.rotationResistance;
    this.onCurrentIndexChange = props.onCurrentIndexChange;
    this.onRest = props.onRest;
    this.onSpin = props.onSpin;
    this.pointerAngle = props.pointerAngle;
    // Новые свойства
    this.backgroundImage = props.backgroundImage;
    this.wheelBorderImage = props.wheelBorderImage;
    this.preset = props.preset || 'sectors4';
  }
  
  add(container) {
    this._canvasContainer = container;
    
    // Если передан canvas напрямую - используем его
    if (container.tagName === 'CANVAS') {
      this.canvas = container;
      this._context = this.canvas.getContext('2d');
      
      // Устанавливаем размеры canvas равными контейнеру
      const parent = container.parentElement;
      if (parent) {
        const containerSize = Math.min(parent.clientWidth, parent.clientHeight) || 500;
        this.canvas.width = containerSize;
        this.canvas.height = containerSize;
      }
    } else {
      // Иначе создаем новый canvas
      this.canvas = document.createElement('canvas');
      this.canvas.style.display = 'block';
      this._context = this.canvas.getContext('2d');
      
      // Устанавливаем размеры равными контейнеру
      const containerSize = Math.min(container.clientWidth, container.clientHeight) || 500;
      this.canvas.width = containerSize;
      this.canvas.height = containerSize;
      this.canvas.style.width = containerSize + 'px';
      this.canvas.style.height = containerSize + 'px';
      
      this._canvasContainer.append(this.canvas);
    }
    
    this.registerEvents();
    if (this._isInitialising === false) this.resize();
  }
  
  registerEvents() {
    this._handler_onResize = getResizeObserver(this._canvasContainer, ({redraw = true}) => {
      this.resize();
      if (redraw) this.draw(performance.now());
    });
    
    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        if (!this.isDragging) {
          this.spin();
        }
      });
    }
  }
  
  resize() {
    if (this.canvas === null) return;
    
    // Если canvas уже имеет размеры - используем их
    if (this.canvas.width === 0 || this.canvas.height === 0) {
      // Получаем размеры контейнера
      const containerWidth = this._canvasContainer ? this._canvasContainer.clientWidth : 500;
      const containerHeight = this._canvasContainer ? this._canvasContainer.clientHeight : 500;
      
      this.canvas.width = containerWidth || 500;
      this.canvas.height = containerHeight || 500;
      
      // Устанавливаем CSS размеры
      this.canvas.style.width = this.canvas.width + 'px';
      this.canvas.style.height = this.canvas.height + 'px';
    }
    
    // Вычисляем центр и радиус
    this._center = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
    
    // Увеличиваем радиус до 90% от минимального размера
    this._actualRadius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.9;
    this._itemLabelFontSize = Math.max(16, this._actualRadius / 10); // Пропорциональный размер шрифта
    
    this.refresh();
  }
  
  // ИСПРАВЛЕННЫЙ метод определения текущего индекса с поддержкой пресетов
  refreshCurrentIndex(angles = []) {
    if (this._items.length === 0) {
      this._currentIndex = -1;
      return;
    }
    
    // Получаем настройки текущего пресета
    const preset = WheelPresets[this._preset] || WheelPresets.sectors4;
    
    // Используем ПРАВИЛЬНЫЙ сдвиг из пресета
    let normalizedAngle = ((this._rotation || 0) + preset.angleOffset) % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    
    const segmentAngle = 360 / this._items.length;
    
    // ИСПРАВЛЯЕМ направление для правильного определения
    const currentIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % this._items.length;
    
    console.log('🎯 Определение индекса:', {
      rotation: this._rotation,
      preset: this._preset,
      angleOffset: preset.angleOffset,
      normalizedAngle: normalizedAngle,
      segmentAngle: segmentAngle,
      currentIndex: currentIndex,
      itemsLength: this._items.length
    });
    
    if (this._currentIndex !== currentIndex) {
      this._currentIndex = currentIndex;
      if (!this._isInitialising) {
        this.raiseEvent_onCurrentIndexChange();
      }
    }
  }
  
  // Главный метод отрисовки с поддержкой изображений
  draw(now = 0) {
    this._frameRequestId = null;
    
    if (this._context === null || this.canvas === null) {
      console.error('❌ Canvas or context is null');
      return;
    }
    
    if (!this._items || this._items.length === 0) {
      console.warn('⚠️ No items to draw');
      return;
    }
    
    // Обновляем анимацию
    this.animateRotation(now);
    
    const ctx = this._context;
    
    // Очистка canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Рисуем фон если есть
    this.drawBackground(ctx);
    
    // Убеждаемся что у нас есть центр и радиус
    if (!this._center || !this._actualRadius) {
      this._center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
      this._actualRadius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.8;
    }
    
    const centerX = this._center.x;
    const centerY = this._center.y;
    const radius = this._actualRadius;
    
    // Отрисовка сегментов
    const anglePerSegment = (2 * Math.PI) / this._items.length;
    const rotationRad = (this._rotation || 0) * Math.PI / 180;
    
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      const startAngle = i * anglePerSegment + rotationRad - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSegment + rotationRad - Math.PI / 2;
      
      // Цвет сегмента
      const color = item.backgroundColor || 
                   this._itemBackgroundColors[i % this._itemBackgroundColors.length] ||
                   ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i % 6];
      
      // Рисуем сегмент
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      
      // Граница сегмента
      if (this._borderWidth > 0) {
        ctx.strokeStyle = this._borderColor || '#333';
        ctx.lineWidth = this._borderWidth || 2;
        ctx.stroke();
      }
      
      // Изображение сектора
      if (item.image) {
        this.drawItemImage(ctx, item.image, centerX, centerY, radius * 0.6, startAngle + anglePerSegment / 2);
      }
      
      // Текст
      if (item.label) {
		  const textAngle = startAngle + anglePerSegment / 2;
		  const textRadius = radius * (item.image ? 0.3 : 0.7); // Ближе к центру если есть изображение
		  const textX = centerX + Math.cos(textAngle) * textRadius;
		  const textY = centerY + Math.sin(textAngle) * textRadius;
		  
		  ctx.fillStyle = this._itemLabelColors[0] || '#ffffff';
		  
		  // ИСПРАВЛЕНИЕ: Используем itemLabelFontSizeMax если он установлен
		  const fontSize = this._itemLabelFontSizeMax || this._itemLabelFontSize || 16;
		  ctx.font = `${fontSize}px ${this.itemLabelFont || 'Arial'}`;
		  
		  ctx.textAlign = 'center';
		  ctx.textBaseline = 'middle';
		  
		  // Тень для лучшей читаемости
		  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
		  ctx.shadowBlur = 2;
		  ctx.shadowOffsetX = 1;
		  ctx.shadowOffsetY = 1;
		  
		  ctx.fillText(item.label, textX, textY);
		  
		  // Сбрасываем тень
		  ctx.shadowColor = 'transparent';
		  ctx.shadowBlur = 0;
		  ctx.shadowOffsetX = 0;
		  ctx.shadowOffsetY = 0;
	    }
    }
    
    // Рисуем ободок колеса
    this.drawWheelBorder(ctx, centerX, centerY, radius);
    
    // Центральный круг
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    this._isInitialising = false;
	
	if (this._currentTheme) {
	  this.drawThemeDecorations(ctx, centerX, centerY, radius);
	}	
  }
// Отрисовка декоративных элементов темы
drawThemeDecorations(ctx, centerX, centerY, radius) {
  const theme = this._currentTheme;
  if (!theme) return;
  
  switch(theme.decorativeElements) {
    case 'white_dots':
      this.drawWhiteDots(ctx, centerX, centerY, radius);
      break;
    case 'golden_stars':
      this.drawGoldenStars(ctx, centerX, centerY, radius);
      break;
    case 'glowing_dots':
      this.drawGlowingDots(ctx, centerX, centerY, radius);
      break;
    case 'brass_studs':
      this.drawBrassStuds(ctx, centerX, centerY, radius);
      break;
  }
  
  // Рисуем специальный центр
  this.drawThemedCenter(ctx, centerX, centerY, theme.centerStyle);
}

// Различные декоративные элементы
drawWhiteDots(ctx, centerX, centerY, radius) {
  const dotCount = 24;
  const dotRadius = 4;
  const dotDistance = radius + 15;
  
  ctx.fillStyle = 'white';
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * 2 * Math.PI) / dotCount;
    const x = centerX + Math.cos(angle) * dotDistance;
    const y = centerY + Math.sin(angle) * dotDistance;
    
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

drawGoldenStars(ctx, centerX, centerY, radius) {
  const starCount = 12;
  const starSize = 8;
  const starDistance = radius + 20;
  
  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < starCount; i++) {
    const angle = (i * 2 * Math.PI) / starCount;
    const x = centerX + Math.cos(angle) * starDistance;
    const y = centerY + Math.sin(angle) * starDistance;
    
    this.drawStar(ctx, x, y, starSize, 5);
  }
}

drawGlowingDots(ctx, centerX, centerY, radius) {
  const dotCount = 20;
  const dotRadius = 5;
  const dotDistance = radius + 12;
  
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * 2 * Math.PI) / dotCount;
    const x = centerX + Math.cos(angle) * dotDistance;
    const y = centerY + Math.sin(angle) * dotDistance;
    
    // Создаем эффект свечения
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, dotRadius * 2);
    gradient.addColorStop(0, '#39ff14');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, dotRadius * 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Центральная точка
    ctx.fillStyle = '#39ff14';
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

drawBrassStuds(ctx, centerX, centerY, radius) {
  const studCount = 16;
  const studRadius = 6;
  const studDistance = radius + 18;
  
  for (let i = 0; i < studCount; i++) {
    const angle = (i * 2 * Math.PI) / studCount;
    const x = centerX + Math.cos(angle) * studDistance;
    const y = centerY + Math.sin(angle) * studDistance;
    
    // Создаем градиент для эффекта металла
    const gradient = ctx.createRadialGradient(x - 2, y - 2, 0, x, y, studRadius);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.5, '#b8860b');
    gradient.addColorStop(1, '#8b7355');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, studRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Обводка
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Рисование звезды
drawStar(ctx, cx, cy, size, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const radius = i % 2 === 0 ? size : size / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// Различные стили центра
	drawThemedCenter(ctx, centerX, centerY, centerStyle) {
	  const centerRadius = 20;
	  
	  switch(centerStyle) {
		case 'gold_center':
		  const goldGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
		  goldGradient.addColorStop(0, '#ffd700');
		  goldGradient.addColorStop(0.7, '#b8860b');
		  goldGradient.addColorStop(1, '#8b7355');
		  
		  ctx.fillStyle = goldGradient;
		  ctx.beginPath();
		  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
		  ctx.fill();
		  
		  ctx.strokeStyle = '#654321';
		  ctx.lineWidth = 2;
		  ctx.stroke();
		  break;
		  
		case 'neon_center':
		  // Эффект свечения
		  const neonGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius * 2);
		  neonGradient.addColorStop(0, '#39ff14');
		  neonGradient.addColorStop(0.5, 'rgba(57, 255, 20, 0.5)');
		  neonGradient.addColorStop(1, 'transparent');
		  
		  ctx.fillStyle = neonGradient;
		  ctx.beginPath();
		  ctx.arc(centerX, centerY, centerRadius * 2, 0, 2 * Math.PI);
		  ctx.fill();
		  
		  ctx.fillStyle = '#39ff14';
		  ctx.beginPath();
		  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
		  ctx.fill();
		  break;
		  
		default:
		  // Стандартный центр
		  ctx.fillStyle = '#333';
		  ctx.beginPath();
		  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
		  ctx.fill();
	  }
	}  
  // Отрисовка фона
  drawBackground(ctx) {
    if (this._backgroundImage) {
      // Если это строка (URL), создаем изображение
      if (typeof this._backgroundImage === 'string') {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          this._backgroundImage = img; // Кэшируем
        };
        img.src = this._backgroundImage;
      } else if (this._backgroundImage instanceof HTMLImageElement) {
        ctx.drawImage(this._backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
  
  // НОВЫЙ МЕТОД: Предварительная загрузка изображений
  preloadImages() {
    console.log('🖼️ Предварительная загрузка изображений...');
    
    // Загружаем изображения элементов
    this._items.forEach((item, index) => {
      if (item.image && !this._imageCache.has(item.image)) {
        const img = new Image();
        img.onload = () => {
          console.log(`✅ Изображение элемента ${index} загружено`);
        };
        img.onerror = () => {
          console.error(`❌ Ошибка загрузки изображения элемента ${index}`);
        };
        img.src = item.image;
        this._imageCache.set(item.image, img);
      }
    });
    
    // Загружаем ободок колеса (с поддержкой GIF)
    if (this._wheelBorderImage && !this._borderImageElement) {
      console.log('🖼️ Загружаем ободок колеса...');
      this._borderImageElement = new Image();
      this._borderImageElement.onload = () => {
        console.log('✅ Ободок колеса загружен');
        this.refresh(); // Перерисовываем после загрузки
      };
      this._borderImageElement.onerror = () => {
        console.error('❌ Ошибка загрузки ободка колеса');
      };
      this._borderImageElement.src = this._wheelBorderImage;
    }
  }
  
  // ИСПРАВЛЕННЫЙ метод отрисовки изображения в секторе
  drawItemImage(ctx, imageSrc, centerX, centerY, radius, angle) {
    // Используем кешированное изображение
    const cachedImage = this._imageCache.get(imageSrc);
    
    if (cachedImage && cachedImage.complete) {
      this.drawImageAtAngle(ctx, cachedImage, centerX, centerY, radius, angle);
    } else if (typeof imageSrc === 'string' && !this._imageCache.has(imageSrc)) {
      // Загружаем и кешируем новое изображение
      const img = new Image();
      img.onload = () => {
        this._imageCache.set(imageSrc, img);
        this.refresh(); // Перерисовываем после загрузки
      };
      img.src = imageSrc;
      this._imageCache.set(imageSrc, img);
    }
  }
  
  drawImageAtAngle(ctx, img, centerX, centerY, radius, angle) {
    const imageSize = Math.min(radius * 0.8, 80); // Размер изображения
    const imageX = centerX + Math.cos(angle) * radius - imageSize / 2;
    const imageY = centerY + Math.sin(angle) * radius - imageSize / 2;
    
    ctx.save();
    
    // Создаем круглую маску для изображения
    ctx.beginPath();
    ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, 2 * Math.PI);
    ctx.clip();
    
    ctx.drawImage(img, imageX, imageY, imageSize, imageSize);
    ctx.restore();
  }
  
  // ИСПРАВЛЕННАЯ отрисовка ободка колеса с поддержкой GIF
  drawWheelBorder(ctx, centerX, centerY, radius) {
    if (this._borderImageElement && this._borderImageElement.complete) {
      // Рисуем кешированный ободок (поддерживает анимированные GIF)
      const size = radius * 2.2;
      ctx.drawImage(this._borderImageElement, centerX - size / 2, centerY - size / 2, size, size);
    } else if (this._wheelBorderImage) {
      // Если изображение еще загружается
      console.log('⏳ Ободок еще загружается...');
    } else {
      // Стандартный ободок
      if (this._borderWidth > 0) {
        ctx.beginPath();
        ctx.strokeStyle = this._borderColor || '#333';
        ctx.lineWidth = this._borderWidth || 3;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
  
  // Методы управления пресетами
  applyPreset(presetName) {
    const preset = WheelPresets[presetName];
    if (!preset) {
      console.error('Пресет не найден:', presetName);
      return;
    }
    
    this._preset = presetName;
    this.items = preset.defaultItems;
    this.refreshCurrentIndex();
    this.refresh();
  }
  
  getCurrentPreset() {
    return WheelPresets[this._preset] || WheelPresets.sectors4;
  }
  
  // Остальные методы (анимация, события и т.д.) остаются без изменений
  animateRotation(now = 0) {
    if (this._spinToTimeEnd !== null) {
      if (now >= this._spinToTimeEnd) {
        this.rotation = this._spinToEndRotation;
        this._spinToTimeEnd = null;
        this.raiseEvent_onRest();
        return;
      }
      
      const duration = this._spinToTimeEnd - this._spinToTimeStart;
      let delta = (now - this._spinToTimeStart) / duration;
      delta = (delta < 0) ? 0 : delta;
      const distance = this._spinToEndRotation - this._spinToStartRotation;
      
      this.rotation = this._spinToStartRotation + distance * this._spinToEasingFunction(delta);
      this.refresh();
      return;
    }
    
    if (this._lastSpinFrameTime !== null) {
      const delta = now - this._lastSpinFrameTime;
      
      if (delta > 0) {
        this.rotation += ((delta / 1000) * this._rotationSpeed) % 360;
        this._rotationSpeed = this.getRotationSpeedPlusDrag(delta);
        
        if (this._rotationSpeed === 0) {
          this.raiseEvent_onRest();
          this._lastSpinFrameTime = null;
        } else {
          this._lastSpinFrameTime = now;
        }
      }
      
      this.refresh();
      return;
    }
  }
  
  getRotationSpeedPlusDrag(delta = 0) {
    const newRotationSpeed = this._rotationSpeed + ((this.rotationResistance * (delta / 1000)) * this._rotationDirection);
    
    if ((this._rotationDirection === 1 && newRotationSpeed < 0) || (this._rotationDirection === -1 && newRotationSpeed >= 0)) {
      return 0;
    }
    
    return newRotationSpeed;
  }
  
  spin(rotationSpeed = 250) {
    if (!isNumber(rotationSpeed)) rotationSpeed = 250;
    this.beginSpin(rotationSpeed, 'spin');
  }
  
  spinToItem(itemIndex = 0, duration = 4000, spinToCenter = true, numberOfRevolutions = 3, direction = 1, easingFunction = null) {
    this.stop();
    
    const itemAngle = spinToCenter ? this.items[itemIndex].getCenterAngle() : this.items[itemIndex].getRandomAngle();
    let newRotation = calcWheelRotationForTargetAngle(this.rotation, itemAngle - this._pointerAngle, direction);
    newRotation += ((numberOfRevolutions * 360) * direction);
    
    this.animate(newRotation, duration, easingFunction);
    this.raiseEvent_onSpin({method: 'spintoitem', targetItemIndex: itemIndex, targetRotation: newRotation, duration});
  }
  
  animate(newRotation, duration, easingFunction) {
    this._spinToStartRotation = this.rotation;
    this._spinToEndRotation = newRotation;
    this._spinToTimeStart = performance.now();
    this._spinToTimeEnd = this._spinToTimeStart + duration;
    this._spinToEasingFunction = easingFunction || easeSinOut;
    this.refresh();
  }
  
  stop() {
    this._spinToTimeEnd = null;
    this._rotationSpeed = 0;
    this._lastSpinFrameTime = null;
  }
  
  beginSpin(speed = 0, spinMethod = '') {
    this.stop();
    
    this._rotationSpeed = this.limitSpeed(speed, this._rotationSpeedMax);
    this._lastSpinFrameTime = performance.now();
    this._rotationDirection = (this._rotationSpeed >= 0) ? 1 : -1;
    
    if (this._rotationSpeed !== 0) {
      this.raiseEvent_onSpin({
        method: spinMethod,
        rotationSpeed: this._rotationSpeed,
        rotationResistance: this._rotationResistance,
      });
    }
    
    this.refresh();
  }
  
  limitSpeed(speed = 0, max = 0) {
    const newSpeed = Math.min(speed, max);
    return Math.max(newSpeed, -max);
  }
  
  getCurrentIndex() {
    return this._currentIndex || 0;
  }
  
  getItemAngles(initialRotation = 0) {
    const angles = [];
    const anglePerSegment = 360 / this._items.length;
    
    for (let i = 0; i < this._items.length; i++) {
      angles.push({
        start: initialRotation + i * anglePerSegment,
        end: initialRotation + (i + 1) * anglePerSegment,
      });
    }
    
    return angles;
  }
  
  refresh() {
    if (this._frameRequestId === null) {
      this._frameRequestId = window.requestAnimationFrame(t => this.draw(t));
    }
  }
  
  // Геттеры и сеттеры
  get items() { return this._items; }
  set items(val) {
    this._items = setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.items must be an array of Items',
      defaultValue: Defaults.wheel.items,
      action: () => {
        const v = [];
        for (const item of val) {
          v.push(new Item(this, item));
        }
        return v;
      },
    });
    
    // ИСПРАВЛЕНИЕ: Предварительно загружаем изображения
    this.preloadImages();
    
    this.refreshCurrentIndex(this.getItemAngles(this._rotation));
    this.resize();
  }
  // В wheel-lib.js добавьте этот getter/setter в секцию с остальными геттерами/сеттерами:

	get itemLabelFontSizeMax() { 
	  return this._itemLabelFontSizeMax; 
	}

	set itemLabelFontSizeMax(val) {
	  this._itemLabelFontSizeMax = setProp({
		val,
		isValid: isNumber(val) && val > 0,
		errorMessage: 'Wheel.itemLabelFontSizeMax must be a number > 0',
		defaultValue: Defaults.wheel.itemLabelFontSizeMax,
	  });
	  
	  console.log('🔤 itemLabelFontSizeMax установлен:', this._itemLabelFontSizeMax);
	  this.refresh();
	}

	get itemLabelFont() { 
	  return this._itemLabelFont; 
	}

	set itemLabelFont(val) {
	  this._itemLabelFont = setProp({
		val,
		isValid: typeof val === 'string',
		errorMessage: 'Wheel.itemLabelFont must be a string',
		defaultValue: Defaults.wheel.itemLabelFont,
	  });
	  this.refresh();
	}
  get rotation() { return this._rotation || 0; }
  set rotation(val) {
    this._rotation = setProp({
      val,
      isValid: isNumber(val),
      errorMessage: 'Wheel.rotation must be a number',
      defaultValue: 0,
    });
    
    this.refreshCurrentIndex(this.getItemAngles(this._rotation));
    this.refresh();
  }
  
  get preset() { return this._preset; }
  set preset(val) {
    if (WheelPresets[val]) {
      this._preset = val;
      this.refresh();
    }
  }
  
  get backgroundImage() { return this._backgroundImage; }
  set backgroundImage(val) {
    this._backgroundImage = val;
    this.refresh();
  }
  
  get wheelBorderImage() { return this._wheelBorderImage; }
  set wheelBorderImage(val) {
    this._wheelBorderImage = val;
    
    // ИСПРАВЛЕНИЕ: Сбрасываем кеш ободка и загружаем новый
    this._borderImageElement = null;
    
    if (val) {
      console.log('🖼️ Устанавливаем новый ободок:', val.substring(0, 50) + '...');
      this._borderImageElement = new Image();
      this._borderImageElement.onload = () => {
        console.log('✅ Новый ободок загружен');
        this.refresh();
      };
      this._borderImageElement.onerror = () => {
        console.error('❌ Ошибка загрузки нового ободка');
      };
      this._borderImageElement.src = val;
    }
    
    this.refresh();
  }
  
  // Остальные геттеры/сеттеры
  get itemBackgroundColors() { return this._itemBackgroundColors; }
  set itemBackgroundColors(val) {
    this._itemBackgroundColors = setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.itemBackgroundColors must be an array',
      defaultValue: Defaults.wheel.itemBackgroundColors,
    });
    this.refresh();
  }
  
  get borderWidth() { return this._borderWidth; }
  set borderWidth(val) {
    this._borderWidth = setProp({
      val,
      isValid: isNumber(val),
      errorMessage: 'Wheel.borderWidth must be a number',
      defaultValue: Defaults.wheel.borderWidth,
    });
    this.refresh();
  }
  
  get borderColor() { return this._borderColor; }
  set borderColor(val) {
    this._borderColor = setProp({
      val,
      isValid: typeof val === 'string',
      errorMessage: 'Wheel.borderColor must be a string',
      defaultValue: Defaults.wheel.borderColor,
    });
    this.refresh();
  }
  
  get itemLabelColors() { return this._itemLabelColors; }
  set itemLabelColors(val) {
    this._itemLabelColors = setProp({
      val,
      isValid: Array.isArray(val),
      errorMessage: 'Wheel.itemLabelColors must be an array',
      defaultValue: Defaults.wheel.itemLabelColors,
    });
    this.refresh();
  }
  
  get rotationSpeedMax() { return this._rotationSpeedMax || 300; }
  set rotationSpeedMax(val) {
    this._rotationSpeedMax = setProp({
      val,
      isValid: isNumber(val) && val >= 0,
      errorMessage: 'Wheel.rotationSpeedMax must be a number >= 0',
      defaultValue: 300,
    });
  }
  
  get rotationResistance() { return this._rotationResistance || -35; }
  set rotationResistance(val) {
    this._rotationResistance = setProp({
      val,
      isValid: isNumber(val),
      errorMessage: 'Wheel.rotationResistance must be a number',
      defaultValue: -35,
    });
  }
  
  // События
  raiseEvent_onCurrentIndexChange(data = {}) {
    if (this.onCurrentIndexChange && typeof this.onCurrentIndexChange === 'function') {
      this.onCurrentIndexChange({
        type: 'currentIndexChange',
        currentIndex: this._currentIndex,
        ...data,
      });
    }
  }
  
  raiseEvent_onRest(data = {}) {
    console.log('🎯 Wheel stopped at index:', this._currentIndex);
    if (this.onRest && typeof this.onRest === 'function') {
      this.onRest({
        type: 'rest',
        currentIndex: this._currentIndex,
        rotation: this._rotation,
        ...data,
      });
    }
  }
  
  raiseEvent_onSpin(data = {}) {
    console.log('🌀 Wheel spin event:', data);
    if (this.onSpin && typeof this.onSpin === 'function') {
      this.onSpin({
        type: 'spin',
        ...data,
      });
    }
  }
	  // В класс Wheel добавь этот метод
	applyDesignTheme(themeName) {
	  const theme = wheelDesignThemes[themeName];
	  if (!theme) {
		console.error('Тема не найдена:', themeName);
		return;
	  }
	  
	  console.log('🎨 Применяем тему дизайна:', theme.name);
	  
	  // Применяем цвета
	  this.itemBackgroundColors = theme.colors;
	  this.borderWidth = theme.borderWidth;
	  this.borderColor = theme.borderColor;
	  
	  // Применяем декоративные элементы
	  this._currentTheme = theme;
	  
	  // Обновляем отображение
	  this.refresh();
	}

	// Геттер для текущей темы
	get currentTheme() {
	  return this._currentTheme || null;
	}
}

// Экспорт
window.Wheel = Wheel;
window.Item = Item;
window.WheelPresets = WheelPresets;