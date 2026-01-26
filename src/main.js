const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const getWindowStatePath = () => path.join(app.getPath('userData'), 'window-state.json');

const readWindowState = async () => {
  try {
    const content = await fs.readFile(getWindowStatePath(), 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return { isMaximized: true };
  }
};

const saveWindowState = async (win) => {
  const state = {
    bounds: win.getBounds(),
    normalBounds: win.getNormalBounds(),
    isMaximized: win.isMaximized()
  };
  await fs.writeFile(getWindowStatePath(), JSON.stringify(state, null, 2), 'utf-8');
};

const createWindow = async () => {
  const savedState = await readWindowState();
  const win = new BrowserWindow({
    width: savedState?.bounds?.width || 1280,
    height: savedState?.bounds?.height || 768,
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

  if (savedState?.isMaximized) {
    if (savedState.normalBounds) {
      win.setBounds(savedState.normalBounds);
    }
    win.maximize();
  } else if (savedState?.bounds) {
    win.setBounds(savedState.bounds);
  } else {
    win.maximize();
  }

  win.on('close', async () => {
    await saveWindowState(win);
  });
};

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const getBackupPath = () => {
  const baseDir = app.isPackaged ? path.dirname(app.getPath('exe')) : process.cwd();
  return path.join(baseDir, 'save.json');
};

ipcMain.handle('save-backup', async (event, payload) => {
  const backupPath = getBackupPath();
  try {
    await fs.writeFile(backupPath, JSON.stringify(payload, null, 2), 'utf-8');
    return backupPath;
  } catch (error) {
    const fallbackPath = path.join(app.getPath('userData'), 'save.json');
    await fs.writeFile(fallbackPath, JSON.stringify(payload, null, 2), 'utf-8');
    return fallbackPath;
  }
});

ipcMain.handle('export-backup', async (event, payload) => {
  const backupPath = getBackupPath();
  try {
    await fs.writeFile(backupPath, JSON.stringify(payload, null, 2), 'utf-8');
    return backupPath;
  } catch (error) {
    const fallbackPath = path.join(app.getPath('userData'), 'save.json');
    await fs.writeFile(fallbackPath, JSON.stringify(payload, null, 2), 'utf-8');
    return fallbackPath;
  }
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
