// Kontext v2.0 Storage, Adaptive Progress & Spaced-Repetition Manager
(function (root) {
  'use strict';

  const STORAGE_KEY = 'skvorling_state_v2';
  const LEGACY_STORAGE_KEY = 'kontext_state_v1';
  const PASSIVE_MASTERY_THRESHOLD = 100;

  const DEFAULT_SETTINGS = {
    enabled: true,
    autoProgression: true,
    manualMaxPerSentence: 2,
    manualMaxCefr: 'B1',
    minSentenceWords: 7,
    minWordGap: 2,
    useRandomizer: true,       // v2.0: weighted random selection within high-utility top pool
    smartGrammar: true,        // v2.0: inflect tenses, participles, plurals & bare instrumentals
    autoMastery: false,        // v2.9 DEFAULT OFF: words are mastered via 'Знаю' or active drill; if ON, requires 100 clean exposures
    hideMasteredWords: true,   // v2.1 DEFAULT: stop showing words marked as mastered (toggle OFF for immersion % accumulation)
    usePhrases: true,          // v2.3: translate natural 2-3 word contextual phrases (in fact, makes sense, at least)
    cloudSync: true,           // v2.5: automatic cross-device sync via chrome.storage.sync
    enabledPacks: [],          // v2.1: ['tech', 'business', 'literature', 'medicine']
    uiTheme: 'colorful',       // 'light' | 'colorful' | 'dark'
    visualStyle: 'underline',  // 'underline' | 'pill' | 'minimal'
    accent: 'en-US',
    autoSpeakOnHover: false,
    showIpa: true,
    showCueBadge: true,
    updateManifestUrl: '',     // Optional URL to JSON release manifest for update checks
    excludedDomains: [
      'docs.google.com',
      'github.com',
      'localhost'
    ]
  };

  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function createDefaultState() {
    return {
      settings: { ...DEFAULT_SETTINGS },
      progress: {},
      customWords: [],
      stats: {
        totalSeen: 0,
        totalHovers: 0,
        streakDays: 0,
        lastActiveDate: '',
        daily: {}
      }
    };
  }

  function mergeWithDefaults(raw) {
    const def = createDefaultState();
    if (!raw || typeof raw !== 'object') return def;
    return {
      settings: { ...def.settings, ...(raw.settings || {}) },
      progress: raw.progress && typeof raw.progress === 'object' ? raw.progress : {},
      customWords: Array.isArray(raw.customWords) ? raw.customWords : [],
      stats: {
        ...def.stats,
        ...(raw.stats || {}),
        daily: (raw.stats && raw.stats.daily) || {}
      }
    };
  }

  async function loadState() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return createDefaultState();
    }
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY], (res) => {
        if (res[STORAGE_KEY]) {
          pullCompactSync(mergeWithDefaults(res[STORAGE_KEY])).then(resolve);
        } else if (res[LEGACY_STORAGE_KEY]) {
          // Seamless one-time migration from Kontext v1/v2.1 to Skvorling v2.2!
          const migrated = mergeWithDefaults(res[LEGACY_STORAGE_KEY]);
          chrome.storage.local.set({ [STORAGE_KEY]: migrated }, () => resolve(migrated));
        } else {
          resolve(createDefaultState());
        }
      });
    });
  }

  function pushCompactSync(state) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) return;
    if (!state.settings || state.settings.cloudSync === false) return;
    try {
      const mastered = Object.keys(state.progress || {}).filter((k) => state.progress[k] && state.progress[k].status === 'mastered').slice(0, 450);
      const hidden = Object.keys(state.progress || {}).filter((k) => state.progress[k] && state.progress[k].status === 'hidden').slice(0, 150);
      const starred = Object.keys(state.progress || {}).filter((k) => state.progress[k] && state.progress[k].starred).slice(0, 200);
      chrome.storage.sync.set({
        skvorling_sync_settings: state.settings,
        skvorling_sync_mastered: mastered,
        skvorling_sync_hidden: hidden,
        skvorling_sync_starred: starred,
        skvorling_sync_updated: Date.now()
      });
    } catch (_) {}
  }

  async function pullCompactSync(localState) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) return localState;
    if (localState.settings && localState.settings.cloudSync === false) return localState;
    return new Promise((resolve) => {
      chrome.storage.sync.get(['skvorling_sync_mastered', 'skvorling_sync_hidden', 'skvorling_sync_starred'], (syncRes) => {
        if (!syncRes) return resolve(localState);
        let changed = false;
        for (const id of (syncRes.skvorling_sync_mastered || [])) {
          if (!localState.progress[id]) {
            localState.progress[id] = { seen: 5, hovers: 0, cleanStreak: 5, status: 'mastered', lastSeen: Date.now() };
            changed = true;
          }
        }
        for (const id of (syncRes.skvorling_sync_hidden || [])) {
          if (!localState.progress[id]) {
            localState.progress[id] = { seen: 1, hovers: 0, cleanStreak: 0, status: 'hidden', lastSeen: Date.now() };
            changed = true;
          }
        }
        for (const id of (syncRes.skvorling_sync_starred || [])) {
          if (!localState.progress[id]) {
            localState.progress[id] = { seen: 1, hovers: 0, cleanStreak: 0, status: 'learning', starred: true, lastSeen: Date.now() };
            changed = true;
          } else if (!localState.progress[id].starred) {
            localState.progress[id].starred = true;
            changed = true;
          }
        }
        if (changed) chrome.storage.local.set({ [STORAGE_KEY]: localState }, () => resolve(localState));
        else resolve(localState);
      });
    });
  }

  async function saveState(state) {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return;
    }
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: state }, () => {
        pushCompactSync(state);
        resolve();
      });
    });
  }

  function countMastered(progress) {
    let count = 0;
    for (const key of Object.keys(progress || {})) {
      if (progress[key] && progress[key].status === 'mastered') count++;
    }
    return count;
  }

  function touchDaily(state) {
    const today = getTodayKey();
    if (!state.stats.daily[today]) {
      state.stats.daily[today] = { seen: 0, mastered: 0, hovers: 0 };
    }
    if (state.stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (state.stats.lastActiveDate === yKey) {
        state.stats.streakDays = (state.stats.streakDays || 0) + 1;
      } else {
        state.stats.streakDays = 1;
      }
      state.stats.lastActiveDate = today;
    }
    return state.stats.daily[today];
  }

  const EXPOSURE_COOLDOWN_MS = 60 * 1000;

  function recordExposure(state, wordId, force = false) {
    const day = touchDaily(state);
    const now = Date.now();
    if (!state.progress[wordId]) {
      state.progress[wordId] = { seen: 0, hovers: 0, cleanStreak: 0, status: 'learning', lastSeen: now };
    }
    const p = state.progress[wordId];
    // Prevent F5 page-refresh spam from falsely mastering words within 60 seconds
    if (!force && p.seen > 0 && p.lastSeen && (now - p.lastSeen) < EXPOSURE_COOLDOWN_MS) {
      return p;
    }
    p.seen += 1;
    p.cleanStreak = (p.cleanStreak || 0) + 1;
    p.lastSeen = now;

    if (p.status === 'learning' && (force || (state.settings && state.settings.autoMastery)) && p.cleanStreak >= PASSIVE_MASTERY_THRESHOLD) {
      p.status = 'mastered';
      day.mastered += 1;
    }

    state.stats.totalSeen += 1;
    day.seen += 1;
    return p;
  }

  function recordHover(state, wordId) {
    const day = touchDaily(state);
    const now = Date.now();
    if (!state.progress[wordId]) {
      state.progress[wordId] = { seen: 1, hovers: 0, cleanStreak: 0, status: 'learning', lastSeen: now };
    }
    const p = state.progress[wordId];
    p.hovers = (p.hovers || 0) + 1;
    p.cleanStreak = 0;
    p.lastSeen = now;
    if (p.status === 'mastered') {
      p.status = 'learning';
    }
    state.stats.totalHovers += 1;
    day.hovers += 1;
    return p;
  }

  function setWordStatus(state, wordId, status) {
    const day = touchDaily(state);
    const now = Date.now();
    const prev = state.progress[wordId];
    if (!prev) {
      state.progress[wordId] = {
        seen: 1,
        hovers: 0,
        cleanStreak: status === 'mastered' ? PASSIVE_MASTERY_THRESHOLD : 0,
        status,
        lastSeen: now
      };
    } else {
      if (status === 'mastered' && prev.status !== 'mastered') {
        day.mastered += 1;
        prev.cleanStreak = PASSIVE_MASTERY_THRESHOLD;
      }
      if (status === 'learning') {
        prev.cleanStreak = 0;
      }
      prev.status = status;
      prev.lastSeen = now;
    }
    return state.progress[wordId];
  }

  function toggleStarred(state, wordId) {
    const now = Date.now();
    if (!state.progress[wordId]) {
      state.progress[wordId] = { seen: 1, hovers: 0, cleanStreak: 0, status: 'learning', starred: true, lastSeen: now };
    } else {
      state.progress[wordId].starred = !state.progress[wordId].starred;
      if (state.progress[wordId].starred && state.progress[wordId].status === 'mastered') {
        state.progress[wordId].status = 'learning';
        state.progress[wordId].cleanStreak = 0;
      }
      state.progress[wordId].lastSeen = now;
    }
    return !!state.progress[wordId].starred;
  }

  function countStarred(progress) {
    let c = 0;
    for (const k of Object.keys(progress || {})) {
      if (progress[k] && progress[k].starred) c++;
    }
    return c;
  }

  function getEffectiveConfig(state, nlp) {
    const masteredCount = countMastered(state.progress);
    const stageInfo = nlp.getStageForMastered(masteredCount);

    return {
      minSentenceWords: state.settings.minSentenceWords,
      minWordGap: state.settings.minWordGap,
      useRandomizer: state.settings.useRandomizer !== false,
      smartGrammar: state.settings.smartGrammar !== false,
      hideMasteredWords: state.settings.hideMasteredWords !== false,
      usePhrases: state.settings.usePhrases !== false,
      enabledPacks: Array.isArray(state.settings.enabledPacks) ? state.settings.enabledPacks : [],
      maxPerSentence: state.settings.autoProgression
        ? stageInfo.maxPerSentence
        : state.settings.manualMaxPerSentence,
      maxCefr: state.settings.autoProgression
        ? stageInfo.maxCefr
        : state.settings.manualMaxCefr,
      stageInfo,
      masteredCount
    };
  }

  const api = {
    STORAGE_KEY,
    PASSIVE_MASTERY_THRESHOLD,
    DEFAULT_SETTINGS,
    getTodayKey,
    createDefaultState,
    mergeWithDefaults,
    loadState,
    saveState,
    countMastered,
    recordExposure,
    recordHover,
    setWordStatus,
    toggleStarred,
    countStarred,
    getEffectiveConfig
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.KontextStorage = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
