/**
 * ネオ・ブルース・コンポーザー - プロンプト生成エンジン
 * 伝統のブルースの魂と現代SNSのバズ要素を統合したプロンプトを構築
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
  NEGATIVE_OPTIONS
} from './data.js';

export function buildPrompt(state) {
  const isEn = state.lang === 'en';
  const styleObj = STYLES.find(s => s.id === state.style) || STYLES[0];
  const vocalObj = VOCAL_STYLES.find(v => v.id === state.vocalStyle) || VOCAL_STYLES[0];
  const progObj = PROGRESSIONS[state.progression] || PROGRESSIONS.standard_12bar_e;
  const themeObj = LYRIC_THEMES.find(t => t.id === state.lyricTheme) || LYRIC_THEMES[0];

  const selectedInsts = INSTRUMENTS.filter(i => state.insts.has(i.id));
  const selectedHooks = BUZZ_HOOKS.filter(h => state.hooks.has(h.id));

  // Suno / Udio 形式
  if (state.aiTarget === 'suno_udio') {
    return buildSunoUdioPrompt(state, styleObj, vocalObj, progObj, themeObj, selectedInsts, selectedHooks, isEn);
  }

  // Google Flow Music 形式
  if (state.aiTarget === 'flow') {
    return buildFlowPrompt(state, styleObj, vocalObj, progObj, themeObj, selectedInsts, selectedHooks, isEn);
  }

  // シンプル形式
  return buildPlainPrompt(state, styleObj, vocalObj, progObj, themeObj, selectedInsts, selectedHooks, isEn);
}

function buildSunoUdioPrompt(state, style, vocal, prog, theme, insts, hooks, isEn) {
  // スタイルタグの構築
  const tags = [];
  tags.push(style.en);
  tags.push(`${state.tempo} BPM`);
  tags.push(prog.en);
  if (vocal.id !== 'instrumental') {
    tags.push(vocal.en);
  } else {
    tags.push('instrumental, no vocals');
  }

  insts.forEach(i => tags.push(i.en));
  hooks.forEach(h => tags.push(h.en));

  // 歌詞ブロックの構築
  let lyricsText = '';
  if (vocal.id !== 'instrumental') {
    const isCustom = state.lyricTheme === 'custom' && state.customLyrics;
    let lLines = [];
    if (isCustom) {
      lLines = state.customLyrics.split('\n').filter(l => l.trim().length > 0);
    } else {
      lLines = isEn ? theme.lyrics.en : theme.lyrics.ja;
    }

    lyricsText = `
[Intro - Explosive Killer Riff & Stomps]
${hooks.some(h => h.id === 'raw_vocal_shout') ? '(Acapella Holler Shout)\n' : ''}
[Verse 1 - 12-Bar Blues AAB Call & Response]
${lLines.join('\n')}

[Guitar Solo - Crying Bends & Heavy Low-End Groove]
(Weeping bottleneck slide & roaring tube amp distortion)

[Outro - Final Stomp Holler]
(Big crash finish)`;
  } else {
    lyricsText = `
[Instrumental Structure]
[Intro - Heavy Signature Riff]
[Section A - 12-Bar Blues Lead Guitar & Blues Harp]
[Section B - Dynamic Solo Escalation & Thumping Bass]
[Outro - Grand Stomp Finish]`;
  }

  const titleHeader = state.trackTitle ? `### Track: ${state.trackTitle}\n\n` : '';

  return `${titleHeader}=== [Style & Instrumentation Tags] ===
${tags.join(', ')}

=== [Track Structure & Lyrics] ===
${lyricsText.trim()}`;
}

function buildFlowPrompt(state, style, vocal, prog, theme, insts, hooks, isEn) {
  const titlePart = state.trackTitle ? (isEn ? `Track Title: "${state.trackTitle}"\n` : `曲名: 「${state.trackTitle}」\n`) : '';

  if (isEn) {
    return `${titlePart}Generate a powerful, viral-ready modern blues track in the style of ${style.en}.
- Tempo: ${state.tempo} BPM, played with authentic shuffle groove.
- Chord Progression: ${prog.en}.
- Vocal Style: ${vocal.en}.
- Key Instruments: ${insts.map(i => i.en).join('; ')}.
- Viral Hook Elements: ${hooks.map(h => h.en).join('; ')}.
- Theme & Mood: Inspired by everyday struggles ("${theme.label}"), balancing raw emotional authenticity with punchy modern production.
- Mix & Production: Warm vintage tube amp saturation combined with crisp modern punch and floor-shaking bass. Instant killer hook right from 0:00.`;
  }

  return `${titlePart}【音楽ジャンル・スタイル】
現代のバイラルヒットを狙った「${style.ja}」。
伝統的なブルースの生々しい泥臭さと、現代的な重低音・音圧をハイブリッドに融合したキラーチューン。

【テンポ・和声】
・テンポ: ${state.tempo} BPM（心地よく体が揺れるシャッフルグルーヴ）
・コード進行: ${prog.ja}

【ボーカル・声質】
・ボーカル指定: ${vocal.ja}

【楽器編成・サウンド】
${insts.map(i => `・${i.ja}`).join('\n')}

【バズ・キラーフック要素】
${hooks.map(h => `・${h.ja}`).join('\n')}

【テーマ・歌詞世界観】
テーマ: 「${theme.label}」
ブルース伝統のAAB形式（同じフレーズを2回繰り返し、3行目でオチをつけるコール＆レスポンス）を取り入れ、現代のリアルな悲哀や愚痴をユーモアと熱い魂で歌い飛ばす。冒頭0秒からリスナーの耳を掴むフック構成。`;
}

function buildPlainPrompt(state, style, vocal, prog, theme, insts, hooks, isEn) {
  const titlePart = state.trackTitle ? `"${state.trackTitle}" - ` : '';
  if (isEn) {
    return `${titlePart}A viral modern blues track in ${style.en} at ${state.tempo} BPM. Features ${prog.en}, ${vocal.en}, with ${insts.map(i => i.en).join(', ')}. Engineered with ${hooks.map(h => h.en).join(', ')}, telling a story of ${theme.label}.`;
  }
  return `${titlePart}${state.tempo} BPMの「${style.ja}」。${prog.ja}を基調とし、ボーカルは「${vocal.ja}」。楽器は${insts.map(i => i.ja).join('、')}で構成。バズ要素として${hooks.map(h => h.ja).join('、')}を取り入れた、現代人の「${theme.label}」を歌い飛ばすキラーブルース。`;
}

export function buildNegativePrompt(state) {
  const isEn = state.lang === 'en';
  const selected = NEGATIVE_OPTIONS.filter(opt => state.negatives.has(opt.id));
  if (selected.length === 0) return '';

  if (isEn) {
    return selected.map(s => s.en).join(', ');
  }
  return selected.map(s => s.ja).join('、');
}

export function buildTimelineData(state) {
  const durSec = Number(state.duration) || 60;
  const isEn = state.lang === 'en';

  if (durSec === 15) {
    return [
      {
        time: '0:00 - 0:04',
        label: isEn ? 'Intro Hook' : '冒頭キラーリフ',
        desc: isEn ? 'Immediate signature slide/fuzz guitar riff & acapella holler' : '冒頭1秒で耳を奪うスライド/ファズギターリフ ＆ 魂の咆哮'
      },
      {
        time: '0:04 - 0:11',
        label: isEn ? '12-Bar Punch' : 'AABパンチライン',
        desc: isEn ? 'Explosive drum drop, heavy sub-bass, and quick AAB punchline' : '太いドラムと重低音808がドロップ。切れ味鋭いリリック'
      },
      {
        time: '0:11 - 0:15',
        label: isEn ? 'Outro Impact' : 'ストンプ・エンディング',
        desc: isEn ? 'High-energy turnaround lick and sudden stomp crash' : '最高潮のチョーキングソロと地響きストンプでフィニッシュ'
      }
    ];
  }

  if (durSec === 30) {
    return [
      {
        time: '0:00 - 0:06',
        label: isEn ? 'Intro & Groove Drop' : 'イントロ＆ビートドロップ',
        desc: isEn ? 'Raw opening riff, foot stomps, bassline explodes into groove' : '生々しいギターリフと足踏み、一気に極太のベースラインが合流'
      },
      {
        time: '0:06 - 0:20',
        label: isEn ? 'Verse (AAB Call & Response)' : 'AAB歌唱（コール＆レスポンス）',
        desc: isEn ? 'Gritty vocal delivery answered note-for-note by crying guitar' : 'しゃがれ声の魂の叫びと、それに呼応するギターの掛け合い'
      },
      {
        time: '0:20 - 0:30',
        label: isEn ? 'Solo & Peak Stomp' : '泣きのギターソロ＆クライマックス',
        desc: isEn ? 'Passionate bottleneck slide peak, explosive finale crash' : '感情が昂るスライドギターのピークと圧巻のブレイク'
      }
    ];
  }

  if (durSec === 60) {
    return [
      {
        time: '0:00 - 0:10',
        label: isEn ? 'Intro Signature Riff' : 'シグネチャーリフ・イントロ',
        desc: isEn ? 'Atmospheric acoustic slide, tube amp hum, foot stomps establish groove' : '真空管アンプのハム音、スライドギターの単音リフ、足踏みでグルーヴ開始'
      },
      {
        time: '0:10 - 0:28',
        label: isEn ? 'Verse 1 (12-Bar Cycle)' : '第1コーラス（12小節展開）',
        desc: isEn ? 'AAB lyric delivery over driving shuffle rhythm section' : '跳ねるシャッフルリズムに乗せたAAB形式の現代ブルースリリック'
      },
      {
        time: '0:28 - 0:48',
        label: isEn ? 'Blues Harp & Guitar Solo' : 'ブルースハープ＆ギターソロ',
        desc: isEn ? 'Distorted harmonica wail alternating with soaring guitar bends' : '歪んだハーモニカの咆哮と咽び泣くチョーキングギターの激突'
      },
      {
        time: '0:48 - 1:00',
        label: isEn ? 'Outro Turnaround' : 'アウトロ・ターンアラウンド',
        desc: isEn ? 'Full-band crescendo, signature blues turnaround lick, final hit' : 'バンド全員によるクレッシェンド、定番ターンアラウンドからの一撃締め'
      }
    ];
  }

  // フル尺
  return [
    {
      time: '0:00 - 0:15',
      label: isEn ? 'Intro & Field Holler' : 'イントロ＆咆哮ハラー',
      desc: isEn ? 'Slow-burn acoustic build erupting into full electrified groove' : '静かなアコギから突如爆発するエレクトリック・バンドサウンド'
    },
    {
      time: '0:15 - 0:45',
      label: isEn ? 'Verse 1 (12-Bar Blues)' : '第1コーラス（12小節ブルース）',
      desc: isEn ? 'First AAB lyrical progression establishing the story' : '物語を提示する第1のAABリリック'
    },
    {
      time: '0:45 - 1:15',
      label: isEn ? 'Verse 2 (Intensified)' : '第2コーラス（熱量増幅）',
      desc: isEn ? 'Deeper emotional delivery with organ swells and backing calls' : 'ハモンドオルガンのうねりとコーラスの掛け合いで熱量アップ'
    },
    {
      time: '1:15 - 2:00',
      label: isEn ? 'Extended Guitar Solo' : '長尺ブルースギターソロ',
      desc: isEn ? 'Virtuosic, weeping bends, slide runs, and dynamic rhythm breakdown' : '魂を揺さぶるチョーキング、スライド奏法、ドラムブレイクダウン'
    },
    {
      time: '2:00 - 2:40',
      label: isEn ? 'Final Verse & Peak' : '最終コーラス＆大団円',
      desc: isEn ? 'Maximum vocal intensity, full horns, driving bassline' : '限界まで叫ぶボーカル、ホーンセクションの乱舞、疾走するベース'
    },
    {
      time: '2:40 - 3:00',
      label: isEn ? 'Grand Outro & Cadence' : '壮大なアウトロ・終止',
      desc: isEn ? 'Classic blues cadence with fading amplifier feedback' : '伝統的なブルース終止と、余韻を残すアンプのフィードバック音'
    }
  ];
}
