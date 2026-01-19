const DEFAULT_TABS = [
  { id: 'study', label: 'Estudo', type: 'study' },
  { id: 'anime', label: 'Anime', type: 'anime' }
];

const STORAGE_KEYS = {
  tabs: 'animedoro.tabs',
  timers: 'animedoro.timers',
  history: 'animedoro.history',
  stats: 'animedoro.stats',
  theme: 'animedoro.theme',
  wallpaper: 'animedoro.wallpaper',
  sound: 'animedoro.sound'
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
  theme: 'light',
  wallpaper: null,
  sound: null
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
const themeToggleBtn = document.getElementById('theme-toggle');
const wallpaperInput = document.getElementById('wallpaper-input');
const soundInput = document.getElementById('sound-input');
const openCalendarBtn = document.getElementById('open-calendar');
const calendarModal = document.getElementById('calendar-modal');
const monthGridEl = document.getElementById('month-grid');
const closeCalendarBtn = document.getElementById('close-calendar');

const statEpisodes = document.getElementById('stat-episodes');
const statAnimeTime = document.getElementById('stat-anime-time');
const statStudyTime = document.getElementById('stat-study-time');
const statStreak = document.getElementById('stat-streak');
const statTotal = document.getElementById('stat-total');

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

const saveState = () => {
  localStorage.setItem(STORAGE_KEYS.tabs, JSON.stringify(state.tabs));
  localStorage.setItem(STORAGE_KEYS.timers, JSON.stringify(state.timers));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(state.stats));
  localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  localStorage.setItem(STORAGE_KEYS.wallpaper, state.wallpaper || '');
  localStorage.setItem(STORAGE_KEYS.sound, state.sound || '');
};

const loadState = () => {
  const storedTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.tabs) || 'null');
  const storedTimers = JSON.parse(localStorage.getItem(STORAGE_KEYS.timers) || '{}');
  const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
  const storedStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || 'null');
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const storedWallpaper = localStorage.getItem(STORAGE_KEYS.wallpaper);
  const storedSound = localStorage.getItem(STORAGE_KEYS.sound);

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
  if (!state.timers[state.activeTabId]) {
    state.timers[state.activeTabId] = 50 * 60;
  }
  state.remainingSeconds = state.timers[state.activeTabId];
};

const applyTheme = () => {
  document.body.dataset.theme = state.theme;
  themeToggleBtn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
};

const applyWallpaper = () => {
  if (state.wallpaper) {
    document.documentElement.style.setProperty('--background-image', `url('${state.wallpaper}')`);
  } else {
    document.documentElement.style.setProperty('--background-image', 'none');
  }
};

const renderTabs = () => {
  tabsEl.innerHTML = '';
  state.tabs.forEach((tab) => {
    const button = document.createElement('button');
    button.className = `tab ${tab.id === state.activeTabId ? 'active' : ''}`;
    button.textContent = tab.label;
    button.addEventListener('click', () => selectTab(tab.id));
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
  WEEKDAYS.forEach((day) => {
    const tab = document.createElement('div');
    tab.className = 'week-tab';
    tab.textContent = day;
    weekTabsEl.appendChild(tab);
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
  const grouped = Array.from({ length: 7 }, () => []);

  monthHistory.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const dayIndex = (date.getDay() + 6) % 7;
    grouped[dayIndex].push(entry);
  });

  grouped.forEach((entries) => {
    const column = document.createElement('div');
    column.className = 'history-column';
    if (entries.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'history-item';
      empty.textContent = 'Sem registros';
      column.appendChild(empty);
    } else {
      entries.forEach((entry) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
          <strong>${entry.label}</strong>
          <span>${entry.time}</span>
          <span>${entry.duration}</span>
        `;
        column.appendChild(item);
      });
    }
    historyEl.appendChild(column);
  });
};

const renderStats = () => {
  statEpisodes.textContent = state.stats.episodes;
  statAnimeTime.textContent = formatMinutes(state.stats.animeMinutes);
  statStudyTime.textContent = formatMinutes(state.stats.studyMinutes);
  statTotal.textContent = formatMinutes(state.stats.totalMinutes);
  statStreak.textContent = `${state.stats.streak} dias`;
};

const renderCards = () => {
  cardsEl.innerHTML = '';
  state.tabs.forEach((tab) => {
    const totalMinutes = state.history
      .filter((entry) => entry.tabId === tab.id)
      .reduce((total, entry) => total + entry.minutes, 0);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${tab.label}</div>
      <div class="card-value">${formatMinutes(totalMinutes)}</div>
    `;
    card.addEventListener('click', () => selectTab(tab.id));
    cardsEl.appendChild(card);
  });
};

const renderDate = () => {
  currentDateEl.textContent = `${MONTHS[state.selectedMonth]} de ${state.selectedYear}`;
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
  const newValue = Math.max(60, state.remainingSeconds + minutes * 60);
  state.remainingSeconds = newValue;
  state.timers[state.activeTabId] = newValue;
  saveState();
  renderTimer();
};

const editTimer = () => {
  if (state.running) return;
  const input = prompt('Digite o tempo em minutos:', Math.floor(state.remainingSeconds / 60));
  const minutes = Number(input);
  if (!Number.isNaN(minutes) && minutes > 0) {
    state.remainingSeconds = minutes * 60;
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

const completeTimer = () => {
  clearInterval(state.intervalId);
  state.running = false;

  const tab = state.tabs.find((item) => item.id === state.activeTabId);
  const minutes = Math.floor(state.timers[state.activeTabId] / 60);
  const timestamp = new Date();
  const entry = {
    tabId: state.activeTabId,
    label: tab ? tab.label : 'Timer',
    minutes,
    duration: formatTime(state.timers[state.activeTabId]),
    time: timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: timestamp.toISOString()
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
};

const openModal = () => {
  modalEl.classList.add('open');
  newTabInput.value = '';
  newTabInput.focus();
};

const closeModal = () => {
  modalEl.classList.remove('open');
};

const saveNewTab = () => {
  const label = newTabInput.value.trim();
  if (!label) return;
  const id = `${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  state.tabs.push({ id, label, type: 'custom' });
  state.timers[id] = state.remainingSeconds;
  saveState();
  renderTabs();
  renderCards();
  closeModal();
};

const openCalendar = () => {
  calendarModal.classList.add('open');
};

const closeCalendar = () => {
  calendarModal.classList.remove('open');
};

const toggleTheme = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
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

const init = () => {
  loadState();
  applyTheme();
  applyWallpaper();
  createWeekTabs();
  renderDate();
  renderTabs();
  renderTimer();
  renderHistory();
  renderStats();
  renderCards();
  renderCalendar();
};

addTabBtn.addEventListener('click', openModal);
cancelModalBtn.addEventListener('click', closeModal);
saveModalBtn.addEventListener('click', saveNewTab);
modalEl.addEventListener('click', (event) => {
  if (event.target === modalEl) {
    closeModal();
  }
});

openCalendarBtn.addEventListener('click', openCalendar);
closeCalendarBtn.addEventListener('click', closeCalendar);
calendarModal.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    closeCalendar();
  }
});

themeToggleBtn.addEventListener('click', toggleTheme);
wallpaperInput.addEventListener('change', handleWallpaperChange);
soundInput.addEventListener('change', handleSoundChange);

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

init();
