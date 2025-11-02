import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false // 🚫 disable right-click inspect and DevTools entirely
    },
  });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('context-menu', (event) => event.preventDefault());

  // 🚫 Disable keyboard shortcuts like Ctrl+Shift+I, F12, etc.
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (input.key.toLowerCase() === 'i' && input.control && input.shift) || // Ctrl+Shift+I
      (input.key.toLowerCase() === 'j' && input.control && input.shift) || // Ctrl+Shift+J
      input.key === 'F12'
    ) {
      event.preventDefault();
    }
  });
}


// 🧭 Window control listeners

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  switch (action) {
    case 'minimize':
    case 'maximize':
    case 'close':
      // Do nothing here — handled in renderer (script.js)
      break;
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
