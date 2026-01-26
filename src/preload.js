const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('animedoroApi', {
  saveBackup: (payload) => ipcRenderer.invoke('save-backup', payload),
  exportBackup: (payload) => ipcRenderer.invoke('export-backup', payload),
  importBackup: () => ipcRenderer.invoke('import-backup')
});
