'use strict';

(async function initDemoControls() {
  const Storage = window.KontextStorage;
  let state = await Storage.loadState();

  const buttons = document.querySelectorAll('.pill-btn[data-density]');
  const btnAuto = document.getElementById('btnDemoAuto');
  const btnNav = document.getElementById('btnDemoNav');
  const themeGroup = document.getElementById('demoThemeGroup');
  const inlineStyleGroup = document.getElementById('inlineStyleGroup');

  function applyDemoTheme(t) {
    const valid = ['light', 'colorful', 'dark'].includes(t) ? t : 'colorful';
    document.body.dataset.theme = valid;
    if (themeGroup) {
      themeGroup.querySelectorAll('button[data-theme]').forEach((b) => {
        b.classList.toggle('active', b.dataset.theme === valid);
      });
    }
  }

  function syncActive() {
    applyDemoTheme((state.settings && state.settings.uiTheme) || 'colorful');
    buttons.forEach((b) => {
      const match = !state.settings.autoProgression &&
        Number(b.dataset.density) === Number(state.settings.manualMaxPerSentence);
      b.classList.toggle('active', match);
    });
    if (btnAuto) {
      btnAuto.classList.toggle('active', !!state.settings.autoProgression);
    }
    if (inlineStyleGroup) {
      const curStyle = (state.settings && state.settings.visualStyle) || 'underline';
      inlineStyleGroup.querySelectorAll('.style-pick').forEach((b) => {
        b.classList.toggle('active', b.dataset.style === curStyle);
      });
    }
  }

  syncActive();

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[Storage.STORAGE_KEY] && changes[Storage.STORAGE_KEY].newValue) {
        state = Storage.mergeWithDefaults(changes[Storage.STORAGE_KEY].newValue);
        syncActive();
      }
    });
  }

  if (themeGroup) {
    themeGroup.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      state = await Storage.loadState();
      state.settings.uiTheme = btn.dataset.theme;
      await Storage.saveState(state);
      applyDemoTheme(btn.dataset.theme);
    });
  }

  if (inlineStyleGroup) {
    inlineStyleGroup.addEventListener('click', async (e) => {
      const btn = e.target.closest('.style-pick[data-style]');
      if (!btn) return;
      if (window.KontextPageAPI && window.KontextPageAPI.setVisualStyle) {
        await window.KontextPageAPI.setVisualStyle(btn.dataset.style);
      }
      state = await Storage.loadState();
      syncActive();
    });
  }

  if (btnNav) {
    btnNav.addEventListener('click', () => {
      if (window.KontextPageAPI) window.KontextPageAPI.openNavigator();
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const st = await Storage.loadState();
      st.settings.enabled = true;
      st.settings.autoProgression = false;
      st.settings.manualMaxPerSentence = Number(btn.dataset.density);
      st.settings.manualMaxCefr = btn.dataset.cefr;
      await Storage.saveState(st);
      state = st;
      syncActive();
      if (window.KontextPageAPI) await window.KontextPageAPI.reshuffle();
    });
  });

  if (btnAuto) {
    btnAuto.addEventListener('click', async () => {
      const st = await Storage.loadState();
      st.settings.enabled = true;
      st.settings.autoProgression = true;
      await Storage.saveState(st);
      state = st;
      syncActive();
      if (window.KontextPageAPI) await window.KontextPageAPI.reshuffle();
    });
  }
})();
