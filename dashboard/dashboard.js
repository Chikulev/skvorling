'use strict';

(async function initDashboard() {
  const NLP = window.KontextNLP;
  const Storage = window.KontextStorage;
  const DICT = window.KONTEXT_DICTIONARY || [];
  const PACKS = window.KONTEXT_PACKS || {};
  const getActivePackEntries = window.getActivePackEntries || (() => []);

  let state = await Storage.loadState();

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  function speak(word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = state.settings.accent || 'en-US';
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  // Navigation tabs
  document.getElementById('mainNav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });

  function renderOverview() {
    const eff = Storage.getEffectiveConfig(state, NLP);
    const today = (state.stats.daily && state.stats.daily[Storage.getTodayKey()]) || { seen: 0 };

    document.getElementById('ovStageChip').textContent = `Уровень ${eff.stageInfo.stage} · ${eff.stageInfo.name}`;
    document.getElementById('kpiMastered').textContent = String(eff.masteredCount);
    const activePackCount = getActivePackEntries(state.settings.enabledPacks).length;
    document.getElementById('kpiTotalDict').textContent = `из ${DICT.length + activePackCount + state.customWords.length} активных слов`;
    document.getElementById('kpiSeen').textContent = String(state.stats.totalSeen || 0);
    document.getElementById('kpiToday').textContent = `сегодня: ${today.seen || 0}`;
    document.getElementById('kpiHovers').textContent = String(state.stats.totalHovers || 0);
    document.getElementById('kpiStreak').textContent = String(state.stats.streakDays || 0);

    const total = (state.stats.totalSeen || 0) + (state.stats.totalHovers || 0);
    const acc = total > 0 ? Math.round(((state.stats.totalSeen || 0) / total) * 100) : null;
    document.getElementById('kpiAccuracy').textContent = acc !== null ? `без подсказки: ${acc}%` : 'пока нет данных';

    // CEFR bars
    const cefrEl = document.getElementById('cefrBars');
    cefrEl.innerHTML = '';
    for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      const words = DICT.filter((w) => w.level === lvl);
      const mastered = words.filter((w) => state.progress[w.id] && state.progress[w.id].status === 'mastered').length;
      const pct = words.length ? Math.round((mastered / words.length) * 100) : 0;
      const row = document.createElement('div');
      row.className = 'cefr-row';
      row.innerHTML = `
        <span class="cefr-tag">${lvl}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="cefr-num">${mastered} / ${words.length}</span>
      `;
      cefrEl.appendChild(row);
    }

    // Hard words
    const hardEl = document.getElementById('hardList');
    const hardWords = DICT
      .map((w) => ({ w, p: state.progress[w.id] }))
      .filter((x) => x.p && (x.p.hovers || 0) > 0 && x.p.status !== 'mastered' && x.p.status !== 'hidden')
      .sort((a, b) => (b.p.hovers || 0) - (a.p.hovers || 0))
      .slice(0, 6);

    if (hardWords.length === 0) {
      hardEl.innerHTML = '<div class="hard-meta">Пока нет сложных слов — читайте статьи, и здесь появятся слова, на которые вы наводили чаще всего.</div>';
    } else {
      hardEl.innerHTML = '';
      for (const { w, p } of hardWords) {
        const item = document.createElement('div');
        item.className = 'hard-item';
        item.innerHTML = `
          <div>
            <span class="hard-word">${w.en}</span> — ${w.ru}
            <div class="hard-meta">Подсказок: ${p.hovers} · ${w.level}</div>
          </div>
          <div>
            <button type="button" class="mini-btn" data-speak="${w.en}">🔊</button>
            <button type="button" class="mini-btn" data-know="${w.id}">✓ Знаю</button>
          </div>
        `;
        hardEl.appendChild(item);
      }
      hardEl.querySelectorAll('[data-speak]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.speak)));
      hardEl.querySelectorAll('[data-know]').forEach((b) => b.addEventListener('click', async () => {
        Storage.setWordStatus(state, b.dataset.know, 'mastered');
        await Storage.saveState(state);
        renderAll();
        showToast('Слово отмечено как освоенное');
      }));
    }

    // 7-Day Activity Chart
    const weekEl = document.getElementById('weekChart');
    if (weekEl) {
      weekEl.innerHTML = '';
      const days = [];
      let maxVal = 1;
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const val = (state.stats.daily && state.stats.daily[key] && state.stats.daily[key].seen) || 0;
        if (val > maxVal) maxVal = val;
        days.push({ label: d.toLocaleDateString('ru-RU', { weekday: 'short' }), val });
      }
      for (const item of days) {
        const hPct = Math.max(8, Math.round((item.val / maxVal) * 100));
        const col = document.createElement('div');
        col.className = 'wc-col';
        col.innerHTML = `<span class="wc-val">${item.val}</span><div class="wc-bar" style="height:${hPct}%"></div><span class="wc-day">${item.label}</span>`;
        weekEl.appendChild(col);
      }
    }

    // Roadmap
    const roadEl = document.getElementById('roadmapGrid');
    roadEl.innerHTML = '';
    for (const s of NLP.IMMERSION_STAGES) {
      const unlocked = eff.masteredCount >= s.minMastered;
      const isCurrent = eff.stageInfo.stage === s.stage;
      const card = document.createElement('div');
      card.className = `stage-card ${unlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}`;
      card.innerHTML = `
        <span class="stage-num">Уровень ${s.stage} · ${s.maxCefr}</span>
        <span class="stage-name">${s.name}</span>
        <span class="stage-meta">до ${s.maxPerSentence} сл./предл.</span>
        <span class="stage-meta">от ${s.minMastered} освоенных</span>
      `;
      roadEl.appendChild(card);
    }
  }

  function renderVocab() {
    const q = (document.getElementById('vocabSearch').value || '').trim().toLowerCase();
    const lvl = document.getElementById('vocabLevel').value;
    const stFilter = document.getElementById('vocabStatus').value;
    const tbody = document.getElementById('vocabBody');

    const rows = DICT.filter((w) => {
      if (lvl !== 'ALL' && w.level !== lvl) return false;
      const p = state.progress[w.id];
      const st = p ? p.status : 'new';
      if (stFilter !== 'ALL' && st !== stFilter) return false;
      if (q && !w.en.toLowerCase().includes(q) && !w.ru.toLowerCase().includes(q)) return false;
      return true;
    }).slice(0, 150);

    tbody.innerHTML = '';
    for (const w of rows) {
      const p = state.progress[w.id];
      const st = p ? p.status : 'new';
      const stText = { mastered: 'Освоено', learning: 'Изучаю', hidden: 'Скрыто', new: 'Новое' }[st];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="vocab-en">${w.en}</span><span class="vocab-ipa">${w.ipa || ''}</span></td>
        <td>${w.ru}</td>
        <td>${w.level}</td>
        <td>${p ? `${p.seen || 0} / ${p.hovers || 0}` : '0 / 0'}</td>
        <td><span class="pill pill-${st}">${stText}</span></td>
        <td>
          <button type="button" class="mini-btn" data-act="speak" data-en="${w.en}">🔊</button>
          <button type="button" class="mini-btn" data-act="star" data-id="${w.id}" title="В избранное">${p && p.starred ? '⭐' : '☆'}</button>
          <button type="button" class="mini-btn" data-act="mastered" data-id="${w.id}">✓</button>
          <button type="button" class="mini-btn" data-act="hidden" data-id="${w.id}">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

  document.getElementById('vocabBody').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    if (btn.dataset.act === 'speak') {
      speak(btn.dataset.en);
      return;
    }
    if (btn.dataset.act === 'star') {
      const nowS = Storage.toggleStarred(state, btn.dataset.id);
      await Storage.saveState(state);
      renderAll();
      showToast(nowS ? 'Добавлено в ⭐ Избранное' : 'Убрано из избранного');
      return;
    }
    Storage.setWordStatus(state, btn.dataset.id, btn.dataset.act);
    await Storage.saveState(state);
    renderAll();
    showToast('Статус слова обновлён');
  });

  ['vocabSearch', 'vocabLevel', 'vocabStatus'].forEach((id) => {
    document.getElementById(id).addEventListener('input', renderVocab);
  });

  // Custom words
  function renderCustom() {
    const list = document.getElementById('customList');
    document.getElementById('customCount').textContent = String(state.customWords.length);
    if (state.customWords.length === 0) {
      list.innerHTML = '<div class="hard-meta">Вы ещё не добавляли свои слова.</div>';
      return;
    }
    list.innerHTML = '';
    state.customWords.forEach((cw, idx) => {
      const div = document.createElement('div');
      div.className = 'hard-item';
      div.innerHTML = `
        <div><strong>${cw.en}</strong> — ${cw.ru} <span class="hard-meta">${cw.ipa || ''} ${cw.stem ? '(с окончаниями)' : '(точное)'}</span></div>
        <button type="button" class="mini-btn" data-del="${idx}">Удалить</button>
      `;
      list.appendChild(div);
    });
    list.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      state.customWords.splice(Number(b.dataset.del), 1);
      await Storage.saveState(state);
      renderAll();
      showToast('Слово удалено');
    }));
  }

  document.getElementById('customForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ru = document.getElementById('cwRu').value.trim();
    const en = document.getElementById('cwEn').value.trim();
    const ipa = document.getElementById('cwIpa').value.trim();
    const pos = document.getElementById('cwPos').value;
    const stem = document.getElementById('cwStem').checked;
    if (!ru || !en) return;
    state.customWords.push({ id: 'custom_' + Date.now(), ru, en, ipa, pos, stem });
    await Storage.saveState(state);
    e.target.reset();
    document.getElementById('cwStem').checked = true;
    renderAll();
    showToast('Слово добавлено в словарь');
  });

  // Settings
  function renderSettings() {
    const s = state.settings;
    document.getElementById('setMinWords').value = String(s.minSentenceWords);
    document.getElementById('lblMinWords').textContent = String(s.minSentenceWords);
    document.getElementById('setMinGap').value = String(s.minWordGap);
    document.getElementById('lblMinGap').textContent = String(s.minWordGap);
    document.getElementById('setAccent').value = s.accent || 'en-US';
    document.getElementById('setAutoSpeak').checked = !!s.autoSpeakOnHover;
    document.getElementById('setShowIpa').checked = !!s.showIpa;
    document.getElementById('setShowCue').checked = !!s.showCueBadge;
    document.getElementById('setRandomizer').checked = s.useRandomizer !== false;
    document.getElementById('setSmartGrammar').checked = s.smartGrammar !== false;
    document.getElementById('setHideMastered').checked = s.hideMasteredWords !== false;
    const csEl = document.getElementById('setCloudSync');
    if (csEl) csEl.checked = s.cloudSync !== false;
    const upEl = document.getElementById('setUsePhrases');
    if (upEl) upEl.checked = s.usePhrases !== false;
    const packsBox = document.getElementById('dashPacksList');
    if (packsBox) {
      const activeSet = new Set(s.enabledPacks || []);
      packsBox.innerHTML = '';
      Object.values(PACKS).forEach((p) => {
        const lbl = document.createElement('label');
        lbl.className = 'hard-item';
        lbl.style.cursor = 'pointer';
        lbl.innerHTML = `<div><strong>${p.icon} ${p.name}</strong><div class="hard-meta">${p.entries.length} слов · ${p.description}</div></div><input type="checkbox" data-dash-pack="${p.id}" ${activeSet.has(p.id) ? 'checked' : ''}>`;
        packsBox.appendChild(lbl);
      });
      packsBox.querySelectorAll('input[data-dash-pack]').forEach((inp) => {
        inp.addEventListener('change', () => {
          const next = new Set(state.settings.enabledPacks || []);
          if (inp.checked) next.add(inp.dataset.dashPack);
          else next.delete(inp.dataset.dashPack);
          saveSetting((st) => { st.enabledPacks = Array.from(next); });
          renderOverview();
        });
      });
    }
    document.getElementById('setUpdateUrl').value = s.updateManifestUrl || '';
    const ver = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : '2.0.0';
    document.getElementById('lblVersion').textContent = 'v' + ver;
    document.getElementById('setExcluded').value = (s.excludedDomains || []).join('\n');
  }

  async function saveSetting(fn) {
    fn(state.settings);
    await Storage.saveState(state);
    showToast('Настройки сохранены');
  }

  document.getElementById('setMinWords').addEventListener('input', (e) => {
    document.getElementById('lblMinWords').textContent = e.target.value;
  });
  document.getElementById('setMinWords').addEventListener('change', (e) => {
    saveSetting((s) => { s.minSentenceWords = Number(e.target.value); });
  });
  document.getElementById('setMinGap').addEventListener('input', (e) => {
    document.getElementById('lblMinGap').textContent = e.target.value;
  });
  document.getElementById('setMinGap').addEventListener('change', (e) => {
    saveSetting((s) => { s.minWordGap = Number(e.target.value); });
  });
  document.getElementById('setAccent').addEventListener('change', (e) => {
    saveSetting((s) => { s.accent = e.target.value; });
  });
  document.getElementById('setAutoSpeak').addEventListener('change', (e) => {
    saveSetting((s) => { s.autoSpeakOnHover = e.target.checked; });
  });
  document.getElementById('setShowIpa').addEventListener('change', (e) => {
    saveSetting((s) => { s.showIpa = e.target.checked; });
  });
  document.getElementById('setShowCue').addEventListener('change', (e) => {
    saveSetting((s) => { s.showCueBadge = e.target.checked; });
  });
  document.getElementById('btnSaveExcluded').addEventListener('click', () => {
    const raw = document.getElementById('setExcluded').value;
    const domains = raw.split(/\r?\n/).map((x) => x.trim().toLowerCase()).filter(Boolean);
    saveSetting((s) => { s.excludedDomains = domains; });
  });


  document.getElementById('setRandomizer').addEventListener('change', (e) => {
    saveSetting((s) => { s.useRandomizer = e.target.checked; });
  });
  document.getElementById('setSmartGrammar').addEventListener('change', (e) => {
    saveSetting((s) => { s.smartGrammar = e.target.checked; });
  });
  document.getElementById('setHideMastered').addEventListener('change', (e) => {
    saveSetting((s) => { s.hideMasteredWords = e.target.checked; });
  });
  const setCloudSyncEl = document.getElementById('setCloudSync');
  if (setCloudSyncEl) {
    setCloudSyncEl.addEventListener('change', (e) => {
      saveSetting((s) => { s.cloudSync = e.target.checked; });
    });
  }

  // Prefill custom word if opened from right-click context menu (?addWord=...)
  const params = new URLSearchParams(window.location.search);
  const prefillWord = params.get('addWord');
  if (prefillWord) {
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.tab === 'custom'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === 'tab-custom'));
    const isCyr = /[А-Яа-яЁё]/.test(prefillWord);
    document.getElementById(isCyr ? 'cwRu' : 'cwEn').value = prefillWord;
  }

  const setUsePhrasesEl = document.getElementById('setUsePhrases');
  if (setUsePhrasesEl) {
    setUsePhrasesEl.addEventListener('change', (e) => {
      saveSetting((s) => { s.usePhrases = e.target.checked; });
    });
  }

  // ==================== GENTLE 30-SEC MINI-QUIZ (v2.3) ====================
  let quizItems = [];
  let quizPos = 0;
  let quizRight = 0;

  function pickQuizPool() {
    const allPool = [...DICT, ...getActivePackEntries(state.settings.enabledPacks)];
    const priority = allPool
      .filter((w) => state.progress[w.id] && state.progress[w.id].status !== 'hidden' && state.progress[w.id].status !== 'mastered')
      .sort((a, b) => ((state.progress[b.id].starred ? 100 : 0) + (state.progress[b.id].hovers || 0)) - ((state.progress[a.id].starred ? 100 : 0) + (state.progress[a.id].hovers || 0)));
    const fallback = allPool.filter((w) => !state.progress[w.id] || state.progress[w.id].status !== 'hidden');
    const merged = [...priority, ...fallback.sort(() => Math.random() - 0.5)];
    const unique = [];
    const seen = new Set();
    for (const w of merged) {
      if (seen.has(w.id)) continue;
      seen.add(w.id);
      unique.push(w);
      if (unique.length >= 5) break;
    }
    return unique;
  }

  function renderQuizQuestion() {
    const box = document.getElementById('quizBox');
    if (!box) return;
    if (quizPos >= quizItems.length) {
      document.getElementById('quizCounter').textContent = 'Готово!';
      document.getElementById('quizEn').textContent = `🎉 ${quizRight} из ${quizItems.length}`;
      document.getElementById('quizIpa').textContent = 'Отличная разминка! Угаданные слова продвинулись к освоению.';
      document.getElementById('quizOptions').innerHTML = '';
      document.getElementById('quizFeedback').textContent = 'Нажмите «🔄 Новые 5 слов», чтобы повторить ещё.';
      return;
    }

    const cur = quizItems[quizPos];
    document.getElementById('quizCounter').textContent = `Вопрос ${quizPos + 1} из ${quizItems.length}`;
    document.getElementById('quizScore').textContent = `Верно: ${quizRight}`;
    document.getElementById('quizEn').textContent = cur.en;
    document.getElementById('quizIpa').textContent = `${cur.ipa || ''} · ${cur.level}`;
    document.getElementById('quizFeedback').textContent = '';

    // Build 3 distractors + 1 correct
    const distractors = DICT.filter((w) => w.id !== cur.id && w.ru !== cur.ru)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const choices = [cur, ...distractors].sort(() => Math.random() - 0.5);

    const optWrap = document.getElementById('quizOptions');
    optWrap.innerHTML = '';
    choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt';
      btn.textContent = ch.ru;
      btn.addEventListener('click', async () => {
        optWrap.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        if (ch.id === cur.id) {
          btn.classList.add('is-correct');
          quizRight++;
          Storage.recordExposure(state, cur.id);
          Storage.recordExposure(state, cur.id);
          await Storage.saveState(state);
          document.getElementById('quizFeedback').textContent = '✓ Верно! +2 к прогрессу слова';
        } else {
          btn.classList.add('is-wrong');
          optWrap.querySelectorAll('button').forEach((b) => {
            if (b.textContent === cur.ru) b.classList.add('is-correct');
          });
          Storage.recordHover(state, cur.id);
          await Storage.saveState(state);
          document.getElementById('quizFeedback').textContent = `Правильный ответ: «${cur.ru}» — покажем его снова в чтении`;
        }
        renderOverview();
        setTimeout(() => {
          quizPos++;
          renderQuizQuestion();
        }, 950);
      });
      optWrap.appendChild(btn);
    });
  }

  function startQuiz() {
    quizItems = pickQuizPool();
    quizPos = 0;
    quizRight = 0;
    renderQuizQuestion();
  }

  const btnQuizRestart = document.getElementById('btnQuizRestart');
  if (btnQuizRestart) btnQuizRestart.addEventListener('click', startQuiz);
  const btnQuizSpeak = document.getElementById('quizSpeak');
  if (btnQuizSpeak) btnQuizSpeak.addEventListener('click', () => {
    if (quizItems[quizPos]) speak(quizItems[quizPos].en);
  });
  startQuiz();
  document.getElementById('btnSkipA1').addEventListener('click', async () => {
    if (!confirm('Отметить все слова уровня A1 как уже известные (Освоено)?')) return;
    for (const w of DICT) {
      if (w.level === 'A1') Storage.setWordStatus(state, w.id, 'mastered');
    }
    await Storage.saveState(state);
    renderAll();
    showToast('Все слова A1 отмечены как изученные!');
  });
  document.getElementById('setUpdateUrl').addEventListener('change', (e) => {
    saveSetting((s) => { s.updateManifestUrl = e.target.value.trim(); });
  });

  function compareSemver(a, b) {
    const pa = String(a || '0.0.0').replace(/^v/, '').split('.').map(Number);
    const pb = String(b || '0.0.0').replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] || 0) > (pb[i] || 0)) return 1;
      if ((pa[i] || 0) < (pb[i] || 0)) return -1;
    }
    return 0;
  }

  document.getElementById('btnCheckUpdate').addEventListener('click', async () => {
    const statusEl = document.getElementById('updateStatus');
    const url = document.getElementById('setUpdateUrl').value.trim();
    if (!url) {
      statusEl.textContent = 'Укажите URL вашего update.json (формат: {"version":"2.1.0","downloadUrl":"...","notes":"..."}) или публикуйте обновления через Chrome Web Store.';
      return;
    }
    statusEl.textContent = 'Проверяем обновления...';
    try {
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      const curVer = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : '2.0.0';
      if (data.version && compareSemver(data.version, curVer) > 0) {
        statusEl.innerHTML = `Доступна новая версия <strong>v${data.version}</strong>${data.notes ? ' — ' + data.notes : ''}${data.downloadUrl ? ` · <a href="${data.downloadUrl}" target="_blank" style="color:#6ee7b7;">Скачать</a>` : ''}`;
      } else {
        statusEl.textContent = `У вас установлена актуальная версия (v${curVer}).`;
      }
    } catch (err) {
      statusEl.textContent = 'Не удалось проверить обновления: ' + (err.message || 'ошибка сети');
    }
  });

  document.getElementById('fileImportPack').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const pack = JSON.parse(await file.text());
      const items = Array.isArray(pack) ? pack : (Array.isArray(pack.words) ? pack.words : []);
      if (items.length === 0) throw new Error('Пустой пакет');
      const existing = new Set(state.customWords.map((w) => (w.ru + '|' + w.en).toLowerCase()));
      let added = 0;
      for (const item of items) {
        if (!item.ru || !item.en) continue;
        const key = (item.ru + '|' + item.en).toLowerCase();
        if (existing.has(key)) continue;
        state.customWords.push({
          id: 'pack_' + Date.now() + '_' + added,
          ru: String(item.ru).trim(),
          en: String(item.en).trim(),
          ipa: item.ipa ? String(item.ipa).trim() : '',
          pos: item.pos || 'n',
          stem: item.stem !== false
        });
        existing.add(key);
        added++;
      }
      await Storage.saveState(state);
      renderAll();
      showToast(`Импортировано новых слов: ${added}`);
    } catch (_) {
      showToast('Ошибка: нужен JSON-массив объектов {ru, en}');
    }
  });

  // Export / Import / Reset
  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skvorling-backup-${Storage.getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('fileImport').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      state = Storage.mergeWithDefaults(parsed);
      await Storage.saveState(state);
      renderAll();
      showToast('Прогресс успешно импортирован');
    } catch (_) {
      showToast('Ошибка: некорректный JSON-файл');
    }
  });

  document.getElementById('btnReset').addEventListener('click', async () => {
    if (!confirm('Сбросить весь прогресс обучения и статистику?')) return;
    state = Storage.createDefaultState();
    await Storage.saveState(state);
    renderAll();
    showToast('Прогресс сброшен');
  });

  const dashThemeGroup = document.getElementById('dashThemeGroup');
  if (dashThemeGroup) {
    dashThemeGroup.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      state.settings.uiTheme = btn.dataset.theme;
      await Storage.saveState(state);
      document.body.dataset.theme = state.settings.uiTheme;
      showToast('Тема обновлена');
    });
  }


  // ==================== ⭐ STARRED ACTIVE-RECALL DRILL (v2.6) ====================
  let fcQueue = [];
  let fcIndex = 0;

  function getAllWordEntries() {
    const map = new Map();
    for (const w of [...DICT, ...getActivePackEntries(Object.keys(PACKS)), ...(NLP.CONTEXT_PHRASES || [])]) {
      if (!map.has(w.id)) map.set(w.id, w);
    }
    return map;
  }

  function renderFlashcard() {
    const cnt = document.getElementById('fcCounter');
    const enEl = document.getElementById('fcEn');
    const ipaEl = document.getElementById('fcIpa');
    const ruEl = document.getElementById('fcRu');
    const btnRev = document.getElementById('fcReveal');
    const btnAg = document.getElementById('fcAgain');
    const btnRem = document.getElementById('fcRemember');
    if (!cnt) return;

    if (fcQueue.length === 0) {
      cnt.textContent = 'Карточек: 0';
      enEl.textContent = 'Список избранного пока пуст';
      ipaEl.textContent = 'Наведите на любое слово на сайте и нажмите «☆ Учить», или отметьте ☆ в словаре.';
      ruEl.classList.add('hidden');
      btnRev.classList.add('hidden');
      btnAg.classList.add('hidden');
      btnRem.classList.add('hidden');
      return;
    }

    if (fcIndex >= fcQueue.length) {
      cnt.textContent = 'Круг пройден!';
      enEl.textContent = '🎉 Все карточки пройдены!';
      ipaEl.textContent = 'Нажмите «🔄 Начать сначала», чтобы повторить список ещё раз.';
      ruEl.classList.add('hidden');
      btnRev.classList.add('hidden');
      btnAg.classList.add('hidden');
      btnRem.classList.add('hidden');
      return;
    }

    const cur = fcQueue[fcIndex];
    cnt.textContent = `Карточка ${fcIndex + 1} из ${fcQueue.length}`;
    enEl.textContent = cur.en;
    ipaEl.textContent = `${cur.ipa || ''} · ${cur.level || 'A1'}`;
    ruEl.textContent = cur.ru;
    ruEl.classList.add('hidden');
    btnRev.classList.remove('hidden');
    btnAg.classList.add('hidden');
    btnRem.classList.add('hidden');
  }

  function renderStarred() {
    const wordMap = getAllWordEntries();
    const starredEntries = Object.keys(state.progress || {})
      .filter((id) => state.progress[id] && state.progress[id].starred && wordMap.has(id))
      .map((id) => wordMap.get(id));

    const navCnt = document.getElementById('navStarCount');
    if (navCnt) navCnt.textContent = String(starredEntries.length);
    const listCnt = document.getElementById('starListCount');
    if (listCnt) listCnt.textContent = String(starredEntries.length);

    fcQueue = starredEntries.slice();
    if (fcIndex >= fcQueue.length) fcIndex = 0;
    renderFlashcard();

    const listEl = document.getElementById('starredList');
    if (!listEl) return;
    if (starredEntries.length === 0) {
      listEl.innerHTML = '<div class="hard-meta">Отмечайте интересные слова звёздочкой «☆ Учить» в подсказке — они появятся здесь для активной зубрёжки.</div>';
      return;
    }
    listEl.innerHTML = '';
    for (const w of starredEntries) {
      const p = state.progress[w.id] || {};
      const item = document.createElement('div');
      item.className = 'hard-item';
      item.innerHTML = `
        <div><strong>${w.en}</strong> <span class="hard-meta">${w.ipa || ''}</span> — ${w.ru} <span class="hard-meta">(${w.level || 'A1'} · прогресс ${p.cleanStreak || 0}/5)</span></div>
        <div>
          <button type="button" class="mini-btn" data-sspeak="${w.en}">🔊</button>
          <button type="button" class="mini-btn" data-sknow="${w.id}">✓ Выучил</button>
          <button type="button" class="mini-btn" data-sunstar="${w.id}">Убрать ☆</button>
        </div>
      `;
      listEl.appendChild(item);
    }
    listEl.querySelectorAll('[data-sspeak]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.sspeak)));
    listEl.querySelectorAll('[data-sknow]').forEach((b) => b.addEventListener('click', async () => {
      Storage.setWordStatus(state, b.dataset.sknow, 'mastered');
      state.progress[b.dataset.sknow].starred = false;
      await Storage.saveState(state);
      renderAll();
      showToast('Слово освоено и убрано из избранного!');
    }));
    listEl.querySelectorAll('[data-sunstar]').forEach((b) => b.addEventListener('click', async () => {
      Storage.toggleStarred(state, b.dataset.sunstar);
      await Storage.saveState(state);
      renderAll();
      showToast('Убрано из избранного');
    }));
  }

  const fcRevealBtn = document.getElementById('fcReveal');
  if (fcRevealBtn) {
    fcRevealBtn.addEventListener('click', () => {
      document.getElementById('fcRu').classList.remove('hidden');
      fcRevealBtn.classList.add('hidden');
      document.getElementById('fcAgain').classList.remove('hidden');
      document.getElementById('fcRemember').classList.remove('hidden');
    });
  }
  const fcSpeakBtn = document.getElementById('fcSpeak');
  if (fcSpeakBtn) {
    fcSpeakBtn.addEventListener('click', () => {
      if (fcQueue[fcIndex]) speak(fcQueue[fcIndex].en);
    });
  }
  const fcAgainBtn = document.getElementById('fcAgain');
  if (fcAgainBtn) {
    fcAgainBtn.addEventListener('click', () => {
      const cur = fcQueue[fcIndex];
      if (cur) fcQueue.push(cur); // Repeat later in the session!
      fcIndex++;
      renderFlashcard();
    });
  }
  const fcRemBtn = document.getElementById('fcRemember');
  if (fcRemBtn) {
    fcRemBtn.addEventListener('click', async () => {
      const cur = fcQueue[fcIndex];
      if (cur) {
        Storage.recordExposure(state, cur.id);
        Storage.recordExposure(state, cur.id);
        if (state.progress[cur.id].status === 'mastered') {
          state.progress[cur.id].starred = false;
        }
        await Storage.saveState(state);
        renderOverview();
      }
      fcIndex++;
      renderFlashcard();
    });
  }
  const btnStarRestart = document.getElementById('btnStarRestart');
  if (btnStarRestart) {
    btnStarRestart.addEventListener('click', () => {
      fcIndex = 0;
      renderStarred();
    });
  }

  function renderAll() {
    document.body.dataset.theme = state.settings.uiTheme || 'colorful';
    renderOverview();
    renderVocab();
    renderStarred();
    renderCustom();
    renderSettings();
  }

  renderAll();
})();
