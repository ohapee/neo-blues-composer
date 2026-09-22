import { DEFAULT_PRESETS } from './data.js';

const STORAGE_KEY_LAST = 'neo_blues_composer_last_state';
const STORAGE_KEY_PRESETS = 'neo_blues_composer_presets';
const STORAGE_KEY_DELETED = 'neo_blues_composer_deleted_presets';

export function saveLastState(state) {
  try {
    const serialized = serializeState(state);
    localStorage.setItem(STORAGE_KEY_LAST, JSON.stringify(serialized));
  } catch (e) {
    console.error('Failed to save last state:', e);
  }
}

export function loadLastState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST);
    if (!raw) return null;
    return deserializeState(JSON.parse(raw));
  } catch (e) {
    console.error('Failed to load last state:', e);
    return null;
  }
}

export function getPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
    const presets = raw ? JSON.parse(raw) : {};

    const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
    const deletedList = new Set(deletedRaw ? JSON.parse(deletedRaw) : []);

    let needsSave = false;
    for (const [key, val] of Object.entries(DEFAULT_PRESETS || {})) {
      if (!presets[key] && !deletedList.has(key)) {
        presets[key] = val;
        needsSave = true;
      }
    }
    if (needsSave) {
      localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
    }

    return presets;
  } catch (e) {
    return { ...(DEFAULT_PRESETS || {}) };
  }
}

export function savePreset(name, state) {
  try {
    const presets = getPresets();
    presets[name] = serializeState(state);
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
    return true;
  } catch (e) {
    console.error('Failed to save preset:', e);
    return false;
  }
}

export function deletePreset(name) {
  try {
    const presets = getPresets();
    delete presets[name];
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));

    if (DEFAULT_PRESETS && DEFAULT_PRESETS[name]) {
      const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
      const deletedList = new Set(deletedRaw ? JSON.parse(deletedRaw) : []);
      deletedList.add(name);
      localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify([...deletedList]));
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function exportPresetsAsJSON() {
  const presets = getPresets();
  const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neo_blues_presets_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importPresetsFromJSON(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid format');
      }
      const existing = getPresets();
      const merged = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(merged));
      callback(true, Object.keys(data).length);
    } catch (err) {
      callback(false, 0, err.message);
    }
  };
  reader.readAsText(file);
}

export function getShareURL(state) {
  const serialized = serializeState(state);
  const json = JSON.stringify(serialized);
  const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  const base = window.location.href.split('#')[0];
  return `${base}#state=${encoded}`;
}

export function loadFromURLHash() {
  try {
    const hash = window.location.hash;
    if (!hash.includes('state=')) return null;
    const match = hash.match(/state=([^&]+)/);
    if (!match) return null;
    const decoded = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
    const obj = JSON.parse(decoded);
    return deserializeState(obj);
  } catch (e) {
    console.error('Failed to load state from hash:', e);
    return null;
  }
}

function serializeState(s) {
  return {
    trackTitle: s.trackTitle,
    style: s.style,
    vocalStyle: s.vocalStyle,
    insts: Array.from(s.insts || []),
    hooks: Array.from(s.hooks || []),
    lyricTheme: s.lyricTheme,
    customLyrics: s.customLyrics || '',
    progression: s.progression,
    tempo: s.tempo,
    duration: s.duration,
    lang: s.lang,
    aiTarget: s.aiTarget,
    negatives: Array.from(s.negatives || [])
  };
}

function deserializeState(obj) {
  return {
    ...obj,
    insts: new Set(obj.insts || []),
    hooks: new Set(obj.hooks || []),
    negatives: new Set(obj.negatives || [])
  };
}
