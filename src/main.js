const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 768,
    minWidth: 1100,
    minHeight: 650,
    backgroundColor: '#0f1116',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const getBackupPath = () => {
  const baseDir = path.dirname(app.getPath('exe'));
  return path.join(baseDir, 'animedoro_backup.json');
};

ipcMain.handle('save-backup', async (event, payload) => {
  const backupPath = getBackupPath();
  await fs.writeFile(backupPath, JSON.stringify(payload, null, 2), 'utf-8');
  return backupPath;
});

ipcMain.handle('export-backup', async (event, payload) => {
  const backupPath = getBackupPath();
  await fs.writeFile(backupPath, JSON.stringify(payload, null, 2), 'utf-8');
  return backupPath;
});

ipcMain.handle('import-backup', async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(focusedWindow, {
    title: 'Importar configurações',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const content = await fs.readFile(result.filePaths[0], 'utf-8');
  return JSON.parse(content);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
