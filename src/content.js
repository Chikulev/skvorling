// Kontext v2.0 Content Script — TreeWalker, Deep Grammar Tooltip, Viewport Tracker & Word Navigator (Ctrl+F style)
(function () {
  'use strict';

  if (window.__KONTEXT_INITIALIZED__) return;
  window.__KONTEXT_INITIALIZED__ = true;

  const NLP = window.KontextNLP;
  const Storage = window.KontextStorage;
  const DICT = window.KONTEXT_DICTIONARY || [];
  const getActivePackEntries = window.getActivePackEntries || (() => []);

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED',
    'CODE', 'PRE', 'KBD', 'SAMP', 'VAR', 'TEXTAREA', 'INPUT',
    'SELECT', 'OPTION', 'BUTTON', 'SVG', 'MATH', 'CANVAS',
    'NAV', 'HEADER', 'FOOTER', 'HEAD', 'TITLE', 'META', 'LINK'
  ]);

  let state = null;
  let index = null;
  let effective = null;
  let pageUsedIds = new Set();
  let replacedCount = 0;
  let observer = null;
  let intersectionObserver = null;
  let mutationTimer = null;
  let pendingExposureSaves = new Set();
  let pendingExposureTimers = [];
  let saveDebounceTimer = null;

  // Tooltip state
  let tooltipEl = null;
  let activeSpan = null;
  let hoverOpenTimer = null;
  let hoverCloseTimer = null;

  // Word Navigator (Ctrl+F style) state
  let navEl = null;
  let navOpen = false;
  let navFilter = 'all'; // 'all' | 'learning'
  let navIndex = -1;
  let navActiveSpan = null;

  function isDomainExcluded(hostname, excludedList) {
    if (!hostname || !Array.isArray(excludedList)) return false;
    const h = hostname.toLowerCase();
    return excludedList.some((d) => {
      const dom = String(d || '').trim().toLowerCase();
      return dom && (h === dom || h.endsWith('.' + dom));
    });
  }

  function isNodeEditableOrSkipped(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.isContentEditable) return true;
      if (el.classList && (
        el.classList.contains('kontext-word') ||
        el.id === 'kontext-tooltip-root' ||
        el.id === 'kontext-navigator-root'
      )) {
        return true;
      }
      if (el.getAttribute && el.getAttribute('translate') === 'no') return true;
      el = el.parentElement;
    }
    return false;
  }

  function applyVisualStyleClass() {
    const rootEl = document.documentElement;
    rootEl.classList.remove('kontext-style-underline', 'kontext-style-pill', 'kontext-style-minimal');
    const style = (state && state.settings && state.settings.visualStyle) || 'underline';
    rootEl.classList.add('kontext-style-' + style);
  }

  function speakWord(text) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = (state && state.settings && state.settings.accent) || 'en-US';
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  function scheduleStateSave() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
      if (state) Storage.saveState(state);
    }, 600);
  }

  function updateBadge() {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        chrome.runtime.sendMessage({ type: 'KONTEXT_BADGE', count: replacedCount });
      } catch (_) {}
    }
    if (navOpen) updateNavigatorCounter();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ==================== Tooltip UI ====================
  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    const el = document.createElement('div');
    el.id = 'kontext-tooltip-root';
    el.className = 'kontext-tooltip';
    el.setAttribute('role', 'tooltip');
    el.style.display = 'none';

    el.addEventListener('mouseenter', () => clearTimeout(hoverCloseTimer));
    el.addEventListener('mouseleave', () => scheduleHideTooltip());

    document.documentElement.appendChild(el);
    tooltipEl = el;
    return el;
  }

  function renderTooltipContent(span) {
    const tip = ensureTooltip();
    const wordId = span.dataset.kontextId;
    const en = span.dataset.kontextEn;
    const surface = span.dataset.kontextSurface || en;
    const ru = span.dataset.kontextRu;
    const orig = span.dataset.kontextOriginal;
    const ipa = span.dataset.kontextIpa;
    const level = span.dataset.kontextLevel;
    const cueMatched = span.dataset.kontextCue === '1';
    const grammar = span.dataset.kontextGrammar || '';
    const utility = Number(span.dataset.kontextUtility) || 3;

    const prog = (state && state.progress && state.progress[wordId]) || {
      seen: 1,
      hovers: 0,
      cleanStreak: 0,
      status: 'learning'
    };

    const threshold = Storage.PASSIVE_MASTERY_THRESHOLD;
    const pct = prog.status === 'mastered'
      ? 100
      : Math.min(100, Math.round(((prog.cleanStreak || 0) / threshold) * 100));

    const statusLabel = prog.status === 'mastered'
      ? '✓ Освоено'
      : `Прогресс: ${prog.cleanStreak || 0}/${threshold}`;

    const baseDiffers = surface.toLowerCase() !== en.toLowerCase();

    tip.innerHTML = `
      <div class="kt-header">
        <div class="kt-word-group">
          <span class="kt-en">${escapeHtml(surface)}</span>
          ${state.settings.showIpa && ipa ? `<span class="kt-ipa">${escapeHtml(ipa)}</span>` : ''}
        </div>
        <div class="kt-badges">
          ${utility >= 5 ? `<span class="kt-badge kt-core" title="Базовое слово высокой полезности">★ База</span>` : ''}
          <span class="kt-badge kt-level-${escapeHtml(level)}">${escapeHtml(level)}</span>
        </div>
      </div>
      <div class="kt-translation">
        <span class="kt-ru">${escapeHtml(orig)}${orig.toLowerCase() !== ru.toLowerCase() ? ` <small class="kt-lemma">(${escapeHtml(ru)})</small>` : ''}</span>
        ${grammar ? `<span class="kt-grammar">Форма: ${escapeHtml(grammar)}${baseDiffers ? ` · база: ${escapeHtml(en)}` : ''}</span>` : ''}
      </div>
      ${state.settings.showCueBadge && cueMatched ? `<div class="kt-cue">💡 Понятно из контекста предложения</div>` : ''}
      <div class="kt-progress-row">
        <div class="kt-bar"><div class="kt-bar-fill" style="width:${pct}%"></div></div>
        <span class="kt-status">${statusLabel}</span>
      </div>
      <div class="kt-actions">
        <button type="button" class="kt-btn kt-btn-speak" data-action="speak" title="Озвучить">🔊</button>
        <button type="button" class="kt-btn kt-btn-star ${prog.starred ? 'is-starred' : ''}" data-action="star" title="${prog.starred ? 'Убрать из избранного' : 'В избранное (активное изучение)'}">${prog.starred ? '⭐' : '☆'}</button>
        <button type="button" class="kt-btn kt-btn-know" data-action="know" title="Отметить как изученное">✓ Знаю</button>
        <button type="button" class="kt-btn kt-btn-hide" data-action="hide" title="Больше не переводить">✕</button>
      </div>
    `;

    tip.querySelector('[data-action="speak"]').addEventListener('click', (e) => {
      e.stopPropagation();
      speakWord(surface);
    });

    tip.querySelector('[data-action="star"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const nowStarred = Storage.toggleStarred(state, wordId);
      scheduleStateSave();
      span.classList.toggle('kontext-starred', nowStarred);
      renderTooltipContent(span);
    });

    tip.querySelector('[data-action="know"]').addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.setWordStatus(state, wordId, 'mastered');
      scheduleStateSave();
      if (state.settings.hideMasteredWords !== false) {
        hideTooltipNow();
        document.querySelectorAll(`.kontext-word[data-kontext-id="${CSS.escape(wordId)}"]`).forEach((node) => {
          node.replaceWith(document.createTextNode(node.dataset.kontextOriginal || ''));
          replacedCount = Math.max(0, replacedCount - 1);
        });
        updateBadge();
      } else {
        span.classList.add('kontext-mastered');
        renderTooltipContent(span);
        if (navOpen) updateNavigatorCounter();
      }
    });

    tip.querySelector('[data-action="hide"]').addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.setWordStatus(state, wordId, 'hidden');
      scheduleStateSave();
      hideTooltipNow();
      document.querySelectorAll(`.kontext-word[data-kontext-id="${CSS.escape(wordId)}"]`).forEach((node) => {
        node.replaceWith(document.createTextNode(node.dataset.kontextOriginal || ''));
        replacedCount = Math.max(0, replacedCount - 1);
      });
      updateBadge();
    });
  }

  function positionTooltip(span) {
    const tip = ensureTooltip();
    tip.style.display = 'block';
    tip.style.visibility = 'hidden';

    const rect = span.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const pad = 10;

    let top = rect.top - tipRect.height - 10;
    if (top < pad) top = rect.bottom + 10;

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    const maxLeft = window.innerWidth - tipRect.width - pad;
    left = Math.max(pad, Math.min(left, maxLeft));

    tip.style.top = `${Math.round(top)}px`;
    tip.style.left = `${Math.round(left)}px`;
    tip.style.visibility = 'visible';
  }

  function showTooltipFor(span, countAsHover = true) {
    activeSpan = span;
    const wordId = span.dataset.kontextId;

    if (countAsHover && !span.dataset.kontextHovered) {
      span.dataset.kontextHovered = '1';
      Storage.recordHover(state, wordId);
      scheduleStateSave();
    }

    renderTooltipContent(span);
    positionTooltip(span);

    if (countAsHover && state.settings.autoSpeakOnHover) {
      speakWord(span.dataset.kontextSurface || span.dataset.kontextEn);
    }
  }

  function scheduleHideTooltip() {
    clearTimeout(hoverOpenTimer);
    clearTimeout(hoverCloseTimer);
    hoverCloseTimer = setTimeout(() => hideTooltipNow(), 220);
  }

  function hideTooltipNow() {
    clearTimeout(hoverOpenTimer);
    clearTimeout(hoverCloseTimer);
    if (tooltipEl) tooltipEl.style.display = 'none';
    activeSpan = null;
  }

  // ==================== Word Navigator (Ctrl+F style) ====================
  function getNavigableSpans() {
    const all = Array.from(document.querySelectorAll('.kontext-word')).filter(
      (el) => el.offsetParent !== null
    );
    if (navFilter === 'learning') {
      return all.filter((el) => !el.classList.contains('kontext-mastered'));
    }
    return all;
  }

  function ensureNavigator() {
    if (navEl) return navEl;
    const el = document.createElement('div');
    el.id = 'kontext-navigator-root';
    el.className = 'kontext-nav';
    el.style.display = 'none';
    el.innerHTML = `
      <span class="kn-brand" title="Skvorling">🐦</span>
      <span class="kn-counter" id="knCounter">0 / 0</span>
      <button type="button" class="kn-filter" id="knFilter" title="Переключить фильтр: все или только изучаемые">Все</button>
      <div class="kn-divider"></div>
      <button type="button" class="kn-btn" id="knPrev" title="Предыдущее слово (Shift+Enter / ↑)">↑</button>
      <button type="button" class="kn-btn" id="knNext" title="Следующее слово (Enter / ↓)">↓</button>
      <button type="button" class="kn-btn" id="knSpeak" title="Озвучить текущее слово">🔊</button>
      <button type="button" class="kn-btn" id="knShuffle" title="Перетасовать слова на странице (рандомайзер)">🎲</button>
      <button type="button" class="kn-btn kn-close" id="knClose" title="Закрыть (Esc)">✕</button>
    `;

    document.documentElement.appendChild(el);
    navEl = el;

    el.querySelector('#knPrev').addEventListener('click', () => jumpNavigator(-1));
    el.querySelector('#knNext').addEventListener('click', () => jumpNavigator(1));
    el.querySelector('#knSpeak').addEventListener('click', () => {
      if (navActiveSpan) speakWord(navActiveSpan.dataset.kontextSurface || navActiveSpan.dataset.kontextEn);
    });
    el.querySelector('#knFilter').addEventListener('click', () => {
      navFilter = navFilter === 'all' ? 'learning' : 'all';
      el.querySelector('#knFilter').textContent = navFilter === 'all' ? 'Все' : 'Новые';
      navIndex = -1;
      jumpNavigator(1);
    });
    el.querySelector('#knShuffle').addEventListener('click', async () => {
      restoreAll();
      await run();
      navIndex = -1;
      jumpNavigator(1);
    });
    el.querySelector('#knClose').addEventListener('click', () => closeNavigator());

    return el;
  }

  function updateNavigatorCounter() {
    if (!navEl) return;
    const spans = getNavigableSpans();
    const counter = navEl.querySelector('#knCounter');
    if (spans.length === 0) {
      counter.textContent = '0 / 0';
    } else {
      const displayIdx = navIndex >= 0 && navIndex < spans.length ? navIndex + 1 : 0;
      counter.textContent = `${displayIdx} / ${spans.length}`;
    }
  }

  function jumpNavigator(delta) {
    const spans = getNavigableSpans();
    if (navActiveSpan) {
      navActiveSpan.classList.remove('kontext-nav-active');
      navActiveSpan = null;
    }
    if (spans.length === 0) {
      navIndex = -1;
      updateNavigatorCounter();
      return;
    }

    if (navIndex < 0) {
      navIndex = delta >= 0 ? 0 : spans.length - 1;
    } else {
      navIndex = (navIndex + delta + spans.length) % spans.length;
    }

    const target = spans[navIndex];
    navActiveSpan = target;
    target.classList.add('kontext-nav-active');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    updateNavigatorCounter();

    // Show tooltip gently after scroll settles without penalizing mastery
    setTimeout(() => {
      if (navOpen && navActiveSpan === target && document.body.contains(target)) {
        showTooltipFor(target, false);
      }
    }, 280);
  }

  function openNavigator() {
    const el = ensureNavigator();
    navOpen = true;
    el.style.display = 'flex';
    navIndex = -1;
    jumpNavigator(1);
  }

  function closeNavigator() {
    navOpen = false;
    if (navEl) navEl.style.display = 'none';
    if (navActiveSpan) {
      navActiveSpan.classList.remove('kontext-nav-active');
      navActiveSpan = null;
    }
    hideTooltipNow();
  }

  document.addEventListener('keydown', (e) => {
    if (!navOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNavigator();
    } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      jumpNavigator(e.shiftKey ? -1 : 1);
    } else if (e.key === 'ArrowUp') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      jumpNavigator(-1);
    }
  });

  // ==================== Viewport Exposure Observer ====================
  function setupIntersectionObserver() {
    if (intersectionObserver) intersectionObserver.disconnect();
    if (typeof IntersectionObserver === 'undefined') return;

    intersectionObserver = new IntersectionObserver((entries) => {
      for (const ioEntry of entries) {
        if (!ioEntry.isIntersecting) continue;
        const span = ioEntry.target;
        intersectionObserver.unobserve(span);

        const tid = setTimeout(() => {
          if (!document.body.contains(span)) return;
          if (span.dataset.kontextHovered === '1') return;
          const wordId = span.dataset.kontextId;
          if (!wordId || pendingExposureSaves.has(wordId)) return;
          pendingExposureSaves.add(wordId);
          Storage.recordExposure(state, wordId);
          scheduleStateSave();
        }, 1500);
        pendingExposureTimers.push(tid);
      }
    }, { threshold: 0.6 });
  }

  // ==================== DOM Processing ====================
  function processTextNode(textNode) {
    if (!textNode || !textNode.nodeValue || textNode.nodeValue.length < 25) return;
    if (isNodeEditableOrSkipped(textNode)) return;

    const text = textNode.nodeValue;
    const replacements = NLP.analyzeText(text, index, {
      minSentenceWords: effective.minSentenceWords,
      maxPerSentence: effective.maxPerSentence,
      minWordGap: effective.minWordGap,
      maxCefr: effective.maxCefr,
      useRandomizer: effective.useRandomizer,
      smartGrammar: effective.smartGrammar,
      hideMasteredWords: effective.hideMasteredWords,
      usePhrases: effective.usePhrases,
      progressMap: state.progress,
      pageUsedIds
    });

    if (replacements.length === 0) return;

    const frag = document.createDocumentFragment();
    let cursor = 0;

    for (const rep of replacements) {
      if (rep.start > cursor) {
        frag.appendChild(document.createTextNode(text.slice(cursor, rep.start)));
      }

      const span = document.createElement('span');
      span.className = 'kontext-word';
      const prog = state.progress[rep.entry.id];
      if (prog && prog.status === 'mastered') {
        span.classList.add('kontext-mastered');
      }
      if (prog && prog.starred) {
        span.classList.add('kontext-starred');
      }
      span.textContent = rep.replacement;
      span.dataset.kontextId = rep.entry.id;
      span.dataset.kontextEn = rep.entry.en;
      span.dataset.kontextSurface = rep.replacement;
      span.dataset.kontextRu = rep.entry.ru;
      span.dataset.kontextOriginal = rep.original;
      span.dataset.kontextIpa = rep.entry.ipa || '';
      span.dataset.kontextLevel = rep.entry.level || 'A1';
      span.dataset.kontextCue = rep.cueMatched ? '1' : '0';
      span.dataset.kontextGrammar = rep.grammarLabel || '';
      span.dataset.kontextUtility = String(rep.utility || 3);

      span.addEventListener('mouseenter', () => {
        clearTimeout(hoverCloseTimer);
        clearTimeout(hoverOpenTimer);
        hoverOpenTimer = setTimeout(() => showTooltipFor(span, true), 180);
      });

      span.addEventListener('mouseleave', () => scheduleHideTooltip());

      span.addEventListener('click', (e) => {
        if (e.altKey) {
          e.preventDefault();
          e.stopPropagation();
          const showingOrig = span.dataset.kontextShowingOrig === '1';
          span.textContent = showingOrig ? rep.replacement : rep.original;
          span.dataset.kontextShowingOrig = showingOrig ? '0' : '1';
          return;
        }
        speakWord(rep.replacement);
      });

      frag.appendChild(span);
      if (intersectionObserver) intersectionObserver.observe(span);
      replacedCount++;
      cursor = rep.end;
    }

    if (cursor < text.length) {
      frag.appendChild(document.createTextNode(text.slice(cursor)));
    }

    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(frag, textNode);
    }
  }

  function processSubtree(rootNode) {
    if (!rootNode) return;
    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || node.nodeValue.length < 25) return NodeFilter.FILTER_REJECT;
          if (!/[А-Яа-яЁё]{3,}/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
          if (isNodeEditableOrSkipped(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    let current;
    while ((current = walker.nextNode())) {
      nodes.push(current);
    }

    for (const n of nodes) {
      processTextNode(n);
    }
    updateBadge();
  }

  function restoreAll() {
    hideTooltipNow();
    if (navActiveSpan) {
      navActiveSpan.classList.remove('kontext-nav-active');
      navActiveSpan = null;
    }
    if (observer) observer.disconnect();
    if (intersectionObserver) intersectionObserver.disconnect();

    pendingExposureTimers.forEach((tid) => clearTimeout(tid));
    pendingExposureTimers = [];

    const affectedParents = new Set();
    document.querySelectorAll('.kontext-word').forEach((span) => {
      const parent = span.parentNode;
      if (parent) affectedParents.add(parent);
      const orig = span.dataset.kontextOriginal || span.textContent;
      span.replaceWith(document.createTextNode(orig));
    });

    // CRITICAL: Re-merge adjacent TextNodes so subsequent reshuffles see full unbroken sentences!
    affectedParents.forEach((p) => {
      if (p && typeof p.normalize === 'function') p.normalize();
    });

    replacedCount = 0;
    pageUsedIds.clear();
    pendingExposureSaves.clear();
    updateBadge();
  }

  function setupMutationObserver() {
    if (observer) observer.disconnect();
    if (!document.body) return;

    const pendingNodes = new Set();
    observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        for (const node of mut.addedNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.id !== 'kontext-tooltip-root' &&
            node.id !== 'kontext-navigator-root' &&
            !node.classList.contains('kontext-word')
          ) {
            pendingNodes.add(node);
          }
        }
      }
      if (pendingNodes.size === 0) return;
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        const batch = Array.from(pendingNodes);
        pendingNodes.clear();
        for (const el of batch) {
          if (document.body.contains(el)) {
            processSubtree(el);
          }
        }
      }, 400);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function run() {
    state = await Storage.loadState();
    applyVisualStyleClass();

    const hostname = window.location.hostname;
    if (!state.settings.enabled || isDomainExcluded(hostname, state.settings.excludedDomains)) {
      restoreAll();
      return;
    }

    const packEntries = getActivePackEntries(state.settings.enabledPacks);
    // Fast page-language pre-check: skip English-only sites with 0ms overhead
    const sampleText = (document.body && document.body.innerText || '').slice(0, 2500);
    const cyrChars = (sampleText.match(/[А-Яа-яЁё]/g) || []).length;
    const latChars = (sampleText.match(/[A-Za-z]/g) || []).length;
    if (cyrChars < 30 || (cyrChars + latChars > 0 && cyrChars / (cyrChars + latChars) < 0.15)) {
      return;
    }
    index = NLP.buildIndex(DICT, state.customWords, packEntries);
    effective = Storage.getEffectiveConfig(state, NLP);

    setupIntersectionObserver();
    processSubtree(document.body);
    setupMutationObserver();
  }

  // Expose helper for built-in demo page
  window.KontextPageAPI = {
    setVisualStyle: async (styleName) => {
      const st = await Storage.loadState();
      st.settings.visualStyle = styleName;
      await Storage.saveState(st);
      state = st;
      applyVisualStyleClass();
    },
    openNavigator,
    closeNavigator,
    reshuffle: async () => {
      restoreAll();
      await run();
    }
  };

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (!msg) return;
      if (msg.type === 'KONTEXT_RELOAD') {
        restoreAll();
        run().then(() => sendResponse({ ok: true, count: replacedCount }));
        return true;
      }
      if (msg.type === 'KONTEXT_TOGGLE') {
        Storage.loadState().then(async (st) => {
          st.settings.enabled = !st.settings.enabled;
          await Storage.saveState(st);
          restoreAll();
          if (st.settings.enabled) await run();
          sendResponse({ enabled: st.settings.enabled, count: replacedCount });
        });
        return true;
      }
      if (msg.type === 'KONTEXT_OPEN_NAVIGATOR') {
        if (navOpen) closeNavigator();
        else openNavigator();
        sendResponse({ ok: true, open: navOpen, count: replacedCount });
        return false;
      }
      if (msg.type === 'KONTEXT_GET_PAGE_STATS') {
        sendResponse({ count: replacedCount, hostname: window.location.hostname });
        return false;
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!navOpen && tooltipEl && tooltipEl.style.display !== 'none') {
      hideTooltipNow();
    }
  }, { passive: true });

  run();
})();
