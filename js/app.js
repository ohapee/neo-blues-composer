/**
 * ネオ・ブルース・コンポーザー - メイン制御ロジック
 */

import {
  STYLES,
  INSTRUMENTS,
  VOCAL_STYLES,
  BUZZ_HOOKS,
  LYRIC_THEMES,
  PROGRESSIONS,
  DURATIONS,
  AI_TARGETS,
  NEGATIVE_OPTIONS,
  TITLE_SUGGESTIONS
} from './data.js';

import { buildPrompt, buildNegativePrompt, buildTimelineData } from './prompt_generator.js';
import { neoBluesAudio } from './audio_preview.js';
import {
  saveLastState,
  loadLastState,
  getPresets,
  savePreset,
  deletePreset,
  exportPresetsAsJSON,
  importPresetsFromJSON,
  getShareURL,
  loadFromURLHash
} from './storage.js';

const state = {
  trackTitle: 'ミッドナイト・残業ブルース',
  style: 'neo_garage_fuzz',
  vocalStyle: 'raspy_grit',
  insts: new Set(['slide_resonator', 'fuzz_electric_gtr', 'crying_harmonica', 'sub_808_bass']),
  hooks: new Set(['intro_killer_riff', 'heavy_sub_kick', 'call_and_response']),
  lyricTheme: 'overwork_deadline',
  customLyrics: '',
  progression: 'standard_12bar_e',
  tempo: 92,
  duration: '60',
  lang: 'ja',
  aiTarget: 'suno_udio',
  negatives: new Set(['no_autotune', 'no_cheap_synth'])
};

function flash(msg) {
  const f = document.getElementById('flash');
  if (!f) return;
  f.textContent = msg;
  f.classList.add('show');
  setTimeout(() => f.classList.remove('show'), 1600);
}

function buildMultiChips(container, items, stateSet, onChange) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (stateSet.has(item.id) ? ' on' : '');
    b.textContent = item.ja;
    b.addEventListener('click', () => {
      if (stateSet.has(item.id)) {
        stateSet.delete(item.id);
      } else {
        stateSet.add(item.id);
      }
      b.classList.toggle('on');
      onChange();
    });
    container.appendChild(b);
  });
}

function buildSingleChips(container, items, currentId, onSelect) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (item.id === currentId ? ' on' : '');
    b.textContent = item.ja || item.label;
    b.title = item.desc || '';
    b.addEventListener('click', () => {
      [...container.children].forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      onSelect(item.id);
    });
    container.appendChild(b);
  });
}

