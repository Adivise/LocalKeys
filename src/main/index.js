import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { startCapture, updateCaptureSettings } from './utils/inputCapture'; 

const PORT = 28499;
let settingsWindow;

const defaultSettings = {
  position: 'bottom-left', marginX: 100, marginY: 100, marginLinked: true,
  duration: 5, animationSpeed: 1, animation: 'smoothPop', showMouse: true, dragThreshold: 50, filterType: 'off', enableHistory: true, direction: 'row', maxCount: 4,
  fontFamily: 'Inter', fontSize: 48, textCap: 'none', textColor: '#ffffff', modifierTextColor: '#3a86ff', highlightModifier: true, showIcon: true, keyAlignment: 'center', showPressCount: true, variant: 'Short Text',
  borderEnable: true, borderWidth: 2, borderColor: '#3f3f46', borderModifierColor: '#3a86ff', borderRadius: 12, bgEnable: true, bgColor: '#18181b', bgOpacity: 80
};

let currentSettings = { ...defaultSettings };

const getSettingsPath = () => join(app.getPath('userData'), 'settings.json');

function loadSettings() {
  try {
    const path = getSettingsPath();
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, 'utf-8');
      const parsed = JSON.parse(data);
      currentSettings = { ...defaultSettings, ...parsed };
      updateCaptureSettings(currentSettings);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

loadSettings();

const expressApp = express();
const server = http.createServer(expressApp);
const io = new Server(server, { cors: { origin: "*" } });

expressApp.use(express.static(join(__dirname, '../renderer')));

expressApp.use((req, res) => {
  res.sendFile(join(__dirname, '../renderer/index.html'));
});

server.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
  socket.emit('settings-changed', currentSettings);
});

function createWindows() {
  settingsWindow = new BrowserWindow({
    width: 960, height: 900, minWidth: 960, minHeight: 900,
    resizable: true, maximizable: false, autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true
    }
  });
  
  if (process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  startCapture((eventData) => {
    io.emit('input-event', eventData);
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.webContents.send('input-event', eventData);
    }
  });
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-settings', () => {
  return currentSettings;
});

ipcMain.on('update-settings', (event, settings) => {
  currentSettings = settings;
  updateCaptureSettings(settings); 
  io.emit('settings-changed', settings);
  saveSettings(settings);
});