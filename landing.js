'use strict';

(async function initLanding() {
  const NLP = window.KontextNLP;
  const Storage = window.KontextStorage;
  const DICT = window.KONTEXT_DICTIONARY || [];
  const getActivePackEntries = window.getActivePackEntries || (() => []);

  // ==================== 1. WORKING 3-THEME SWITCHER + POPUP SYNC ====================
  const lpThemeSwitcher = document.getElementById('lpThemeSwitcher');

  function applyTheme(theme) {
    const valid = ['light', 'colorful', 'dark'].includes(theme) ? theme : 'colorful';
    document.body.dataset.theme = valid;
    try { localStorage.setItem('skvorling_lp_theme', valid); } catch (_) {}
    if (lpThemeSwitcher) {
      lpThemeSwitcher.querySelectorAll('button[data-theme]').forEach((b) => {
        b.classList.toggle('active', b.dataset.theme === valid);
      });
    }
  }

  // Load initial theme from chrome.storage (synced with popup!) or localStorage
  if (Storage && typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const st = await Storage.loadState();
    applyTheme((st.settings && st.settings.uiTheme) || 'colorful');

    // Live sync when user changes theme in the Popup or Dashboard!
    if (chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[Storage.STORAGE_KEY] && changes[Storage.STORAGE_KEY].newValue) {
          const nextTheme = changes[Storage.STORAGE_KEY].newValue.settings &&
            changes[Storage.STORAGE_KEY].newValue.settings.uiTheme;
          if (nextTheme) applyTheme(nextTheme);
        }
      });
    }
  } else {
    let saved = 'colorful';
    try { saved = localStorage.getItem('skvorling_lp_theme') || 'colorful'; } catch (_) {}
    applyTheme(saved);
  }

  if (lpThemeSwitcher) {
    lpThemeSwitcher.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      const chosen = btn.dataset.theme;
      applyTheme(chosen);
      if (Storage && typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const st = await Storage.loadState();
        st.settings.uiTheme = chosen;
        await Storage.saveState(st);
      }
    });
  }

  // ==================== 2. LIVING MOTION: EYE-TRACKING, 3D TILT, PARALLAX, SCROLL REVEAL ====================
  const starlingSvg = document.getElementById('heroStarling');
  const starlingPupil = document.getElementById('starlingPupil');
  const heroTiltCard = document.getElementById('heroTiltCard');
  const floatChips = Array.from(document.querySelectorAll('.float-chip'));
  const scrollProgress = document.getElementById('scrollProgress');

  // Cursor-tracking Starling eye + gentle mascot parallax
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;  // -1 .. 1
    const ny = (e.clientY / window.innerHeight) * 2 - 1;

    if (starlingPupil) {
      starlingPupil.setAttribute('transform', `translate(${(nx * 6).toFixed(1)}, ${(ny * 5).toFixed(1)})`);
    }
    if (starlingSvg) {
      const scrollY = window.scrollY || 0;
      starlingSvg.style.transform = `translate3d(${(nx * -8).toFixed(1)}px, ${(ny * -6).toFixed(1)}px, 0) rotate(${(nx * 2.5).toFixed(2)}deg)`;
    }
  }, { passive: true });

  // 3D Perspective Tilt + Specular Sheen on Hero Browser Mockup
  if (heroTiltCard) {
    heroTiltCard.addEventListener('mousemove', (e) => {
      const rect = heroTiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotY = (px - 0.5) * 9;
      const rotX = (0.5 - py) * 7;
      heroTiltCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      heroTiltCard.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      heroTiltCard.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
    heroTiltCard.addEventListener('mouseleave', () => {
      heroTiltCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // Cursor-following radial glow on Bento / Step / Install cards
  document.querySelectorAll('.glow-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // Scroll Progress Bar + Parallax chips
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || 0;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docH > 0) {
      scrollProgress.style.width = `${Math.min(100, (scrollY / docH) * 100).toFixed(1)}%`;
    }
    floatChips.forEach((chip) => {
      const spd = Number(chip.dataset.speed) || 0.15;
      chip.style.transform = `translateY(${(scrollY * spd).toFixed(1)}px)`;
    });
    tipEl.hidden = true;
  }, { passive: true });

  // Scroll-triggered Reveal Observer
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => revObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // ==================== 3. LIVE NLP HERO MOCKUP, PROGRESSION SIM & PLAYGROUND ====================
  const HERO_PARAGRAPHS = [
    'Каждое раннее утро я залил кипятком чай и аккуратно поставил его на свой рабочий стол рядом с открытым окном, чтобы спокойно начать новый день.',
    'Когда опытный разработчик работает над сложной системой, он каждый день читает документацию и понимает, почему такой подход оказывается быстрее и проще старых методов.',
    'Утром мастер собрал деревянную деталь рукой и проверил качество, потому что вечером клиенту нужно отправить готовый заказ поездом.'
  ];

  const PROG_SENTENCE = 'Каждое раннее утро опытный разработчик заливает кипятком горячий чай, открывает большое окно и проверяет важные сообщения от команды, чтобы спокойно начать сложный рабочий проект и сохранить хороший баланс на всю неделю.';

  const PRESETS = {
    morning: {
      packs: [],
      text: 'Каждое раннее утро я залил кипятком чай и аккуратно поставил его на свой рабочий стол рядом с открытым окном. Пока горячий кофе остывает в любимой кружке, я открываю ноутбук, проверяю важные сообщения от команды и составляю простой список задач на всю неделю.'
    },
    tech: {
      packs: ['tech'],
      text: 'Новый орбитальный спутник передаёт данные на удалённый сервер, пока чувствительный датчик проверяет свежую прошивку модуля. Если алгоритм замечает высокую нагрузку или задержку сигнала, система автоматически сохраняет резервную копию архива.'
    },
    grammar: {
      packs: [],
      text: 'Когда инженер работает над новым проектом, он внимательно читает документацию и понимает, почему современный подход работает быстрее и проще. Вчера он долго работал над кодом и открыл дверь ключом, а сегодня работающий сервис экономит команде несколько часов.'
    },
    business: {
      packs: ['business'],
      text: 'Перед запуском новой рекламной кампании команда проверила прогноз выручки, маржу и условия контракта с главным поставщиком. Быстрая отгрузка партии на склад помогла снизить риск задержки и увеличить конверсию клиентов.'
    }
  };

  let heroDensity = 3;
  let heroCefr = 'B1';
  let heroShowOriginal = false;
  let currentPreset = 'morning';
  const demoMasteredIds = new Set();

  const tipEl = document.getElementById('lpTooltip');
  let hideTipTimer = null;

  function speak(word) {
    if (!('speechSynthesis' in window) || !word) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  tipEl.addEventListener('mouseenter', () => clearTimeout(hideTipTimer));
  tipEl.addEventListener('mouseleave', () => scheduleHideTip());

  function showTip(span) {
    clearTimeout(hideTipTimer);
    const id = span.dataset.id;
    const en = span.dataset.en;
    const ipa = span.dataset.ipa;
    const lvl = span.dataset.lvl;
    const orig = span.dataset.orig;
    const ru = span.dataset.ru;
    const gram = span.dataset.gram;
    const allowKnow = span.dataset.allowKnow === '1';

    tipEl.innerHTML = `
      <div class="lp-tip-head">
        <div>
          <span class="lp-tip-en">${escapeHtml(en)}</span>
          ${ipa ? `<span class="lp-tip-ipa">${escapeHtml(ipa)}</span>` : ''}
        </div>
        <span class="lp-tip-lvl">${escapeHtml(lvl)}</span>
      </div>
      <div class="lp-tip-ru">${escapeHtml(orig)}${orig.toLowerCase() !== ru.toLowerCase() ? ` (${escapeHtml(ru)})` : ''}</div>
      ${gram ? `<div class="lp-tip-gram">Форма: ${escapeHtml(gram)}</div>` : ''}
      <div class="lp-tip-actions">
        <button type="button" class="lp-tip-btn" data-act="speak">🔊 Озвучить</button>
        ${allowKnow ? `<button type="button" class="lp-tip-btn lp-tip-know" data-act="know">✓ Знаю (скрыть)</button>` : ''}
      </div>
    `;

    tipEl.querySelector('[data-act="speak"]').addEventListener('click', () => speak(en));
    const knowBtn = tipEl.querySelector('[data-act="know"]');
    if (knowBtn) {
      knowBtn.addEventListener('click', () => {
        demoMasteredIds.add(id);
        tipEl.hidden = true;
        renderHero();
      });
    }

    tipEl.hidden = false;
    const rect = span.getBoundingClientRect();
    const tRect = tipEl.getBoundingClientRect();
    let top = rect.top - tRect.height - 10;
    if (top < 10) top = rect.bottom + 10;
    let left = rect.left + rect.width / 2 - tRect.width / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - tRect.width - 10));
    tipEl.style.top = `${Math.round(top)}px`;
    tipEl.style.left = `${Math.round(left)}px`;
  }

  function scheduleHideTip() {
    clearTimeout(hideTipTimer);
    hideTipTimer = setTimeout(() => { tipEl.hidden = true; }, 220);
  }

  function buildProgressMapFromDemoMastered() {
    const map = {};
    for (const id of demoMasteredIds) {
      map[id] = { status: 'mastered', seen: 5, hovers: 0, cleanStreak: 5 };
    }
    return map;
  }

  function renderTransformedParagraphs(container, paragraphs, opts) {
    const idx = NLP.buildIndex(DICT, [], getActivePackEntries(opts.packs || []));
    const pageUsedIds = new Set();
    let totalReplaced = 0;

    container.innerHTML = '';
    for (const para of paragraphs) {
      const pEl = document.createElement('p');
      if (opts.rawOriginal) {
        pEl.textContent = para;
        container.appendChild(pEl);
        continue;
      }

      const reps = NLP.analyzeText(para, idx, {
        minSentenceWords: 6,
        maxPerSentence: opts.density,
        minWordGap: 2,
        maxCefr: opts.cefr,
        useRandomizer: opts.useRandomizer,
        smartGrammar: true,
        hideMasteredWords: !!opts.hideMastered,
        progressMap: opts.progressMap || {},
        pageUsedIds
      });

      let cursor = 0;
      for (const rep of reps) {
        if (rep.start > cursor) {
          pEl.appendChild(document.createTextNode(para.slice(cursor, rep.start)));
        }
        const span = document.createElement('span');
        span.className = 'lp-word';
        span.textContent = rep.replacement;
        span.dataset.id = rep.entry.id;
        span.dataset.en = rep.replacement;
        span.dataset.ipa = rep.entry.ipa || '';
        span.dataset.lvl = rep.entry.level || 'A1';
        span.dataset.orig = rep.original;
        span.dataset.ru = rep.entry.ru;
        span.dataset.gram = rep.grammarLabel || '';
        span.dataset.allowKnow = opts.allowKnow ? '1' : '0';

        span.addEventListener('mouseenter', () => showTip(span));
        span.addEventListener('mouseleave', scheduleHideTip);
        span.addEventListener('click', () => speak(rep.replacement));

        pEl.appendChild(span);
        totalReplaced++;
        cursor = rep.end;
      }
      if (cursor < para.length) {
        pEl.appendChild(document.createTextNode(para.slice(cursor)));
      }
      container.appendChild(pEl);
    }
    return totalReplaced;
  }

  const heroResetBtn = document.getElementById('heroResetKnown');
  const heroKnownCount = document.getElementById('heroKnownCount');
  const heroCompareBtn = document.getElementById('heroCompareBtn');

  function renderHero() {
    const count = renderTransformedParagraphs(document.getElementById('heroArticle'), HERO_PARAGRAPHS, {
      density: heroDensity,
      cefr: heroCefr,
      useRandomizer: true,
      packs: [],
      rawOriginal: heroShowOriginal,
      hideMastered: true,
      allowKnow: true,
      progressMap: buildProgressMapFromDemoMastered()
    });
    document.getElementById('heroWordCount').textContent = String(count);
    heroKnownCount.textContent = String(demoMasteredIds.size);
    heroResetBtn.classList.toggle('hidden', demoMasteredIds.size === 0);
  }

  document.getElementById('heroDensity').addEventListener('click', (e) => {
    const btn = e.target.closest('.d-tab');
    if (!btn) return;
    heroShowOriginal = false;
    heroCompareBtn.classList.remove('active');
    document.querySelectorAll('#heroDensity .d-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    heroDensity = Number(btn.dataset.density);
    heroCefr = btn.dataset.cefr;
    renderHero();
  });

  heroCompareBtn.addEventListener('click', () => {
    heroShowOriginal = !heroShowOriginal;
    heroCompareBtn.classList.toggle('active', heroShowOriginal);
    renderHero();
  });

  heroResetBtn.addEventListener('click', () => {
    demoMasteredIds.clear();
    renderHero();
  });

  document.getElementById('heroShuffle').addEventListener('click', () => {
    heroShowOriginal = false;
    heroCompareBtn.classList.remove('active');
    renderHero();
  });

  // Progression Simulator
  const progSlider = document.getElementById('progSlider');
  const progBadge = document.getElementById('progBadge');
  const progDesc = document.getElementById('progDesc');
  const progPreview = document.getElementById('progPreview');

  function renderProgression() {
    const stageNum = Number(progSlider.value);
    const stage = NLP.IMMERSION_STAGES.find((s) => s.stage === stageNum) || NLP.IMMERSION_STAGES[0];
    progBadge.textContent = `Уровень ${stage.stage} · ${stage.name} (${stage.maxCefr})`;
    progDesc.textContent = stage.desc;
    renderTransformedParagraphs(progPreview, [PROG_SENTENCE], {
      density: stage.maxPerSentence,
      cefr: stage.maxCefr,
      useRandomizer: false,
      packs: []
    });
  }

  progSlider.addEventListener('input', renderProgression);

  // Live Playground + Easter Egg
  const pgInput = document.getElementById('pgInput');
  const pgOutput = document.getElementById('pgOutput');
  const pgStat = document.getElementById('pgStat');
  const pgRand = document.getElementById('pgRandomizer');

  function renderPlayground() {
    const text = pgInput.value.trim();
    if (/skvor\s+lingua/i.test(text)) {
      pgOutput.innerHTML = '<div class="easter-egg">🐦 Скворлинг: Я не «где», я рядом — и мы нашли, где живёт язык! (skvorling.ru)</div>';
      pgStat.textContent = 'Пасхалка найдена! 🎉';
      return;
    }
    if (!text) {
      pgOutput.textContent = 'Введите длинное русское предложение (от 6–7 слов), чтобы увидеть контекстный перевод.';
      pgStat.textContent = 'Заменено: 0 слов';
      return;
    }
    const presetObj = PRESETS[currentPreset] || PRESETS.morning;
    const paras = text.split(/\n+/).filter(Boolean);
    const count = renderTransformedParagraphs(pgOutput, paras, {
      density: 3,
      cefr: 'C1',
      useRandomizer: pgRand.checked,
      packs: presetObj.packs
    });
    pgStat.textContent = `Заменено: ${count} слов`;
  }

  document.getElementById('pgPresets').addEventListener('click', (e) => {
    const btn = e.target.closest('.pg-tab');
    if (!btn) return;
    document.querySelectorAll('#pgPresets .pg-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentPreset = btn.dataset.preset;
    pgInput.value = PRESETS[currentPreset].text;
    renderPlayground();
  });

  pgInput.addEventListener('input', renderPlayground);
  pgRand.addEventListener('change', renderPlayground);
  document.getElementById('pgRerun').addEventListener('click', renderPlayground);

  const copyBtn = document.getElementById('btnCopyExtUrl');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('chrome://extensions');
        copyBtn.textContent = '✓ Скопировано!';
        setTimeout(() => { copyBtn.textContent = '📋 Скопировать адрес'; }, 1800);
      } catch (_) {}
    });
  }

  pgInput.value = PRESETS.morning.text;
  renderHero();
  renderProgression();
  renderPlayground();
})();
