const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // Создаем окно браузера
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Колесо Удачи - Настраиваемое приложение',
    show: false
  });

  // Загружаем HTML файл
  mainWindow.loadFile('index.html');

  // Показываем окно когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Открываем DevTools в режиме разработки
  // mainWindow.webContents.openDevTools();

  // Создаем меню
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Fullscreen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        { type: 'separator' },
        {
          label: 'DEV-Tools',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'FAQ',
      submenu: [
        {
          label: 'About appliaction',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About appliaction',
              message: 'Lucky Wheel created special for consola.co.il',
              detail: 'Fully custom - easy to use\n\nBuilt with lib - spin-wheel\nIf you not part of Consola - please close the app :)'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC обработчики для сохранения файлов
ipcMain.handle('save-project-dialog', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'Wheel Projects', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    defaultPath: 'wheel-project.json'
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, cancelled: true };
});

ipcMain.handle('toggle-fullscreen', async (event, enable) => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    if (enable) {
      mainWindow.setFullScreen(true);
      console.log('🖥️ Fullscreen enabled');
    } else {
      mainWindow.setFullScreen(false);
      console.log('🖥️ Fullscreen disabled');
    }
    return mainWindow.isFullScreen();
  }
  return false;
});

ipcMain.handle('export-image-dialog', async (event, dataUrl) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'PNG Images', extensions: ['png'] },
      { name: 'JPEG Images', extensions: ['jpg', 'jpeg'] }
    ],
    defaultPath: 'wheel.png'
  });

  if (!result.canceled) {
    try {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(result.filePath, base64Data, 'base64');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, cancelled: true };
});

ipcMain.handle('toggle-menu', async (event, showMenu) => {
  if (showMenu) {
    // Показываем меню - создаем заново
    createMenu();
  } else {
    // Скрываем меню
    Menu.setApplicationMenu(null);
  }
  return { success: true };
});

// Этот метод будет вызван когда Electron завершит инициализацию
app.whenReady().then(createWindow);

// Выйти когда все окна закрыты
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
