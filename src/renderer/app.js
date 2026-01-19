const DEFAULT_TABS = [
  { id: 'study', label: 'Estudo', type: 'study', icon: '📘' },
  { id: 'anime', label: 'Anime', type: 'anime', icon: '🎬' }
];

const STORAGE_KEYS = {
  tabs: 'animedoro.tabs',
  timers: 'animedoro.timers',
  history: 'animedoro.history',
  stats: 'animedoro.stats',
  theme: 'animedoro.theme',
  wallpaper: 'animedoro.wallpaper',
  sound: 'animedoro.sound',
  opacity: 'animedoro.opacity',
  radius: 'animedoro.radius',
  palette: 'animedoro.palette',
  character: 'animedoro.character',
  autoSave: 'animedoro.autoSave',
  themeId: 'animedoro.themeId'
};

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const FALLBACK_ICONS = ['📗', '📙', '📝', '🎯', '⭐', '🧠', '🎧', '📖'];
const PALETTES = [
  { id: 'forest', accent: '#7a6a62', accentStrong: '#5d514c', primary: '#5aa861' },
  { id: 'sky', accent: '#6f8fb3', accentStrong: '#54779e', primary: '#5a9bd6' },
  { id: 'sunset', accent: '#c07a61', accentStrong: '#a85f47', primary: '#d9905a' },
  { id: 'sakura', accent: '#b57a9d', accentStrong: '#9b5b83', primary: '#d17fa7' },
  { id: 'matcha', accent: '#6f8a67', accentStrong: '#587053', primary: '#7fb27f' }
];
const THEMES = [
  {
    id: 'non-non-biyori',
    label: 'Non Non Biyori',
    font: "'Segoe UI', 'Verdana', sans-serif",
    heading: "'Segoe UI Semibold', 'Trebuchet MS', sans-serif",
    borderStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 18px 35px rgba(78, 92, 120, 0.25)',
    light: {
      panel: '228, 233, 240',
      border: 'rgba(180, 190, 205, 0.7)',
      accent: '#7c8ea3',
      accentStrong: '#5f7188',
      primary: '#79a6a6',
      muted: '#728096',
      overlay: 'rgba(208, 214, 224, 0.85)',
      texture: 'linear-gradient(140deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0))'
    },
    dark: {
      panel: '18, 22, 35',
      border: 'rgba(54, 64, 90, 0.5)',
      accent: '#8fa3bd',
      accentStrong: '#6d84a1',
      primary: '#6fa3a8',
      muted: '#9ca3b7',
      overlay: 'rgba(14, 18, 28, 0.9)',
      texture: 'linear-gradient(140deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))'
    }
  },
  {
    id: 'another',
    label: 'Another',
    font: "'Georgia', 'Times New Roman', serif",
    heading: "'Georgia', 'Times New Roman', serif",
    borderStyle: 'solid',
    borderWidth: '2px',
    shadow: '0 16px 40px rgba(60, 30, 45, 0.35)',
    light: {
      panel: '235, 230, 232',
      border: 'rgba(180, 160, 170, 0.7)',
      accent: '#8a4f5c',
      accentStrong: '#6a2f3c',
      primary: '#b06b7a',
      muted: '#7c6c72',
      overlay: 'rgba(220, 210, 215, 0.85)',
      texture:
        'repeating-linear-gradient(135deg, rgba(150, 120, 135, 0.2) 0 8px, rgba(255, 255, 255, 0) 8px 16px)'
    },
    dark: {
      panel: '18, 15, 20',
      border: 'rgba(90, 70, 80, 0.6)',
      accent: '#b45f6d',
      accentStrong: '#8f3a4a',
      primary: '#c36a7a',
      muted: '#b8a5ad',
      overlay: 'rgba(10, 8, 12, 0.92)',
      texture:
        'repeating-linear-gradient(135deg, rgba(120, 80, 95, 0.25) 0 10px, rgba(255, 255, 255, 0) 10px 20px)'
    }
  },
  {
    id: 'evangelion',
    label: 'Evangelion',
    font: "'Bahnschrift', 'Arial Narrow', sans-serif",
    heading: "'Impact', 'Bahnschrift', sans-serif",
    borderStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 16px 40px rgba(20, 40, 20, 0.35)',
    light: {
      panel: '230, 236, 226',
      border: 'rgba(150, 170, 150, 0.7)',
      accent: '#5f7a46',
      accentStrong: '#405b30',
      primary: '#6d8f46',
      muted: '#6b7762',
      overlay: 'rgba(208, 220, 206, 0.85)',
      texture: 'linear-gradient(135deg, rgba(140, 210, 120, 0.2), rgba(255, 255, 255, 0))'
    },
    dark: {
      panel: '18, 24, 16',
      border: 'rgba(70, 95, 60, 0.6)',
      accent: '#7aa043',
      accentStrong: '#58792f',
      primary: '#89b04b',
      muted: '#a7b6a0',
      overlay: 'rgba(10, 14, 8, 0.92)',
      texture: 'linear-gradient(135deg, rgba(120, 200, 80, 0.18), rgba(255, 255, 255, 0))'
    }
  },
  {
    id: 'berserk',
    label: 'Berserk',
    font: "'Palatino Linotype', 'Georgia', serif",
    heading: "'Palatino Linotype', 'Georgia', serif",
    borderStyle: 'double',
    borderWidth: '3px',
    shadow: '0 18px 45px rgba(50, 30, 20, 0.45)',
    light: {
      panel: '235, 230, 220',
      border: 'rgba(160, 140, 120, 0.7)',
      accent: '#7a5a3a',
      accentStrong: '#5a3f28',
      primary: '#8a5f3a',
      muted: '#7a6a5a',
      overlay: 'rgba(218, 210, 198, 0.85)',
      texture: 'linear-gradient(145deg, rgba(150, 110, 80, 0.18), rgba(255, 255, 255, 0))'
    },
    dark: {
      panel: '20, 16, 14',
      border: 'rgba(80, 60, 50, 0.6)',
      accent: '#a6734a',
      accentStrong: '#7a4e2f',
      primary: '#b07a4d',
      muted: '#b2a293',
      overlay: 'rgba(10, 8, 6, 0.92)',
      texture: 'linear-gradient(145deg, rgba(120, 80, 50, 0.2), rgba(255, 255, 255, 0))'
    }
  },
  {
    id: 'frieren',
    label: 'Frieren',
    font: "'Cambria', 'Georgia', serif",
    heading: "'Garamond', 'Cambria', serif",
    borderStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 18px 40px rgba(50, 70, 90, 0.25)',
    light: {
      panel: '230, 236, 240',
      border: 'rgba(170, 190, 200, 0.7)',
      accent: '#6f8fa0',
      accentStrong: '#4f6f80',
      primary: '#7ba0b2',
      muted: '#728896',
      overlay: 'rgba(210, 220, 230, 0.85)',
      texture: 'linear-gradient(160deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0))'
    },
    dark: {
      panel: '16, 22, 28',
      border: 'rgba(70, 90, 100, 0.6)',
      accent: '#86a7b8',
      accentStrong: '#5e7f90',
      primary: '#8fb2c2',
      muted: '#a9b6c0',
      overlay: 'rgba(8, 12, 16, 0.92)',
      texture: 'linear-gradient(160deg, rgba(120, 160, 190, 0.12), rgba(255, 255, 255, 0))'
    }
  },
  {
    id: 'naruto',
    label: 'Naruto',
    font: "'Segoe UI', 'Trebuchet MS', sans-serif",
    heading: "'Impact', 'Segoe UI', sans-serif",
    borderStyle: 'solid',
    borderWidth: '2px',
    shadow: '0 16px 40px rgba(120, 70, 20, 0.3)',
    light: {
      panel: '242, 234, 220',
      border: 'rgba(200, 170, 130, 0.7)',
      accent: '#d18a36',
      accentStrong: '#b56a1e',
      primary: '#e39a3b',
      muted: '#8b7760',
      overlay: 'rgba(228, 216, 198, 0.85)',
      texture:
        'repeating-linear-gradient(135deg, rgba(255, 180, 80, 0.2) 0 12px, rgba(255, 255, 255, 0) 12px 24px)'
    },
    dark: {
      panel: '28, 22, 14',
      border: 'rgba(120, 90, 60, 0.6)',
      accent: '#e09b44',
      accentStrong: '#b97b30',
      primary: '#f1a84b',
      muted: '#c3b19a',
      overlay: 'rgba(14, 10, 6, 0.92)',
      texture:
        'repeating-linear-gradient(135deg, rgba(180, 120, 60, 0.18) 0 12px, rgba(255, 255, 255, 0) 12px 24px)'
    }
  },
  {
    id: 'dragon-ball',
    label: 'Dragon Ball',
    font: "'Arial Black', 'Segoe UI', sans-serif",
    heading: "'Impact', 'Arial Black', sans-serif",
    borderStyle: 'solid',
    borderWidth: '2px',
    shadow: '0 18px 40px rgba(120, 60, 10, 0.35)',
    light: {
      panel: '242, 232, 220',
      border: 'rgba(200, 160, 120, 0.7)',
      accent: '#d17935',
      accentStrong: '#b0571c',
      primary: '#e58b2f',
      muted: '#8d7560',
      overlay: 'rgba(230, 214, 198, 0.85)',
      texture: 'radial-gradient(circle at top left, rgba(255, 200, 100, 0.3), transparent 60%)'
    },
    dark: {
      panel: '30, 20, 12',
      border: 'rgba(130, 90, 50, 0.6)',
      accent: '#e08b3d',
      accentStrong: '#b66a28',
      primary: '#f09a3a',
      muted: '#c8b59d',
      overlay: 'rgba(14, 9, 5, 0.92)',
      texture: 'radial-gradient(circle at top left, rgba(210, 140, 70, 0.28), transparent 60%)'
    }
  },
  {
    id: 'one-punch-man',
    label: 'One Punch Man',
    font: "'Franklin Gothic Medium', 'Segoe UI', sans-serif",
    heading: "'Impact', 'Franklin Gothic Medium', sans-serif",
    borderStyle: 'solid',
    borderWidth: '2px',
    shadow: '0 16px 38px rgba(120, 60, 20, 0.3)',
    light: {
      panel: '240, 236, 232',
      border: 'rgba(210, 180, 120, 0.7)',
      accent: '#d17d2c',
      accentStrong: '#b55f1a',
      primary: '#f0b23c',
      muted: '#8a7a6b',
      overlay: 'rgba(228, 220, 210, 0.85)',
      texture: 'linear-gradient(135deg, rgba(255, 220, 120, 0.25), rgba(255, 255, 255, 0))'
    },
    dark: {
      panel: '26, 20, 16',
      border: 'rgba(120, 80, 50, 0.6)',
      accent: '#e19a3a',
      accentStrong: '#b87426',
      primary: '#f2b93e',
      muted: '#c0b3a3',
      overlay: 'rgba(12, 8, 6, 0.92)',
      texture: 'linear-gradient(135deg, rgba(220, 150, 70, 0.22), rgba(255, 255, 255, 0))'
    }
  },
  {
    id: 'ergo-proxy',
    label: 'Ergo Proxy',
    font: "'Segoe UI', 'Arial', sans-serif",
    heading: "'Segoe UI', 'Arial', sans-serif",
    borderStyle: 'dashed',
    borderWidth: '1px',
    shadow: '0 18px 38px rgba(40, 50, 70, 0.35)',
    light: {
      panel: '230, 232, 236',
      border: 'rgba(170, 170, 180, 0.7)',
      accent: '#7a7f8f',
      accentStrong: '#5a5f70',
      primary: '#8b93a8',
      muted: '#70757f',
      overlay: 'rgba(210, 214, 220, 0.85)',
      texture:
        'repeating-linear-gradient(90deg, rgba(120, 130, 150, 0.18) 0 6px, rgba(255, 255, 255, 0) 6px 12px)'
    },
    dark: {
      panel: '18, 20, 26',
      border: 'rgba(80, 90, 110, 0.6)',
      accent: '#8a93a8',
      accentStrong: '#66708a',
      primary: '#9aa3b8',
      muted: '#b0b7c4',
      overlay: 'rgba(10, 12, 16, 0.92)',
      texture:
        'repeating-linear-gradient(90deg, rgba(90, 100, 120, 0.2) 0 6px, rgba(255, 255, 255, 0) 6px 12px)'
    }
  },
  {
    id: 'serial-lain',
    label: 'Serial Lain',
    font: "'Consolas', 'Courier New', monospace",
    heading: "'Consolas', 'Courier New', monospace",
    borderStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 16px 36px rgba(20, 40, 40, 0.35)',
    light: {
      panel: '230, 236, 238',
      border: 'rgba(160, 180, 190, 0.7)',
      accent: '#6b8b8f',
      accentStrong: '#4f7073',
      primary: '#7fa7a8',
      muted: '#6f8083',
      overlay: 'rgba(210, 220, 224, 0.85)',
      texture:
        'repeating-linear-gradient(0deg, rgba(130, 170, 170, 0.2) 0 2px, rgba(255, 255, 255, 0) 2px 4px)'
    },
    dark: {
      panel: '16, 22, 24',
      border: 'rgba(70, 90, 95, 0.6)',
      accent: '#7fa2a4',
      accentStrong: '#5f8083',
      primary: '#89b3b4',
      muted: '#a8b8b9',
      overlay: 'rgba(8, 12, 13, 0.92)',
      texture:
        'repeating-linear-gradient(0deg, rgba(110, 140, 140, 0.22) 0 2px, rgba(255, 255, 255, 0) 2px 4px)'
    }
  }
];

