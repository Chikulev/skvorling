// Skvorling v2.3 NLP Engine: Russian Morphology, Homograph Disambiguation,
// Idiom Shield, Contextual Multi-Word Phrases, Utility Scoring & Top-Pool Randomizer.
(function (root) {
  'use strict';

  const CEFR_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

  const NOUN_ENDINGS = new Set([
    '', 'а', 'я', 'у', 'ю', 'ом', 'ем', 'ём', 'ой', 'ей', 'ёй', 'ою', 'ею',
    'е', 'и', 'ы', 'ов', 'ев', 'ёв', 'ам', 'ям', 'ами', 'ями', 'ах', 'ях',
    'ью', 'ие', 'ия', 'ию', 'ием', 'ии', 'ий', 'иям', 'иями', 'иях', 'ость',
    'ости', 'остью', 'остей', 'остям', 'остями', 'остях'
  ]);

  const NOUN_PLURAL_ENDINGS = new Set([
    'ы', 'и', 'ов', 'ев', 'ёв', 'ам', 'ям', 'ами', 'ями', 'ах', 'ях',
    'ия', 'ий', 'иям', 'иями', 'иях'
  ]);

  const NOUN_INSTRUMENTAL_ENDINGS = new Set(['ом', 'ем', 'ём', 'ой', 'ей', 'ёй', 'ою', 'ею', 'ью', 'ием', 'остью']);

  const ADJ_ENDINGS = new Set([
    'ый', 'ий', 'ой', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие',
    'ого', 'его', 'ому', 'ему', 'ым', 'им', 'ом', 'ем',
    'ую', 'юю', 'ых', 'их', 'ыми', 'ими', 'о', 'е'
  ]);

  const VERB_ENDINGS = new Set([
    'ть', 'ться', 'ю', 'у', 'ешь', 'ёшь', 'ишь', 'ет', 'ёт', 'ит',
    'ем', 'ём', 'им', 'ете', 'ёте', 'ите', 'ют', 'ут', 'ят', 'ат',
    'л', 'ла', 'ло', 'ли', 'лся', 'лась', 'лось', 'лись'
  ]);

  const VERB_3S_ENDINGS = new Set(['ет', 'ёт', 'ит']);
  const VERB_PAST_ENDINGS = new Set(['л', 'ла', 'ло', 'ли', 'лся', 'лась', 'лось', 'лись']);

  const RU_PREPOSITIONS = new Set([
    'в', 'во', 'на', 'с', 'со', 'к', 'ко', 'о', 'об', 'обо', 'от', 'ото',
    'до', 'из', 'изо', 'у', 'по', 'под', 'подо', 'над', 'за', 'перед',
    'между', 'без', 'для', 'при', 'через', 'про', 'около', 'после', 'вместо'
  ]);

  // ==================== IDIOM & RECIPROCAL PRONOUN SHIELD ====================
  // Multi-word sequences that must NEVER have a single word torn out and translated literally.
  const STOP_PHRASES = [
    ['друг', 'друга'], ['друг', 'другу'], ['друг', 'другом'], ['друг', 'друге'],
    ['друг', 'с', 'другом'], ['друг', 'за', 'другом'], ['друг', 'о', 'друге'],
    ['друг', 'к', 'другу'], ['друг', 'на', 'друга'], ['друг', 'от', 'друга'],
    ['друг', 'перед', 'другом'], ['друг', 'против', 'друга'], ['друг', 'у', 'друга'],
    ['друг', 'для', 'друга'], ['друг', 'возле', 'друга'], ['друг', 'рядом', 'с', 'другом'],
    ['ни', 'в', 'коем', 'случае'], ['само', 'собой'], ['ни', 'при', 'чём'], ['ни', 'при', 'чем'],
    ['на', 'белом', 'свете'], ['на', 'том', 'свете'], ['на', 'свете'],
    ['в', 'двух', 'словах'], ['иными', 'словами'], ['дело', 'в', 'том'],
    ['во', 'что', 'бы', 'то', 'ни', 'стало'], ['до', 'сих', 'пор'], ['с', 'одной', 'стороны'], ['в', 'свою', 'очередь'], ['в', 'конечном', 'счёте'], ['в', 'конечном', 'счете'], ['так', 'или', 'иначе'], ['тем', 'более'], ['время', 'от', 'времени']
  ];

  // ==================== CONTEXTUAL MULTI-WORD PHRASES (v2.3) ====================
  const CONTEXT_PHRASES = [
    { id: 'phr_in_fact', tokens: ['на', 'самом', 'деле'], en: 'in fact', ru: 'на самом деле', ipa: '/ɪn fækt/', level: 'B1', utility: 5 },
    { id: 'phr_at_least', tokens: ['по', 'крайней', 'мере'], en: 'at least', ru: 'по крайней мере', ipa: '/æt liːst/', level: 'B1', utility: 5 },
    { id: 'phr_makes_sense', tokens: ['имеет', 'смысл'], en: 'makes sense', ru: 'имеет смысл', ipa: '/meɪks sens/', level: 'B1', utility: 5 },
    { id: 'phr_on_the_other_hand', tokens: ['с', 'другой', 'стороны'], en: 'on the other hand', ru: 'с другой стороны', ipa: '/ɒn ði ˈʌðər hænd/', level: 'B1', utility: 5 },
    { id: 'phr_at_the_same_time', tokens: ['в', 'то', 'же', 'время'], en: 'at the same time', ru: 'в то же время', ipa: '/æt ðə seɪm taɪm/', level: 'B1', utility: 5 },
    { id: 'phr_in_the_end', tokens: ['в', 'конце', 'концов'], en: 'in the end', ru: 'в конце концов', ipa: '/ɪn ði end/', level: 'B1', utility: 4 },
    { id: 'phr_as_a_rule', tokens: ['как', 'правило'], en: 'as a rule', ru: 'как правило', ipa: '/æz ə ruːl/', level: 'B1', utility: 4 },
    { id: 'phr_first_of_all', tokens: ['в', 'первую', 'очередь'], en: 'first of all', ru: 'в первую очередь', ipa: '/fɜːrst əv ɔːl/', level: 'B1', utility: 5 },
    { id: 'phr_in_any_case', tokens: ['в', 'любом', 'случае'], en: 'in any case', ru: 'в любом случае', ipa: '/ɪn ˈeni keɪs/', level: 'B1', utility: 5 },
    { id: 'phr_pay_attention', tokens: ['обратить', 'внимание'], en: 'pay attention', ru: 'обратить внимание', ipa: '/peɪ əˈtenʃən/', level: 'B1', utility: 5 },
    { id: 'phr_make_decision', tokens: ['принять', 'решение'], en: 'make a decision', ru: 'принять решение', ipa: '/meɪk ə dɪˈsɪʒən/', level: 'B1', utility: 5 },
    { id: 'phr_point_of_view', tokens: ['точка', 'зрения'], en: 'point of view', ru: 'точка зрения', ipa: '/pɔɪnt əv vjuː/', level: 'B1', utility: 4 },
    { id: 'phr_at_first_glance', tokens: ['на', 'первый', 'взгляд'], en: 'at first glance', ru: 'на первый взгляд', ipa: '/æt fɜːrst ɡlɑːns/', level: 'B2', utility: 4 },
    { id: 'phr_by_default', tokens: ['по', 'умолчанию'], en: 'by default', ru: 'по умолчанию', ipa: '/baɪ dɪˈfɔːlt/', level: 'B1', utility: 5 },
    { id: 'phr_in_real_time', tokens: ['в', 'реальном', 'времени'], en: 'in real time', ru: 'в реальном времени', ipa: '/ɪn rɪəl taɪm/', level: 'B1', utility: 5 },
    { id: 'phr_feedback', tokens: ['обратная', 'связь'], en: 'feedback', ru: 'обратная связь', ipa: '/ˈfiːdbæk/', level: 'B1', utility: 5 },
    { id: 'phr_common_sense', tokens: ['здравый', 'смысл'], en: 'common sense', ru: 'здравый смысл', ipa: '/ˈkɒmən sens/', level: 'B2', utility: 4 },
    { id: 'phr_step_by_step', tokens: ['шаг', 'за', 'шагом'], en: 'step by step', ru: 'шаг за шагом', ipa: '/step baɪ step/', level: 'A2', utility: 5 },
    { id: 'phr_free_time', tokens: ['свободное', 'время'], en: 'free time', ru: 'свободное время', ipa: '/friː taɪm/', level: 'A1', utility: 5 },
    { id: 'phr_birthday', tokens: ['день', 'рождения'], en: 'birthday', ru: 'день рождения', ipa: '/ˈbɜːrθdeɪ/', level: 'A1', utility: 5 },
    { id: 'phr_database', tokens: ['база', 'данных'], en: 'database', ru: 'база данных', ipa: '/ˈdeɪtəbeɪs/', level: 'B1', utility: 5 },
    { id: 'phr_ai', tokens: ['искусственный', 'интеллект'], en: 'artificial intelligence', ru: 'искусственный интеллект', ipa: '/ˌɑːrtɪˈfɪʃəl ɪnˈtelɪdʒəns/', level: 'B2', utility: 4 },
    { id: 'phr_nevertheless', tokens: ['тем', 'не', 'менее'], en: 'nevertheless', ru: 'тем не менее', ipa: '/ˌnevərðəˈles/', level: 'B2', utility: 4 },
    { id: 'phr_therefore', tokens: ['таким', 'образом'], en: 'therefore', ru: 'таким образом', ipa: '/ˈðeərfɔːr/', level: 'B1', utility: 4 },
    { id: 'phr_instead_of_this', tokens: ['вместо', 'этого'], en: 'instead of this', ru: 'вместо этого', ipa: '/ɪnˈsted əv ðɪs/', level: 'B1', utility: 5 },
    { id: 'phr_because_of_this', tokens: ['из-за', 'этого'], en: 'because of this', ru: 'из-за этого', ipa: '/bɪˈkɒz əv ðɪs/', level: 'A2', utility: 5 },
    { id: 'phr_depending_on', tokens: ['в', 'зависимости', 'от'], en: 'depending on', ru: 'в зависимости от', ipa: '/dɪˈpendɪŋ ɒn/', level: 'B1', utility: 4 },
    { id: 'phr_despite', tokens: ['несмотря', 'на'], en: 'despite', ru: 'несмотря на', ipa: '/dɪˈspaɪt/', level: 'B1', utility: 5 },
    { id: 'phr_overall', tokens: ['в', 'целом'], en: 'overall', ru: 'в целом', ipa: '/ˌəʊvərˈɔːl/', level: 'B1', utility: 5 },
    { id: 'phr_workday', tokens: ['рабочий', 'день'], en: 'workday', ru: 'рабочий день', ipa: '/ˈwɜːrkdeɪ/', level: 'A2', utility: 5 }
  ];

  // ==================== HOMOGRAPH DISAMBIGUATION CUES ====================
  const BOTTOM_CUES = ['бутыл', 'мор', 'океан', 'рек', 'озер', 'стакан', 'кружк', 'чашк', 'коробк', 'ящик', 'колодц', 'кастрюл', 'бассейн', 'бочк', 'ущель', 'глубин', 'осад', 'осел', 'лежит'];
  const DAY_EVENT_CUES = ['рожден', 'знан', 'город', 'побед', 'открыт', 'учител', 'рабоч', 'календар', 'выходн', 'сегодняшн', 'прошл', 'кажд', 'перв', 'следующ'];
  const PEACE_CUES = ['войн', 'перемир', 'договор', 'соглашен', 'подписа', 'конфликт', 'вражд'];
  const GENDER_CUES = ['мужск', 'женск', 'обоих', 'противоположн', 'смен'];
  const SPRING_WATER_CUES = ['родник', 'бьёт', 'бьет', 'руче', 'фонтан'];

  const CYRILLIC_WORD_RE = /[А-Яа-яЁё]+(?:-[А-Яа-яЁё]+)?/g;
  const ANY_WORD_RE = /[А-Яа-яЁёA-Za-z0-9-]+/g;

  const IMMERSION_STAGES = [
    { stage: 1, name: 'Старт', minMastered: 0, maxPerSentence: 1, maxCefr: 'A1', desc: '1 базовое очевидное слово в длинном предложении (A1)' },
    { stage: 2, name: 'Привыкание', minMastered: 15, maxPerSentence: 2, maxCefr: 'A2', desc: 'До 2 слов в предложении (A1–A2)' },
    { stage: 3, name: 'Погружение', minMastered: 45, maxPerSentence: 3, maxCefr: 'B1', desc: 'До 3 слов в предложении (A1–B1)' },
    { stage: 4, name: 'Свободный поток', minMastered: 90, maxPerSentence: 4, maxCefr: 'B2', desc: 'До 4 слов в предложении (A1–B2)' },
    { stage: 5, name: 'Профи', minMastered: 150, maxPerSentence: 5, maxCefr: 'C1', desc: 'До 5 слов в предложении (A1–C1)' }
  ];

  function getStageForMastered(masteredCount) {
    let current = IMMERSION_STAGES[0];
    for (const s of IMMERSION_STAGES) {
      if (masteredCount >= s.minMastered) current = s;
    }
    return current;
  }

  function buildIndex(dictionary, customWords, packEntries) {
    const exactMap = new Map();
    const stemBuckets = new Map();
    const participleBuckets = new Map();
    const allEntries = [...dictionary, ...(Array.isArray(packEntries) ? packEntries : [])];

    if (Array.isArray(customWords)) {
      for (const cw of customWords) {
        if (!cw || !cw.ru || !cw.en) continue;
        const ruLower = cw.ru.trim().toLowerCase();
        if (!ruLower) continue;
        allEntries.push({
          id: cw.id || ('custom_' + cw.en.trim().toLowerCase().replace(/\s+/g, '_')),
          en: cw.en.trim(),
          ipa: cw.ipa || '',
          ru: cw.ru.trim(),
          pos: cw.pos || 'n',
          level: cw.level || 'A1',
          clarity: 3,
          utility: 5,
          forms: cw.stem ? [ruLower + '*'] : [ruLower],
          cues: cw.cues || [],
          isCustom: true
        });
      }
    }

    for (const entry of allEntries) {
      if (Array.isArray(entry.compForms)) {
        for (const cf of entry.compForms) {
          const low = cf.toLowerCase();
          if (!exactMap.has(low)) {
            exactMap.set(low, { entry, formType: 'comp', grammarLabel: 'сравнит. степень' });
          }
        }
      }

      if (entry.instNuance && Array.isArray(entry.instNuance.forms)) {
        for (const inf of entry.instNuance.forms) {
          const low = inf.toLowerCase();
          if (!exactMap.has(low)) {
            exactMap.set(low, {
              entry,
              formType: 'instrumental',
              grammarLabel: entry.instNuance.note || 'тв. падеж'
            });
          }
        }
      }

      if (Array.isArray(entry.pluralForms)) {
        for (const pf of entry.pluralForms) {
          const low = pf.toLowerCase();
          if (!exactMap.has(low)) {
            exactMap.set(low, { entry, formType: 'plural', grammarLabel: 'мн. число' });
          }
        }
      }

      if (Array.isArray(entry.participleForms)) {
        for (const pf of entry.participleForms) {
          const low = pf.toLowerCase();
          const stem = low.endsWith('*') ? low.slice(0, -1) : low;
          if (stem.length < 3) continue;
          const key = stem.slice(0, 2);
          if (!participleBuckets.has(key)) participleBuckets.set(key, []);
          participleBuckets.get(key).push({ stem, entry });
        }
      }

      for (const f of entry.forms || []) {
        const low = f.toLowerCase();
        if (low.endsWith('*')) {
          const stem = low.slice(0, -1);
          if (stem.length < 2) continue;
          const key = stem.slice(0, 2);
          if (!stemBuckets.has(key)) stemBuckets.set(key, []);
          stemBuckets.get(key).push({ stem, entry });
        } else {
          if (!exactMap.has(low)) {
            let formType = 'base';
            let grammarLabel = '';
            if (entry.pos === 'v') {
              if (/(?:л|ла|ло|ли|шёл|шел|шла|шли)$/.test(low)) {
                formType = 'past';
                grammarLabel = 'прош. время (Past)';
              } else if (/(?:ет|ёт|ит)$/.test(low)) {
                formType = '3s';
                grammarLabel = '3-е л. наст. (-s)';
              }
            }
            exactMap.set(low, { entry, formType, grammarLabel });
          }
        }
      }
    }

    for (const arr of stemBuckets.values()) arr.sort((a, b) => b.stem.length - a.stem.length);
    for (const arr of participleBuckets.values()) arr.sort((a, b) => b.stem.length - a.stem.length);

    return { exactMap, stemBuckets, participleBuckets, totalCount: allEntries.length };
  }

  function detectNounCaseLabel(suffix, isPlural) {
    if (isPlural) {
      if (suffix === 'ами' || suffix === 'ями') return 'тв. п. мн. ч.';
      if (suffix === 'ах' || suffix === 'ях') return 'пр. п. мн. ч.';
      if (suffix === 'ам' || suffix === 'ям') return 'дат. п. мн. ч.';
      if (suffix === 'ов' || suffix === 'ев' || suffix === 'ёв') return 'род. п. мн. ч.';
      return 'мн. число';
    }
    if (NOUN_INSTRUMENTAL_ENDINGS.has(suffix)) return 'тв. падеж (чем?)';
    if (suffix === 'е' || suffix === 'ии') return 'пр./дат. падеж';
    if (suffix === 'у' || suffix === 'ю') return 'дат./вин. падеж';
    return '';
  }

  function matchWord(wordLower, index) {
    if (!wordLower || wordLower.length < 3) return null;

    if (index.exactMap.has(wordLower)) {
      return index.exactMap.get(wordLower);
    }

    const bucketKey = wordLower.slice(0, 2);

    const partCands = index.participleBuckets.get(bucketKey);
    if (partCands) {
      for (const { stem, entry } of partCands) {
        if (!wordLower.startsWith(stem)) continue;
        const suffix = wordLower.slice(stem.length);
        if (ADJ_ENDINGS.has(suffix)) {
          return { entry, formType: 'ing', grammarLabel: 'причастие (-ing)' };
        }
      }
    }

    const candidates = index.stemBuckets.get(bucketKey);
    if (!candidates) return null;

    for (const { stem, entry } of candidates) {
      if (!wordLower.startsWith(stem)) continue;
      const suffix = wordLower.slice(stem.length);

      if (entry.pos === 'n' && NOUN_ENDINGS.has(suffix)) {
        const isPlural =
          (Array.isArray(entry.pluralForms) && entry.pluralForms.includes(wordLower)) ||
          (suffix.length > 0 && NOUN_PLURAL_ENDINGS.has(suffix) && !['и', 'ия', 'ие'].includes(suffix));
        const grammarLabel = detectNounCaseLabel(suffix, isPlural);
        return { entry, formType: isPlural ? 'plural' : 'base', grammarLabel };
      }
      if (entry.pos === 'adj' && ADJ_ENDINGS.has(suffix)) {
        return { entry, formType: 'base', grammarLabel: '' };
      }
      if (entry.pos === 'v' && VERB_ENDINGS.has(suffix)) {
        if (VERB_PAST_ENDINGS.has(suffix)) return { entry, formType: 'past', grammarLabel: 'прош. время (Past)' };
        if (VERB_3S_ENDINGS.has(suffix)) return { entry, formType: '3s', grammarLabel: '3-е л. наст. (-s)' };
        return { entry, formType: 'base', grammarLabel: suffix === 'ть' ? 'инфинитив' : 'наст. время' };
      }
      if (entry.pos === 'adv' && suffix === '') {
        return { entry, formType: 'base', grammarLabel: '' };
      }
    }

    return null;
  }

  function hasAnyCue(sentLower, cueList) {
    for (const c of cueList) {
      if (sentLower.includes(c)) return true;
    }
    return false;
  }

  /**
   * Resolves notorious Russian homographs using sentence context.
   * Returns:
   *  - modified match object (e.g. "дне" -> bottom),
   *  - original match object if unambiguous,
   *  - null to safely skip if ambiguous / false-positive homograph.
   */
  function disambiguateHomograph(match, tokLower, prevTokLower, sentLower) {
    const id = match.entry.id;

    // 1. "дне" -> "дно" (bottom) vs "день" (day)
    if (tokLower === 'дне' && id === 'day') {
      const isBottom = hasAnyCue(sentLower, BOTTOM_CUES);
      const isDayEvent = hasAnyCue(sentLower, DAY_EVENT_CUES);
      if (isBottom && !isDayEvent) {
        return {
          entry: { id: 'bottom', en: 'bottom', ipa: '/ˈbɒtəm/', ru: 'дно', pos: 'n', level: 'A2', clarity: 3, utility: 4, cues: BOTTOM_CUES },
          formType: 'base',
          grammarLabel: 'пр. п. — дно'
        };
      }
      if (isDayEvent && !isBottom) {
        return match;
      }
      // Ambiguous "на дне" with no clear cue -> skip rather than mis-translate!
      if (prevTokLower === 'на') return null;
    }

    // 2. "мир" -> "peace" (near war/treaty) vs "world"
    if (id === 'world' && hasAnyCue(sentLower, PEACE_CUES)) {
      return {
        entry: { id: 'peace', en: 'peace', ipa: '/piːs/', ru: 'мир (без войны)', pos: 'n', level: 'A2', clarity: 3, utility: 4 },
        formType: 'base',
        grammarLabel: 'мир (без войны)'
      };
    }

    // 3. "пол/пола/полу" -> skip when meaning biological gender
    if (id === 'floor' && hasAnyCue(sentLower, GENDER_CUES)) {
      return null;
    }

    // 4. "ключ*" -> skip when meaning water spring
    if (id === 'key' && hasAnyCue(sentLower, SPRING_WATER_CUES)) {
      return null;
    }

    // 5. "свете" -> skip in "на свете" (in the world)
    if (id === 'light' && tokLower === 'свете' && prevTokLower === 'на') {
      return null;
    }

    return match;
  }

  function findBlockedTokenIndices(ruTokens) {
    const blocked = new Set();
    const len = ruTokens.length;
    for (let i = 0; i < len; i++) {
      for (const phrase of STOP_PHRASES) {
        const plen = phrase.length;
        if (i + plen > len) continue;
        let ok = true;
        for (let k = 0; k < plen; k++) {
          if (ruTokens[i + k].lower !== phrase[k]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          for (let k = 0; k < plen; k++) blocked.add(i + k);
        }
      }
    }
    return blocked;
  }

  function looksLikeRussianAdj(wordLower) {
    if (!wordLower || wordLower.length < 4) return false;
    return /(?:ым|им|ой|ей|ом|ем|ого|его|ую|юю|ые|ие|ых|их|ыми|ими)$/.test(wordLower);
  }

  function resolveEnglishSurface(match, prevTokenLower, smartGrammar) {
    const { entry, formType } = match;
    if (!smartGrammar) return entry.en;

    if (formType === 'plural' && entry.enPlural) return entry.enPlural;
    if (formType === 'past' && entry.enPast) return entry.enPast;
    if (formType === '3s' && entry.en3s) return entry.en3s;
    if (formType === 'ing' && entry.enIng) return entry.enIng;
    if (formType === 'comp' && entry.enComp) return entry.enComp;

    if (formType === 'instrumental' && entry.instNuance && entry.instNuance.enPrep) {
      const hasPrepOrAdj = prevTokenLower && (
        RU_PREPOSITIONS.has(prevTokenLower) || looksLikeRussianAdj(prevTokenLower)
      );
      if (!hasPrepOrAdj) return entry.instNuance.enPrep;
    }

    return entry.en;
  }

  function splitSentences(text) {
    const sentences = [];
    const abbrevRe = /(?:т\.д|т\.п|т\.е|др|пр|гг|руб|тыс|млн|млрд|см|мм|кг|ул|д|кв|рис|табл|стр)$/i;
    let start = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '.' || ch === '!' || ch === '?' || ch === '…' || ch === '\n') {
        let end = i + 1;
        while (end < text.length && (text[end] === '.' || text[end] === '!' || text[end] === '?' || text[end] === '…')) {
          end++;
        }
        if (ch === '.' && end < text.length && text[end] !== '\n') {
          const prevChunk = text.slice(Math.max(start, i - 6), i);
          if (abbrevRe.test(prevChunk)) continue;
          if (i > 0 && /\d/.test(text[i - 1]) && /\d/.test(text[i + 1] || '')) continue;
        }
        if (end >= text.length || /[\s»"')\]]/.test(text[end]) || ch === '\n') {
          sentences.push({ start, end, text: text.slice(start, end) });
          start = end;
          i = end - 1;
        }
      }
    }

    if (start < text.length) {
      sentences.push({ start, end: text.length, text: text.slice(start) });
    }
    return sentences;
  }

  function applyCase(sourceWord, targetWord) {
    if (!sourceWord || !targetWord) return targetWord;
    if (sourceWord.length > 1 && sourceWord === sourceWord.toUpperCase()) {
      return targetWord.toUpperCase();
    }
    if (sourceWord[0] === sourceWord[0].toUpperCase() && sourceWord[0] !== sourceWord[0].toLowerCase()) {
      return targetWord[0].toUpperCase() + targetWord.slice(1);
    }
    return targetWord;
  }

  function weightedPickFromPool(pool, rng) {
    if (pool.length === 1) return pool[0];
    const minScore = pool[pool.length - 1].score;
    const weights = pool.map((c) => Math.pow(Math.max(1, c.score - minScore + 10), 1.12));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[0];
  }

  function analyzeText(text, index, options = {}) {
    if (!text || text.length < 25) return [];

    const minSentenceWords = options.minSentenceWords ?? 7;
    const maxPerSentence = options.maxPerSentence ?? 1;
    const minWordGap = options.minWordGap ?? 2;
    const maxCefrRank = CEFR_ORDER[options.maxCefr || 'A1'] || 1;
    const progressMap = options.progressMap || {};
    const pageUsedIds = options.pageUsedIds || new Set();
    const useRandomizer = options.useRandomizer !== undefined ? !!options.useRandomizer : true;
    const randomPoolDelta = options.randomPoolDelta ?? 32;
    const smartGrammar = options.smartGrammar !== undefined ? !!options.smartGrammar : true;
    const hideMasteredWords = options.hideMasteredWords !== undefined ? !!options.hideMasteredWords : true;
    const usePhrases = options.usePhrases !== undefined ? !!options.usePhrases : true;
    const rng = typeof options.rng === 'function' ? options.rng : Math.random;

    const sentences = splitSentences(text);
    const allReplacements = [];

    for (const sent of sentences) {
      const sentLower = sent.text.toLowerCase();

      const ruTokens = [];
      let m;
      CYRILLIC_WORD_RE.lastIndex = 0;
      while ((m = CYRILLIC_WORD_RE.exec(sent.text)) !== null) {
        ruTokens.push({
          word: m[0],
          lower: m[0].toLowerCase(),
          indexInSent: ruTokens.length,
          localStart: m.index,
          localEnd: m.index + m[0].length,
          globalStart: sent.start + m.index,
          globalEnd: sent.start + m.index + m[0].length
        });
      }

      if (ruTokens.length < minSentenceWords) continue;

      const allWords = sent.text.match(ANY_WORD_RE) || [];
      if (allWords.length === 0 || ruTokens.length / allWords.length < 0.6) continue;

      // 1. Identify idiom/reciprocal-pronoun protected token spans
      const blockedIndices = findBlockedTokenIndices(ruTokens);
      const candidates = [];

      // 2. Match natural multi-word contextual phrases (v2.3)
      const phraseCoveredIndices = new Set();
      if (usePhrases) {
        for (let i = 0; i < ruTokens.length; i++) {
          for (const phr of CONTEXT_PHRASES) {
            const plen = phr.tokens.length;
            if (i + plen > ruTokens.length) continue;
            const entryRank = CEFR_ORDER[phr.level] || 1;
            if (entryRank > maxCefrRank) continue;

            const wordProg = progressMap[phr.id];
            if (wordProg && wordProg.status === 'hidden') continue;
            if (hideMasteredWords && wordProg && wordProg.status === 'mastered') continue;

            let ok = true;
            for (let k = 0; k < plen; k++) {
              if (ruTokens[i + k].lower !== phr.tokens[k]) {
                ok = false;
                break;
              }
            }
            if (!ok) continue;

            const firstTok = ruTokens[i];
            const lastTok = ruTokens[i + plen - 1];
            const origSlice = sent.text.slice(firstTok.localStart, lastTok.localEnd);
            let score = phr.utility * 7 + 30 + 14; // Phrases are ultra-clear and valuable!
            if (wordProg) {
              if (wordProg.status === 'mastered') score -= 20;
              else if ((wordProg.hovers || 0) > 0) score += 18;
            }
            if (pageUsedIds.has(phr.id)) score -= 14;

            for (let k = 0; k < plen; k++) phraseCoveredIndices.add(i + k);

            candidates.push({
              startIdx: i,
              endIdx: i + plen - 1,
              globalStart: firstTok.globalStart,
              globalEnd: lastTok.globalEnd,
              original: origSlice,
              entry: {
                id: phr.id,
                en: phr.en,
                ipa: phr.ipa,
                ru: phr.ru,
                pos: 'phr',
                level: phr.level,
                utility: phr.utility
              },
              replacement: applyCase(firstTok.word, phr.en),
              cueMatched: true,
              grammarLabel: '💬 контекстная фраза',
              utility: phr.utility,
              score
            });
          }
        }
      }

      // 3. Match single words (skipping blocked idiom tokens and tokens covered by a phrase)
      for (let idx = 0; idx < ruTokens.length; idx++) {
        if (blockedIndices.has(idx) || phraseCoveredIndices.has(idx)) continue;

        const tok = ruTokens[idx];
        // Skip mid-sentence TitleCase proper nouns (names, brands, cities, streets)
        if (idx > 0 && tok.word[0] === tok.word[0].toUpperCase() && tok.word[0] !== tok.word[0].toLowerCase() && tok.word !== tok.word.toUpperCase()) {
          continue;
        }
        const prevTok = idx > 0 ? ruTokens[idx - 1].lower : '';
        let match = matchWord(tok.lower, index);
        if (!match) continue;

        // Contextual homograph disambiguation ("на дне бутылки" -> bottom, "на свете" -> skip, etc.)
        match = disambiguateHomograph(match, tok.lower, prevTok, sentLower);
        if (!match) continue;

        const { entry, grammarLabel } = match;
        const wordProg = progressMap[entry.id];

        if (wordProg && wordProg.status === 'hidden') continue;
        if (hideMasteredWords && wordProg && wordProg.status === 'mastered') continue;

        const entryRank = CEFR_ORDER[entry.level] || 1;
        if (!entry.isCustom && entryRank > maxCefrRank) continue;

        const utility = entry.utility || 3;
        let score = utility * 7 + (entry.clarity || 2) * 10;

        let cueMatched = false;
        let cueCount = 0;
        if (Array.isArray(entry.cues) && entry.cues.length > 0) {
          for (const cue of entry.cues) {
            if (sentLower.includes(cue)) {
              cueCount++;
              cueMatched = true;
            }
          }
        }
        if (cueCount > 0) {
          score += Math.min(32, 24 + (cueCount - 1) * 8);
        }

        if (ruTokens.length >= 10) score += 6;
        if (ruTokens.length >= 16) score += 5;
        if (entry.pos === 'n') score += 6;
        if (match.formType === 'ing' || match.formType === '3s' || match.formType === 'past' || match.formType === 'comp') {
          score += 4;
        }
        if (entry.pack) score += 6;
        if (entry.isCustom) score += 30;

        if (wordProg) {
          if (wordProg.starred) score += 22;
          if (wordProg.status === 'mastered') score -= 20;
          else if ((wordProg.hovers || 0) > 0) score += 18;
          else if ((wordProg.seen || 0) > 0) score += 8;
        } else {
          score += 5;
        }

        if (pageUsedIds.has(entry.id)) score -= 14;

        const rawSurface = resolveEnglishSurface(match, prevTok, smartGrammar);
        const replacement = applyCase(tok.word, rawSurface);

        candidates.push({
          startIdx: idx,
          endIdx: idx,
          globalStart: tok.globalStart,
          globalEnd: tok.globalEnd,
          original: tok.word,
          entry,
          replacement,
          cueMatched,
          grammarLabel: grammarLabel || '',
          utility,
          score
        });
      }

      if (candidates.length === 0) continue;

      const densityCap = Math.min(
        maxPerSentence,
        Math.max(1, Math.floor(ruTokens.length / 4))
      );

      const chosen = [];
      const usedInSentence = new Set();
      let remaining = candidates.slice().sort((a, b) => b.score - a.score);

      while (chosen.length < densityCap && remaining.length > 0) {
        remaining = remaining.filter((cand) => {
          if (usedInSentence.has(cand.entry.id)) return false;
          return !chosen.some((c) => {
            const dist = cand.startIdx > c.endIdx
              ? cand.startIdx - c.endIdx
              : (c.startIdx > cand.endIdx ? c.startIdx - cand.endIdx : 0);
            return dist <= minWordGap;
          });
        });
        if (remaining.length === 0) break;

        let picked;
        if (useRandomizer) {
          const topScore = remaining[0].score;
          const pool = remaining
            .filter((c) => topScore - c.score <= randomPoolDelta)
            .slice(0, 5);
          picked = weightedPickFromPool(pool, rng);
        } else {
          picked = remaining[0];
        }

        chosen.push(picked);
        usedInSentence.add(picked.entry.id);
        pageUsedIds.add(picked.entry.id);
        remaining = remaining.filter((c) => c !== picked);
      }

      for (const c of chosen) {
        allReplacements.push({
          start: c.globalStart,
          end: c.globalEnd,
          original: c.original,
          replacement: c.replacement,
          entry: c.entry,
          cueMatched: c.cueMatched,
          grammarLabel: c.grammarLabel,
          utility: c.utility,
          score: c.score
        });
      }
    }

    allReplacements.sort((a, b) => a.start - b.start);
    return allReplacements;
  }

  const api = {
    CEFR_ORDER,
    IMMERSION_STAGES,
    CONTEXT_PHRASES,
    getStageForMastered,
    buildIndex,
    matchWord,
    splitSentences,
    applyCase,
    analyzeText
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.KontextNLP = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
