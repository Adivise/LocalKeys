import { contextBridge, ipcRenderer } from 'electron';

const api = {
  updateSettings: (settings) => ipcRenderer.send('update-settings', settings),
  
  onInputEvent: (callback) => {
    ipcRenderer.on('input-event', (_event, value) => callback(value));
    return () => ipcRenderer.removeAllListeners('input-event');
  },
  
  getSettings: () => ipcRenderer.invoke('get-settings')
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api);
  } catch (error) {
    console.error('Failed to expose electronAPI:', error);
  }
} else {
  window.electronAPI = api;
}