const state = {
  tabs: [],
  activeTabId: 'study',
  timers: {},
  history: [],
  stats: {
    episodes: 0,
    animeMinutes: 0,
    studyMinutes: 0,
    totalMinutes: 0,
    streak: 0,
    lastCompletionDate: null
  },
  remainingSeconds: 50 * 60,
  running: false,
  intervalId: null,
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  selectedWeekday: (new Date().getDay() + 6) % 7,
  theme: 'light',
  wallpaper: null,
  sound: null,
  opacity: 0.92,
  radius: 14,
  palette: 'forest',
  character: null,
  autoSave: false,
  themeId: 'non-non-biyori'
};

const tabsEl = document.getElementById('tabs');
const timerValueEl = document.getElementById('timer-value');
const timerCircleEl = document.getElementById('timer-circle');
const startPauseBtn = document.getElementById('start-pause');
const resetBtn = document.getElementById('reset');
const timerMetaEl = document.getElementById('timer-meta');
const modalEl = document.getElementById('modal');
const newTabInput = document.getElementById('new-tab-name');
const addTabBtn = document.getElementById('add-tab');
const saveModalBtn = document.getElementById('save-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const historyEl = document.getElementById('history');
const cardsEl = document.getElementById('cards');
const currentDateEl = document.getElementById('current-date');
const weekTabsEl = document.getElementById('week-tabs');
const settingsOpenBtn = document.getElementById('settings-open');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseBtn = document.getElementById('settings-close');
const wallpaperInput = document.getElementById('wallpaper-input');
const soundInput = document.getElementById('sound-input');
const wallpaperRemoveBtn = document.getElementById('wallpaper-remove');
const soundRemoveBtn = document.getElementById('sound-remove');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');
const opacityRange = document.getElementById('opacity-range');
const radiusRange = document.getElementById('radius-range');
const paletteGrid = document.getElementById('palette-grid');
const themeGrid = document.getElementById('theme-grid');
const settingsTabs = document.getElementById('settings-tabs');
const characterInput = document.getElementById('character-input');
const characterRemoveBtn = document.getElementById('character-remove');
const timerCharacter = document.getElementById('timer-character');
const timerCharacterImg = document.getElementById('timer-character-img');
const autoSaveToggle = document.getElementById('auto-save-toggle');
const importSettingsBtn = document.getElementById('import-settings');
const exportSettingsBtn = document.getElementById('export-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const openCalendarBtn = document.getElementById('open-calendar');
const calendarModal = document.getElementById('calendar-modal');
const monthGridEl = document.getElementById('month-grid');
const closeCalendarBtn = document.getElementById('close-calendar');

const statEpisodes = document.getElementById('stat-episodes');
const statAnimeTime = document.getElementById('stat-anime-time');
const statStudyTime = document.getElementById('stat-study-time');
const statStreak = document.getElementById('stat-streak');
const statTotal = document.getElementById('stat-total');
const newTabIconUrl = document.getElementById('new-tab-icon-url');
const newTabIconFile = document.getElementById('new-tab-icon-file');
let newTabIconData = '';

const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remaining
    .toString()
    .padStart(2, '0')}`;
};

const hashString = (value) =>
  Array.from(value).reduce((total, char) => total + char.charCodeAt(0), 0);

const resolveTabIcon = (tab) => {
  if (tab.icon) return tab.icon;
  const index = hashString(tab.id) % FALLBACK_ICONS.length;
  return FALLBACK_ICONS[index];
};

const createIconElement = (icon, className) => {
  const isImage = icon.startsWith('data:') || icon.startsWith('http');
  if (isImage) {
    const img = document.createElement('img');
    img.src = icon;
    img.alt = '';
    img.className = className;
    return img;
  }
  const span = document.createElement('span');
  span.className = className;
  span.textContent = icon;
  return span;
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEYS.tabs, JSON.stringify(state.tabs));
  localStorage.setItem(STORAGE_KEYS.timers, JSON.stringify(state.timers));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(state.stats));
  localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  localStorage.setItem(STORAGE_KEYS.wallpaper, state.wallpaper || '');
  localStorage.setItem(STORAGE_KEYS.sound, state.sound || '');
  localStorage.setItem(STORAGE_KEYS.opacity, String(state.opacity));
  localStorage.setItem(STORAGE_KEYS.radius, String(state.radius));
  localStorage.setItem(STORAGE_KEYS.palette, state.palette);
  localStorage.setItem(STORAGE_KEYS.character, state.character || '');
  localStorage.setItem(STORAGE_KEYS.autoSave, state.autoSave ? '1' : '0');
  localStorage.setItem(STORAGE_KEYS.themeId, state.themeId);
};

const loadState = () => {
  const storedTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.tabs) || 'null');
  const storedTimers = JSON.parse(localStorage.getItem(STORAGE_KEYS.timers) || '{}');
  const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
  const storedStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || 'null');
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const storedWallpaper = localStorage.getItem(STORAGE_KEYS.wallpaper);
  const storedSound = localStorage.getItem(STORAGE_KEYS.sound);
  const storedOpacity = localStorage.getItem(STORAGE_KEYS.opacity);
  const storedRadius = localStorage.getItem(STORAGE_KEYS.radius);
  const storedPalette = localStorage.getItem(STORAGE_KEYS.palette);
  const storedCharacter = localStorage.getItem(STORAGE_KEYS.character);
  const storedAutoSave = localStorage.getItem(STORAGE_KEYS.autoSave);
  const storedThemeId = localStorage.getItem(STORAGE_KEYS.themeId);

  state.tabs = storedTabs && storedTabs.length ? storedTabs : DEFAULT_TABS;
  state.timers = storedTimers;
  state.history = storedHistory;
  if (storedStats) {
    state.stats = storedStats;
  }
  if (storedTheme) {
    state.theme = storedTheme;
  }
  if (storedWallpaper) {
    state.wallpaper = storedWallpaper || null;
  }
  if (storedSound) {
    state.sound = storedSound || null;
  }
  if (storedOpacity) {
    state.opacity = Number(storedOpacity) || state.opacity;
  }
  if (storedRadius) {
    state.radius = Number(storedRadius) || state.radius;
  }
  if (storedPalette) {
    state.palette = storedPalette;
  }
  if (storedCharacter) {
    state.character = storedCharacter || null;
  }
  if (storedAutoSave) {
    state.autoSave = storedAutoSave === '1';
  }
  if (storedThemeId) {
    state.themeId = storedThemeId;
  }
  if (!state.timers[state.activeTabId]) {
    state.timers[state.activeTabId] = 50 * 60;
  }
  state.remainingSeconds = state.timers[state.activeTabId];
};

const applyTheme = () => {
  document.body.dataset.theme = state.theme;
  document.body.dataset.themeId = state.themeId;
  themeLightBtn.classList.toggle('active', state.theme === 'light');
  themeDarkBtn.classList.toggle('active', state.theme === 'dark');
  const theme = THEMES.find((item) => item.id === state.themeId) || THEMES[0];
  const themeValues = state.theme === 'dark' ? theme.dark : theme.light;
  document.documentElement.style.setProperty('--panel-bg-rgb', themeValues.panel);
  document.documentElement.style.setProperty('--panel-border', themeValues.border);
  document.documentElement.style.setProperty('--accent', themeValues.accent);
  document.documentElement.style.setProperty('--accent-strong', themeValues.accentStrong);
  document.documentElement.style.setProperty('--primary', themeValues.primary);
  document.documentElement.style.setProperty('--text-muted', themeValues.muted);
  document.documentElement.style.setProperty('--theme-overlay', themeValues.overlay);
  document.documentElement.style.setProperty('--panel-texture', themeValues.texture || 'none');
  document.documentElement.style.setProperty('--theme-font', theme.font || "'Segoe UI', system-ui, sans-serif");
  document.documentElement.style.setProperty(
    '--theme-heading-font',
    theme.heading || "'Segoe UI', system-ui, sans-serif"
  );
  document.documentElement.style.setProperty('--theme-border-style', theme.borderStyle || 'solid');
  document.documentElement.style.setProperty('--theme-border-width', theme.borderWidth || '1px');
  document.documentElement.style.setProperty(
    '--theme-shadow',
    theme.shadow || '0 12px 25px rgba(0, 0, 0, 0.18)'
  );
  applyPalette();
};

const applyWallpaper = () => {
  if (state.wallpaper) {
    document.documentElement.style.setProperty('--background-image', `url('${state.wallpaper}')`);
    document.body.style.backgroundImage = `url('${state.wallpaper}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  } else {
    document.documentElement.style.setProperty('--background-image', 'none');
    document.body.style.backgroundImage = 'none';
  }
};

