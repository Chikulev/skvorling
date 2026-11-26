'use strict';

(async function initPopup() {
  const NLP = window.KontextNLP;
  const Storage = window.KontextStorage;

  let state = await Storage.loadState();
  let currentTab = null;
  let currentHost = '';

  const els = {
    toggleEnabled: document.getElementById('toggleEnabled'),
    siteDot: document.getElementById('siteDot'),
    siteHost: document.getElementById('siteHost'),
    btnNavigator: document.getElementById('btnNavigator'),
    btnToggleSite: document.getElementById('btnToggleSite'),
    statPage: document.getElementById('statPage'),
    statToday: document.getElementById('statToday'),
    statMastered: document.getElementById('statMastered'),
    statStreak: document.getElementById('statStreak'),
    stageTitle: document.getElementById('stageTitle'),
    stageCefr: document.getElementById('stageCefr'),
    stageDesc: document.getElementById('stageDesc'),
    stageBarFill: document.getElementById('stageBarFill'),
    stageNextNote: document.getElementById('stageNextNote'),
    chkAutoProg: document.getElementById('chkAutoProg'),
    chkRandomizer: document.getElementById('chkRandomizer'),
    chkSmartGrammar: document.getElementById('chkSmartGrammar'),
    chkHideMastered: document.getElementById('chkHideMastered'),
    chkUsePhrases: document.getElementById('chkUsePhrases'),
    packGroup: document.getElementById('packGroup'),
    manualControls: document.getElementById('manualControls'),
    lblManualDensity: document.getElementById('lblManualDensity'),
    rngManualDensity: document.getElementById('rngManualDensity'),
    cefrGroup: document.getElementById('cefrGroup'),
    themeGroup: document.getElementById('themeGroup'),
    styleGroup: document.getElementById('styleGroup'),
    btnDashboard: document.getElementById('btnDashboard'),
    btnDemo: document.getElementById('btnDemo')
  };

  async function notifyActiveTabReload() {
    if (!currentTab || !currentTab.id) return;
    try {
      const resp = await chrome.tabs.sendMessage(currentTab.id, { type: 'KONTEXT_RELOAD' });
      if (resp && typeof resp.count === 'number') {
        els.statPage.textContent = String(resp.count);
      }
    } catch (_) {}
  }

  function isHostPaused() {
    if (!currentHost) return false;
    return (state.settings.excludedDomains || []).some(
      (d) => d.toLowerCase() === currentHost.toLowerCase()
    );
  }

  function render() {
    const eff = Storage.getEffectiveConfig(state, NLP);
    const todayStats = (state.stats.daily && state.stats.daily[Storage.getTodayKey()]) || { seen: 0 };

    const curTheme = state.settings.uiTheme || 'colorful';
    document.body.dataset.theme = curTheme;
    if (els.themeGroup) {
      els.themeGroup.querySelectorAll('button[data-theme]').forEach((b) => b.classList.toggle('active', b.dataset.theme === curTheme));
    }
    els.toggleEnabled.checked = !!state.settings.enabled;
    els.statToday.textContent = String(todayStats.seen || 0);
    els.statMastered.textContent = String(eff.masteredCount);
    els.statStreak.textContent = `${state.stats.streakDays || 0} дн.`;

    if (currentHost) {
      els.siteHost.textContent = currentHost;
      const paused = isHostPaused();
      els.siteDot.classList.toggle('paused', paused || !state.settings.enabled);
      els.btnToggleSite.textContent = paused ? 'Включить' : 'Пауза';
      els.btnToggleSite.classList.toggle('is-paused', paused);
      els.btnToggleSite.disabled = false;
    } else {
      els.siteHost.textContent = 'Системная страница';
      els.siteDot.classList.add('paused');
      els.btnToggleSite.disabled = true;
    }

    const stage = eff.stageInfo;
    const nextStage = NLP.IMMERSION_STAGES.find((s) => s.stage === stage.stage + 1);
    els.stageTitle.textContent = `Уровень ${stage.stage} · ${stage.name}`;
    els.stageCefr.textContent = state.settings.autoProgression ? stage.maxCefr : state.settings.manualMaxCefr;
    els.stageDesc.textContent = state.settings.autoProgression
      ? stage.desc
      : `Ручной режим: до ${state.settings.manualMaxPerSentence} сл./предл. (${state.settings.manualMaxCefr})`;

    if (nextStage) {
      const span = nextStage.minMastered - stage.minMastered;
      const gained = Math.max(0, eff.masteredCount - stage.minMastered);
      const pct = Math.min(100, Math.round((gained / span) * 100));
      els.stageBarFill.style.width = `${pct}%`;
      els.stageNextNote.textContent = `До «${nextStage.name}»: ещё ${Math.max(0, nextStage.minMastered - eff.masteredCount)} освоенных слов`;
    } else {
      els.stageBarFill.style.width = '100%';
      els.stageNextNote.textContent = 'Максимальный уровень погружения достигнут!';
    }

    els.chkAutoProg.checked = !!state.settings.autoProgression;
    els.chkRandomizer.checked = state.settings.useRandomizer !== false;
    els.chkSmartGrammar.checked = state.settings.smartGrammar !== false;
    els.chkHideMastered.checked = state.settings.hideMasteredWords !== false;
    if (els.chkUsePhrases) els.chkUsePhrases.checked = state.settings.usePhrases !== false;
    const activePacks = new Set(state.settings.enabledPacks || []);
    els.packGroup.querySelectorAll('button[data-pack]').forEach((btn) => {
      btn.classList.toggle('active', activePacks.has(btn.dataset.pack));
    });

    els.manualControls.classList.toggle('hidden', !!state.settings.autoProgression);
    els.rngManualDensity.value = String(state.settings.manualMaxPerSentence || 2);
    els.lblManualDensity.textContent = String(state.settings.manualMaxPerSentence || 2);

    els.cefrGroup.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.cefr === state.settings.manualMaxCefr);
    });

    els.styleGroup.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.style === state.settings.visualStyle);
    });
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab || null;
    if (tab && tab.url && /^https?:/.test(tab.url)) {
      currentHost = new URL(tab.url).hostname;
    }
    if (tab && tab.id) {
      const stats = await chrome.tabs.sendMessage(tab.id, { type: 'KONTEXT_GET_PAGE_STATS' }).catch(() => null);
      if (stats && typeof stats.count === 'number') {
        els.statPage.textContent = String(stats.count);
      }
    }
  } catch (_) {}

  render();

  els.toggleEnabled.addEventListener('change', async () => {
    state.settings.enabled = els.toggleEnabled.checked;
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.btnNavigator.addEventListener('click', async () => {
    if (!currentTab || !currentTab.id) return;
    try {
      await chrome.tabs.sendMessage(currentTab.id, { type: 'KONTEXT_OPEN_NAVIGATOR' });
      window.close();
    } catch (_) {}
  });

  els.btnToggleSite.addEventListener('click', async () => {
    if (!currentHost) return;
    const list = new Set((state.settings.excludedDomains || []).map((d) => d.toLowerCase()));
    const hostLow = currentHost.toLowerCase();
    if (list.has(hostLow)) list.delete(hostLow);
    else list.add(hostLow);
    state.settings.excludedDomains = Array.from(list);
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.chkAutoProg.addEventListener('change', async () => {
    state.settings.autoProgression = els.chkAutoProg.checked;
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.chkRandomizer.addEventListener('change', async () => {
    state.settings.useRandomizer = els.chkRandomizer.checked;
    await Storage.saveState(state);
    notifyActiveTabReload();
  });

  els.chkSmartGrammar.addEventListener('change', async () => {
    state.settings.smartGrammar = els.chkSmartGrammar.checked;
    await Storage.saveState(state);
    notifyActiveTabReload();
  });

  els.chkHideMastered.addEventListener('change', async () => {
    state.settings.hideMasteredWords = els.chkHideMastered.checked;
    await Storage.saveState(state);
    notifyActiveTabReload();
  });

  if (els.chkUsePhrases) {
    els.chkUsePhrases.addEventListener('change', async () => {
      state.settings.usePhrases = els.chkUsePhrases.checked;
      await Storage.saveState(state);
      notifyActiveTabReload();
    });
  }

  els.packGroup.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-pack]');
    if (!btn) return;
    const set = new Set(state.settings.enabledPacks || []);
    if (set.has(btn.dataset.pack)) set.delete(btn.dataset.pack);
    else set.add(btn.dataset.pack);
    state.settings.enabledPacks = Array.from(set);
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.rngManualDensity.addEventListener('input', () => {
    els.lblManualDensity.textContent = els.rngManualDensity.value;
  });

  els.rngManualDensity.addEventListener('change', async () => {
    state.settings.manualMaxPerSentence = Number(els.rngManualDensity.value);
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.cefrGroup.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-cefr]');
    if (!btn) return;
    state.settings.manualMaxCefr = btn.dataset.cefr;
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  if (els.themeGroup) {
    els.themeGroup.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      state.settings.uiTheme = btn.dataset.theme;
      await Storage.saveState(state);
      render();
    });
  }

  els.styleGroup.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-style]');
    if (!btn) return;
    state.settings.visualStyle = btn.dataset.style;
    await Storage.saveState(state);
    render();
    notifyActiveTabReload();
  });

  els.btnDashboard.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  els.btnDemo.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('demo/demo.html') });
  });

  const btnLanding = document.getElementById('btnLanding');
  if (btnLanding) {
    btnLanding.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('landing/landing.html') });
    });
  }
})();