function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;

  const sections = buildTimelineData(state);
  container.innerHTML = '';

  sections.forEach(sec => {
    const row = document.createElement('div');
    row.className = 'screen-row';
    row.innerHTML = `
      <div class="screen-time">${sec.time}</div>
      <div class="screen-body">
        <span class="lab">${sec.label}</span>
        <span class="desc">${sec.desc}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

function generate() {
  const promptOut = document.getElementById('promptOut');
  const negativeOut = document.getElementById('negativeOut');
  const negativeSection = document.getElementById('negativeSection');

  if (promptOut) {
    promptOut.value = buildPrompt(state);
  }

  const negText = buildNegativePrompt(state);
  if (negativeOut) {
    negativeOut.value = negText;
    if (negativeSection) {
      negativeSection.style.display = negText ? 'block' : 'none';
    }
  }

  renderTimeline();
}

function maybeRegenerate() {
  saveLastState(state);
  generate();
}

function updatePresetPlaceholder() {
  const pInput = document.getElementById('presetNameInput');
  if (pInput) {
    pInput.placeholder = state.trackTitle
      ? `プリセット名 (空欄なら「${state.trackTitle}」)`
      : 'プリセット名 (例: 暴走テキサスシャッフル)';
  }
}

function renderPresets() {
  const container = document.getElementById('presetChips');
  if (!container) return;
  container.innerHTML = '';

  const presets = getPresets();
  const names = Object.keys(presets);

  if (names.length === 0) {
    const note = document.createElement('span');
    note.style.color = 'var(--text-sub)';
    note.style.fontSize = '0.84rem';
    note.textContent = '保存されたプリセットはありません';
    container.appendChild(note);
    return;
  }

  names.forEach(name => {
    const item = document.createElement('span');
    item.className = 'preset-item';

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = name;
    b.addEventListener('click', () => {
      applyState(presets[name]);
      generate();
      saveLastState(state);
      flash(`「${name}」を読み込みました🎸`);
    });

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'preset-del';
    del.textContent = '×';
    del.title = '削除';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      deletePreset(name);
      renderPresets();
      flash(`「${name}」を削除しました`);
    });

    item.appendChild(b);
    item.appendChild(del);
    container.appendChild(item);
  });
}

function applyState(obj) {
  if (!obj) return;
  state.trackTitle = obj.trackTitle || '';
  state.style = obj.style || 'neo_garage_fuzz';
  state.vocalStyle = obj.vocalStyle || 'raspy_grit';
  state.insts = new Set(obj.insts || []);
  state.hooks = new Set(obj.hooks || []);
  state.lyricTheme = obj.lyricTheme || 'overwork_deadline';
  state.customLyrics = obj.customLyrics || '';
  state.progression = obj.progression || 'standard_12bar_e';
  state.tempo = Number(obj.tempo) || 92;
  state.duration = obj.duration || '60';
  state.lang = obj.lang || 'ja';
  state.aiTarget = obj.aiTarget || 'suno_udio';
  state.negatives = new Set(obj.negatives || []);

  const titleInput = document.getElementById('trackTitleInput');
  if (titleInput) titleInput.value = state.trackTitle;
  updatePresetPlaceholder();

  buildSingleChips(document.getElementById('styleChips'), STYLES, state.style, (id) => {
    state.style = id;
    maybeRegenerate();
  });

  buildMultiChips(document.getElementById('instChips'), INSTRUMENTS, state.insts, maybeRegenerate);
  buildMultiChips(document.getElementById('hookChips'), BUZZ_HOOKS, state.hooks, maybeRegenerate);
  buildMultiChips(document.getElementById('negativeChips'), NEGATIVE_OPTIONS, state.negatives, maybeRegenerate);

  // 尺チップ
  const durContainer = document.getElementById('durationChips');
  if (durContainer) {
    durContainer.innerHTML = '';
    DURATIONS.forEach(d => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.duration === d.id ? ' on' : '');
      b.textContent = d.label;
      b.addEventListener('click', () => {
        state.duration = d.id;
        [...durContainer.children].forEach(c => c.classList.remove('on'));
        b.classList.add('on');
        maybeRegenerate();
      });
      durContainer.appendChild(b);
    });
  }

  // セレクトボックスの反映
  const vocalSelect = document.getElementById('vocalSelect');
  if (vocalSelect) vocalSelect.value = state.vocalStyle;

  const progSelect = document.getElementById('progSelect');
  if (progSelect) progSelect.value = state.progression;

  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) themeSelect.value = state.lyricTheme;

  const aiTargetSelect = document.getElementById('aiTargetSelect');
  if (aiTargetSelect) aiTargetSelect.value = state.aiTarget;

  // テンポ
  const tempoRange = document.getElementById('tempoRange');
  const tempoReadout = document.getElementById('tempoReadout');
  if (tempoRange && tempoReadout) {
    tempoRange.value = state.tempo;
    tempoReadout.innerHTML = state.tempo + '<span> BPM</span>';
  }

  // 言語トグル
  document.querySelectorAll('#langToggle button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === state.lang);
  });
}

function init() {
  const urlState = loadFromURLHash();
  const lastState = loadLastState();
  applyState(urlState || lastState || state);

  // 曲名入力
  const titleInput = document.getElementById('trackTitleInput');
  if (titleInput) {
    titleInput.addEventListener('input', (e) => {
      state.trackTitle = e.target.value;
      updatePresetPlaceholder();
      maybeRegenerate();
    });
  }

  // 🎲 曲名ガチャ
  const randomTitleBtn = document.getElementById('randomTitleBtn');
  if (randomTitleBtn) {
    randomTitleBtn.addEventListener('click', () => {
      const rand = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
      state.trackTitle = rand;
      if (titleInput) titleInput.value = rand;
      updatePresetPlaceholder();
      maybeRegenerate();
      flash(`「${rand}」をセットしました🥃`);
    });
  }

  // テンポ
  const tempoRange = document.getElementById('tempoRange');
  const tempoReadout = document.getElementById('tempoReadout');
  if (tempoRange && tempoReadout) {
    tempoRange.addEventListener('input', () => {
      state.tempo = tempoRange.value;
      tempoReadout.innerHTML = state.tempo + '<span> BPM</span>';
      maybeRegenerate();
    });
  }

  // セレクトイベント
  document.getElementById('vocalSelect')?.addEventListener('change', (e) => {
    state.vocalStyle = e.target.value;
    maybeRegenerate();
  });

  document.getElementById('progSelect')?.addEventListener('change', (e) => {
    state.progression = e.target.value;
    maybeRegenerate();
  });

  document.getElementById('themeSelect')?.addEventListener('change', (e) => {
    state.lyricTheme = e.target.value;
    const themeObj = LYRIC_THEMES.find(t => t.id === state.lyricTheme);
    if (themeObj && themeObj.title && (!state.trackTitle || TITLE_SUGGESTIONS.includes(state.trackTitle))) {
      state.trackTitle = themeObj.title;
      if (titleInput) titleInput.value = themeObj.title;
      updatePresetPlaceholder();
    }
    maybeRegenerate();
  });

  document.getElementById('aiTargetSelect')?.addEventListener('change', (e) => {
    state.aiTarget = e.target.value;
    maybeRegenerate();
  });

  // 言語切替
  document.querySelectorAll('#langToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#langToggle button').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      state.lang = btn.dataset.lang;
      saveLastState(state);
      generate();
    });
  });

  // 生成ボタン
  document.getElementById('genBtn')?.addEventListener('click', generate);

  // 🎲 おまかせ生成
  document.getElementById('randomBtn')?.addEventListener('click', () => {
    function sample(arr, min, max) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      const sh = [...arr].sort(() => Math.random() - 0.5);
      return sh.slice(0, n).map(i => i.id);
    }
    state.trackTitle = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
    if (titleInput) titleInput.value = state.trackTitle;
    updatePresetPlaceholder();

    state.style = STYLES[Math.floor(Math.random() * STYLES.length)].id;
    state.vocalStyle = VOCAL_STYLES[Math.floor(Math.random() * (VOCAL_STYLES.length - 1))].id;
    state.insts = new Set(sample(INSTRUMENTS, 3, 5));
    state.hooks = new Set(sample(BUZZ_HOOKS, 2, 4));
    state.lyricTheme = LYRIC_THEMES[Math.floor(Math.random() * (LYRIC_THEMES.length - 1))].id;
    state.tempo = 78 + Math.floor(Math.random() * 38); // 78〜115 BPM
    const progKeys = Object.keys(PROGRESSIONS);
    state.progression = progKeys[Math.floor(Math.random() * progKeys.length)];

    applyState(state);
    generate();
    saveLastState(state);
    flash(`🎲 おまかせブルース「${state.trackTitle}」を作成しました🔥`);
  });

  // リセット
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    state.trackTitle = 'ミッドナイト・残業ブルース';
    state.style = 'neo_garage_fuzz';
    state.vocalStyle = 'raspy_grit';
    state.insts = new Set(['slide_resonator', 'fuzz_electric_gtr', 'crying_harmonica', 'sub_808_bass']);
    state.hooks = new Set(['intro_killer_riff', 'heavy_sub_kick', 'call_and_response']);
    state.lyricTheme = 'overwork_deadline';
    state.progression = 'standard_12bar_e';
    state.tempo = 92;
    state.duration = '60';
    state.negatives = new Set(['no_autotune', 'no_cheap_synth']);

    applyState(state);
    generate();
    saveLastState(state);
    flash('設定をリセットしました');
  });

  // プリセット保存
  document.getElementById('savePresetBtn')?.addEventListener('click', () => {
    const input = document.getElementById('presetNameInput');
    let name = input.value.trim();
    if (!name && state.trackTitle) {
      name = state.trackTitle.trim();
    }
    if (!name) {
      flash('プリセット名を入力してください');
      return;
    }
    if (savePreset(name, state)) {
      input.value = '';
      renderPresets();
      flash(`「${name}」を保存しました💾`);
    }
  });

  // プリセット書き出し
  document.getElementById('exportPresetBtn')?.addEventListener('click', () => {
    exportPresetsAsJSON();
    flash('プリセットを書き出しました');
  });

  // プリセット取り込み
  const fileInput = document.getElementById('importPresetFile');
  document.getElementById('importPresetBtn')?.addEventListener('click', () => {
    fileInput?.click();
  });
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importPresetsFromJSON(file, (success, count, errMsg) => {
        if (success) {
          renderPresets();
          flash(`${count}件のプリセットを取り込みました`);
        } else {
          flash(errMsg || '読み込みに失敗しました');
        }
        fileInput.value = '';
      });
    }
  });

  // 共有URLコピー
  document.getElementById('shareUrlBtn')?.addEventListener('click', async () => {
    const url = getShareURL(state);
    try {
      await navigator.clipboard.writeText(url);
      flash('共有用URLをコピーしました！🔗');
    } catch (e) {
      prompt('以下のURLをコピーしてください:', url);
    }
  });

  // プロンプトコピー
  document.getElementById('copyBtn')?.addEventListener('click', async () => {
    const out = document.getElementById('promptOut');
    if (!out || !out.value) return;
    try {
      await navigator.clipboard.writeText(out.value);
      flash('プロンプトをコピーしました！📋');
    } catch (e) {
      out.select();
      document.execCommand('copy');
      flash('コピーしました！');
    }
  });

  // 除外指示コピー
  document.getElementById('copyNegBtn')?.addEventListener('click', async () => {
    const out = document.getElementById('negativeOut');
    if (!out || !out.value) return;
    try {
      await navigator.clipboard.writeText(out.value);
      flash('除外指示をコピーしました！');
    } catch (e) {
      out.select();
      document.execCommand('copy');
      flash('コピーしました！');
    }
  });

  // プレビュー再生
  const playBtn = document.getElementById('previewToggleBtn');
  const previewVolume = document.getElementById('previewVolume');
  const barBulbs = document.querySelectorAll('.bar-bulb');

  previewVolume?.addEventListener('input', (e) => {
    neoBluesAudio.setVolume(parseFloat(e.target.value));
  });

  playBtn?.addEventListener('click', () => {
    neoBluesAudio.toggle(
      () => state,
      (currentBar, currentBeat) => {
        barBulbs.forEach((bulb, idx) => {
          bulb.classList.toggle('active', idx === currentBar);
        });
      },
      (isPlaying) => {
        if (isPlaying) {
          playBtn.textContent = '■ STOP (停止)';
          playBtn.classList.add('playing');
        } else {
          playBtn.textContent = '▶ PLAY (12小節シャッフル試聴)';
          playBtn.classList.remove('playing');
          barBulbs.forEach(bulb => bulb.classList.remove('active'));
        }
      }
    );
  });

  // PWA インストール処理
  let deferredPrompt = null;
  const installPwaBtn = document.getElementById('installPwaBtn');
  const installGuideBtn = document.getElementById('installGuideBtn');
  const installModal = document.getElementById('installModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  // すでにアプリとして起動しているかチェック
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) {
    if (installPwaBtn) installPwaBtn.style.display = 'none';
    if (installGuideBtn) installGuideBtn.style.display = 'none';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installPwaBtn && !isStandalone) {
      installPwaBtn.style.display = 'inline-flex';
    }
  });

  installPwaBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      flash('アプリのインストールを開始しました！🎉');
    }
    deferredPrompt = null;
    installPwaBtn.style.display = 'none';
  });

  window.addEventListener('appinstalled', () => {
    if (installPwaBtn) installPwaBtn.style.display = 'none';
    if (installGuideBtn) installGuideBtn.style.display = 'none';
    flash('ホーム画面にインストールされました！📱');
  });

  // インストール手順モーダル開閉
  installGuideBtn?.addEventListener('click', () => {
    installModal?.classList.add('show');
  });

  const closeModal = () => {
    installModal?.classList.remove('show');
  };

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOkBtn?.addEventListener('click', closeModal);
  installModal?.addEventListener('click', (e) => {
    if (e.target === installModal) closeModal();
  });

  renderPresets();
  generate();
  saveLastState(state);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