const applyLayoutSettings = () => {
  document.documentElement.style.setProperty('--panel-opacity', state.opacity);
  document.documentElement.style.setProperty('--panel-radius', `${state.radius}px`);
  opacityRange.value = state.opacity;
  radiusRange.value = state.radius;
};

const applyPalette = () => {
  const palette = PALETTES.find((item) => item.id === state.palette) || PALETTES[0];
  document.documentElement.style.setProperty('--accent', palette.accent);
  document.documentElement.style.setProperty('--accent-strong', palette.accentStrong);
  document.documentElement.style.setProperty('--primary', palette.primary);
  Array.from(paletteGrid.children).forEach((button) => {
    button.classList.toggle('active', button.dataset.palette === state.palette);
  });
};

const renderPalettes = () => {
  paletteGrid.innerHTML = '';
  PALETTES.forEach((palette) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'palette-button';
    button.dataset.palette = palette.id;
    button.style.background = palette.primary;
    button.addEventListener('click', () => setPalette(palette.id));
    paletteGrid.appendChild(button);
  });
  applyPalette();
};

const renderThemes = () => {
  themeGrid.innerHTML = '';
  THEMES.forEach((theme) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-button';
    button.dataset.themeId = theme.id;
    button.textContent = theme.label;
    button.addEventListener('click', () => {
      state.themeId = theme.id;
      saveState();
      applyTheme();
      renderThemes();
    });
    themeGrid.appendChild(button);
  });
  Array.from(themeGrid.children).forEach((button) => {
    button.classList.toggle('active', button.dataset.themeId === state.themeId);
  });
};

const applyCharacter = () => {
  if (state.character) {
    timerCharacterImg.src = state.character;
    timerCharacter.style.display = 'block';
  } else {
    timerCharacterImg.removeAttribute('src');
    timerCharacter.style.display = 'none';
  }
};

const renderTabs = () => {
  tabsEl.innerHTML = '';
  const lockTabs = state.running;
  state.tabs.forEach((tab) => {
    const button = document.createElement('button');
    button.className = `tab ${tab.id === state.activeTabId ? 'active' : ''}`;
    button.dataset.tabId = tab.id;
    button.classList.toggle('disabled', lockTabs);
    button.disabled = lockTabs;
    const icon = resolveTabIcon(tab);
    button.appendChild(createIconElement(icon, 'tab-icon'));
    const label = document.createElement('span');
    label.textContent = tab.label;
    button.appendChild(label);
    button.addEventListener('click', () => {
      if (state.running) return;
      selectTab(tab.id);
    });
    if (!tab.isLocked) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'tab-close';
      closeBtn.textContent = '×';
      closeBtn.disabled = lockTabs;
      closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (state.running) return;
        removeTab(tab.id);
      });
      button.appendChild(closeBtn);
    }
    tabsEl.appendChild(button);
  });
};

const renderTimer = () => {
  timerValueEl.textContent = formatTime(state.remainingSeconds);
  timerMetaEl.textContent = `Tempo salvo: ${formatTime(
    state.timers[state.activeTabId] || 0
  )}`;
  startPauseBtn.textContent = state.running ? 'Pausar' : 'Começar';
};

const createWeekTabs = () => {
  weekTabsEl.innerHTML = '';
  WEEKDAYS.forEach((day, index) => {
    const tab = document.createElement('button');
    tab.className = `week-tab ${index === state.selectedWeekday ? 'active' : ''}`;
    tab.textContent = day;
    tab.addEventListener('click', () => {
      state.selectedWeekday = index;
      renderWeekTabs();
      renderHistory();
    });
    weekTabsEl.appendChild(tab);
  });
};

const renderWeekTabs = () => {
  Array.from(weekTabsEl.children).forEach((tab, index) => {
    tab.classList.toggle('active', index === state.selectedWeekday);
  });
};

const filterHistoryByMonth = () =>
  state.history.filter((entry) => {
    const date = new Date(entry.timestamp);
    return date.getMonth() === state.selectedMonth && date.getFullYear() === state.selectedYear;
  });

const renderHistory = () => {
  historyEl.innerHTML = '';
  const monthHistory = filterHistoryByMonth();
  const filtered = monthHistory.filter((entry) => entry.weekday === state.selectedWeekday);

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history-item';
    empty.textContent = 'Sem registros para este dia.';
    historyEl.appendChild(empty);
    return;
  }

  filtered
    .slice()
    .reverse()
    .forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const main = document.createElement('div');
      main.className = 'history-main';
      main.appendChild(createIconElement(entry.icon, 'history-icon'));
      const meta = document.createElement('div');
      meta.className = 'history-meta';
      const label = document.createElement('strong');
      label.textContent = entry.label;
      const time = document.createElement('span');
      time.textContent = `${entry.dateText} • ${entry.time}`;
      meta.appendChild(label);
      meta.appendChild(time);
      main.appendChild(meta);
      const duration = document.createElement('div');
      duration.className = 'history-duration';
      duration.textContent = entry.duration;
      item.appendChild(main);
      item.appendChild(duration);
      historyEl.appendChild(item);
    });
};

const renderStats = () => {
  statEpisodes.textContent = state.stats.episodes;
  statAnimeTime.textContent = formatMinutes(state.stats.animeMinutes);
  statStudyTime.textContent = formatMinutes(state.stats.studyMinutes);
  statTotal.textContent = formatMinutes(state.stats.totalMinutes);
  statStreak.textContent = `${state.stats.streak} dias`;
};

const scrollTabIntoView = (tabId) => {
  const tabButton = tabsEl.querySelector(`[data-tab-id="${tabId}"]`);
  if (!tabButton) return;
  const offset =
    tabButton.offsetLeft - tabsEl.clientWidth / 2 + tabButton.clientWidth / 2;
  tabsEl.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
};

const renderCards = () => {
  cardsEl.innerHTML = '';
  state.tabs.forEach((tab) => {
    const totalMinutes = state.history
      .filter((entry) => entry.tabId === tab.id)
      .reduce((total, entry) => total + entry.minutes, 0);
    const icon = resolveTabIcon(tab);
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('div');
    title.className = 'card-title';
    title.appendChild(createIconElement(icon, 'card-icon'));
    const label = document.createElement('span');
    label.textContent = tab.label;
    title.appendChild(label);
    const value = document.createElement('div');
    value.className = 'card-value';
    value.textContent = formatMinutes(totalMinutes);
    card.appendChild(title);
    card.appendChild(value);
    card.addEventListener('click', () => {
      selectTab(tab.id);
      scrollTabIntoView(tab.id);
    });
    cardsEl.appendChild(card);
  });
};

const renderDate = () => {
  const now = new Date();
  const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = now.toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = MONTHS[state.selectedMonth];
  const year = state.selectedYear;
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  currentDateEl.textContent = `${weekday}, ${day} de ${month} de ${year} • ${time}`;
};

const renderCalendar = () => {
  monthGridEl.innerHTML = '';
  MONTHS.forEach((month, index) => {
    const card = document.createElement('button');
    card.className = `month-card ${index === state.selectedMonth ? 'active' : ''}`;
    card.textContent = `${month} ${state.selectedYear}`;
    card.addEventListener('click', () => {
      state.selectedMonth = index;
      renderCalendar();
      renderDate();
      renderHistory();
    });
    monthGridEl.appendChild(card);
  });
};

const selectTab = (tabId) => {
  state.activeTabId = tabId;
  state.remainingSeconds = state.timers[tabId] || 50 * 60;
  state.running = false;
  clearInterval(state.intervalId);
  renderTabs();
  renderTimer();
};

const adjustTimer = (minutes) => {
  const newValue = Math.max(1, state.remainingSeconds + minutes * 60);
  state.remainingSeconds = newValue;
  state.timers[state.activeTabId] = newValue;
  saveState();
  renderTimer();
};

const editTimer = () => {
  const currentMinutes = (state.remainingSeconds / 60).toFixed(2);
  const input = prompt('Digite o tempo em minutos:', currentMinutes);
  if (input === null) return;
  const minutes = Number.parseFloat(input.replace(',', '.'));
  if (!Number.isNaN(minutes) && minutes >= 0) {
    state.remainingSeconds = Math.max(1, Math.round(minutes * 60));
    state.timers[state.activeTabId] = state.remainingSeconds;
    saveState();
    renderTimer();
  }
};

const startTimer = () => {
  if (state.running) {
    state.running = false;
    clearInterval(state.intervalId);
    renderTimer();
    return;
  }

  state.running = true;
  state.intervalId = setInterval(() => {
    if (state.remainingSeconds <= 0) {
      completeTimer();
      return;
    }
    state.remainingSeconds -= 1;
    renderTimer();
  }, 1000);
  renderTimer();
};

const resetTimer = () => {
  state.running = false;
  clearInterval(state.intervalId);
  state.remainingSeconds = state.timers[state.activeTabId] || 50 * 60;
  renderTimer();
};

const playSound = () => {
  if (!state.sound) return;
  const audio = new Audio(state.sound);
  audio.play().catch(() => {});
};

const completeTimer = async () => {
  clearInterval(state.intervalId);
  state.running = false;

  const tab = state.tabs.find((item) => item.id === state.activeTabId);
  const minutes = Math.floor(state.timers[state.activeTabId] / 60);
  const timestamp = new Date();
  const icon = tab ? resolveTabIcon(tab) : '⏱️';
  const entry = {
    tabId: state.activeTabId,
    label: tab ? tab.label : 'Timer',
    icon,
    minutes,
    duration: `${minutes}min`,
    time: timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    dateText: timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    timestamp: timestamp.toISOString(),
    weekday: (timestamp.getDay() + 6) % 7
  };

  state.history.push(entry);
  state.stats.totalMinutes += minutes;
  if (tab?.type === 'anime') {
    state.stats.episodes += 1;
    state.stats.animeMinutes += minutes;
  } else {
    state.stats.studyMinutes += minutes;
  }

  const today = timestamp.toDateString();
  if (state.stats.lastCompletionDate !== today) {
    state.stats.streak += 1;
    state.stats.lastCompletionDate = today;
  }

  saveState();
  renderHistory();
  renderStats();
  renderCards();
  renderTimer();
  playSound();
  if (state.autoSave) {
    if (window.animedoroApi?.saveBackup) {
      try {
        await window.animedoroApi.saveBackup(buildSnapshot());
      } catch (error) {
        console.error('Falha ao salvar backup automático:', error);
        await exportSnapshot();
      }
    } else {
      await exportSnapshot();
    }
  }
};

const openModal = () => {
  modalEl.classList.add('open');
  newTabInput.value = '';
  newTabInput.focus();
};

const closeModal = () => {
  modalEl.classList.remove('open');
  newTabInput.value = '';
  newTabIconUrl.value = '';
  newTabIconFile.value = '';
  newTabIconData = '';
};

const saveNewTab = () => {
  const label = newTabInput.value.trim();
  if (!label) return;
  const id = `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  const iconUrl = newTabIconUrl.value.trim();
  const icon = newTabIconData || iconUrl || FALLBACK_ICONS[state.tabs.length % FALLBACK_ICONS.length];
  state.tabs.push({ id, label, type: 'custom', icon, isLocked: false });
  state.timers[id] = state.remainingSeconds;
  saveState();
  renderTabs();
  renderCards();
  closeModal();
  newTabInput.value = '';
  newTabIconUrl.value = '';
  newTabIconFile.value = '';
  newTabIconData = '';
};

const openCalendar = () => {
  calendarModal.classList.add('open');
};

const closeCalendar = () => {
  calendarModal.classList.remove('open');
};

const openSettings = () => {
  settingsModal.classList.add('open');
};

const closeSettings = () => {
  settingsModal.classList.remove('open');
};

const setTheme = (theme) => {
  state.theme = theme;
  saveState();
  applyTheme();
};

const handleWallpaperChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.wallpaper = reader.result;
    saveState();
    applyWallpaper();
  };
  reader.readAsDataURL(file);
};

const handleTabIconFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    newTabIconData = reader.result;
  };
  reader.readAsDataURL(file);
};

const removeWallpaper = () => {
  state.wallpaper = null;
  saveState();
  applyWallpaper();
  wallpaperInput.value = '';
};

const handleSoundChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.sound = reader.result;
    saveState();
  };
  reader.readAsDataURL(file);
};

const removeSound = () => {
  state.sound = null;
  saveState();
  soundInput.value = '';
};

const handleCharacterChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.character = reader.result;
    saveState();
    applyCharacter();
  };
  reader.readAsDataURL(file);
};

const removeCharacter = () => {
  state.character = null;
  saveState();
  applyCharacter();
  characterInput.value = '';
};

const setPalette = (paletteId) => {
  state.palette = paletteId;
  saveState();
  applyPalette();
};

const handleOpacityChange = (event) => {
  state.opacity = Number(event.target.value);
  saveState();
  applyLayoutSettings();
};

const handleRadiusChange = (event) => {
  state.radius = Number(event.target.value);
  saveState();
  applyLayoutSettings();
};

const handleAutoSaveToggle = (event) => {
  state.autoSave = event.target.checked;
  saveState();
};

const handleSettingsTabClick = (event) => {
  const target = event.target.closest('.settings-tab');
  if (!target) return;
  const section = target.dataset.section;
  Array.from(settingsTabs.children).forEach((button) => {
    button.classList.toggle('active', button === target);
  });
  document.querySelectorAll('.settings-section').forEach((el) => {
    el.hidden = el.dataset.section !== section;
  });
};

const buildSnapshot = () => ({
  exportedAt: new Date().toISOString(),
  tabs: state.tabs,
  timers: state.timers,
  history: state.history,
  stats: state.stats,
  settings: {
    theme: state.theme,
    themeId: state.themeId,
    wallpaper: state.wallpaper,
    sound: state.sound,
    opacity: state.opacity,
    radius: state.radius,
    palette: state.palette,
    character: state.character,
    autoSave: state.autoSave
  }
});

const exportSnapshot = async () => {
  const snapshot = buildSnapshot();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  if (window.animedoroApi?.exportBackup) {
    try {
      const backupPath = await window.animedoroApi.exportBackup(snapshot);
      if (backupPath) {
        console.info(`Backup exportado para ${backupPath}`);
      }
      return;
    } catch (error) {
      console.error('Falha ao exportar backup:', error);
    }
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `animedoro_backup_${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const applySnapshot = (snapshot) => {
  if (!snapshot) return;
  state.tabs = snapshot.tabs || DEFAULT_TABS;
  state.timers = snapshot.timers || {};
  state.history = snapshot.history || [];
  state.stats = snapshot.stats || state.stats;
  if (snapshot.settings) {
    state.theme = snapshot.settings.theme || state.theme;
    state.themeId = snapshot.settings.themeId || state.themeId;
    state.wallpaper = snapshot.settings.wallpaper || null;
    state.sound = snapshot.settings.sound || null;
    state.opacity = snapshot.settings.opacity || state.opacity;
    state.radius = snapshot.settings.radius || state.radius;
    state.palette = snapshot.settings.palette || state.palette;
    state.character = snapshot.settings.character || null;
    state.autoSave = snapshot.settings.autoSave ?? state.autoSave;
  }
  state.tabs = state.tabs.map((tab) => ({
    ...tab,
    isLocked: tab.id === 'study' || tab.id === 'anime'
  }));
  state.activeTabId = state.tabs[0]?.id || 'study';
  state.remainingSeconds = state.timers[state.activeTabId] || 50 * 60;
  saveState();
  applyTheme();
  applyWallpaper();
  applyLayoutSettings();
  applyPalette();
  applyCharacter();
  autoSaveToggle.checked = state.autoSave;
  renderThemes();
  renderPalettes();
  renderTabs();
  renderTimer();
  renderHistory();
  renderStats();
  renderCards();
};

const resetAllSettings = () => {
  localStorage.clear();
  state.tabs = DEFAULT_TABS.map((tab) => ({ ...tab, isLocked: true }));
  state.timers = { study: 50 * 60, anime: 25 * 60 };
  state.history = [];
  state.stats = {
    episodes: 0,
    animeMinutes: 0,
    studyMinutes: 0,
    totalMinutes: 0,
    streak: 0,
    lastCompletionDate: null
  };
  state.theme = 'light';
  state.themeId = 'non-non-biyori';
  state.wallpaper = null;
  state.sound = null;
  state.opacity = 0.92;
  state.radius = 14;
  state.palette = 'forest';
  state.character = null;
  state.autoSave = false;
  state.activeTabId = 'study';
  state.remainingSeconds = state.timers[state.activeTabId];
  saveState();
  applyTheme();
  applyWallpaper();
  applyLayoutSettings();
  applyPalette();
  applyCharacter();
  autoSaveToggle.checked = state.autoSave;
  renderThemes();
  renderPalettes();
  renderDate();
  renderTabs();
  renderTimer();
  renderHistory();
  renderStats();
  renderCards();
};

const handleImportSettings = async () => {
  if (!window.animedoroApi?.importBackup) return;
  const snapshot = await window.animedoroApi.importBackup();
  applySnapshot(snapshot);
};

const removeTab = (tabId) => {
  const tab = state.tabs.find((item) => item.id === tabId);
  if (!tab || tab.isLocked) return;
  state.tabs = state.tabs.filter((item) => item.id !== tabId);
  delete state.timers[tabId];
  saveState();
  if (state.activeTabId === tabId) {
    state.activeTabId = state.tabs[0]?.id || 'study';
  }
  renderTabs();
  renderCards();
  renderTimer();
};

const enableDragScroll = (element) => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  element.addEventListener('mousedown', (event) => {
    isDown = true;
    element.classList.add('dragging');
    startX = event.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('mouseleave', () => {
    isDown = false;
    element.classList.remove('dragging');
  });

  element.addEventListener('mouseup', () => {
    isDown = false;
    element.classList.remove('dragging');
  });

  element.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - element.offsetLeft;
    const walk = (x - startX) * 1.5;
    element.scrollLeft = scrollLeft - walk;
  });
};

const init = () => {
  loadState();
  state.tabs = state.tabs.map((tab) => ({
    ...tab,
    isLocked: tab.id === 'study' || tab.id === 'anime'
  }));
  applyTheme();
  applyWallpaper();
  applyLayoutSettings();
  applyPalette();
  applyCharacter();
  autoSaveToggle.checked = state.autoSave;
  renderDate();
  renderThemes();
  renderPalettes();
  document.querySelectorAll('.settings-section').forEach((section) => {
    section.hidden = section.dataset.section !== 'appearance';
  });
  createWeekTabs();
  renderTabs();
  renderTimer();
  renderHistory();
  renderStats();
  renderCards();
  renderCalendar();
  enableDragScroll(tabsEl);
  setInterval(renderDate, 60000);
};

addTabBtn.addEventListener('click', openModal);
cancelModalBtn.addEventListener('click', closeModal);
saveModalBtn.addEventListener('click', saveNewTab);
modalEl.addEventListener('click', (event) => {
  if (event.target === modalEl) {
    closeModal();
  }
});
newTabIconFile.addEventListener('change', handleTabIconFile);

openCalendarBtn.addEventListener('click', openCalendar);
closeCalendarBtn.addEventListener('click', closeCalendar);
calendarModal.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    closeCalendar();
  }
});

settingsOpenBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    closeSettings();
  }
});
settingsTabs.addEventListener('click', handleSettingsTabClick);

themeLightBtn.addEventListener('click', () => setTheme('light'));
themeDarkBtn.addEventListener('click', () => setTheme('dark'));
wallpaperInput.addEventListener('change', handleWallpaperChange);
soundInput.addEventListener('change', handleSoundChange);
wallpaperRemoveBtn.addEventListener('click', removeWallpaper);
soundRemoveBtn.addEventListener('click', removeSound);
opacityRange.addEventListener('input', handleOpacityChange);
radiusRange.addEventListener('input', handleRadiusChange);
characterInput.addEventListener('change', handleCharacterChange);
characterRemoveBtn.addEventListener('click', removeCharacter);
autoSaveToggle.addEventListener('change', handleAutoSaveToggle);
importSettingsBtn.addEventListener('click', handleImportSettings);
exportSettingsBtn.addEventListener('click', exportSnapshot);
resetSettingsBtn.addEventListener('click', resetAllSettings);

startPauseBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

const adjustButtons = document.querySelectorAll('[data-adjust]');
adjustButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = Number(button.dataset.adjust);
    adjustTimer(value);
  });
});

timerCircleEl.addEventListener('click', editTimer);
timerValueEl.addEventListener('click', editTimer);

init();
