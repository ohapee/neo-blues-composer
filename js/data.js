/**
 * ネオ・ブルース・コンポーザー - 設定データ定義
 * 伝統のブルースの魂 × 現代のバズ要素（重低音・SNSフック・現代の愚痴AAB歌詞）
 */

// ブルース・スタイル（サブジャンル × 現代ハイブリッド）
export const STYLES = [
  {
    id: 'neo_garage_fuzz',
    ja: 'ネオ・ガレージ・ファズ (Black Keys / Jack White調)',
    en: 'raw neo-garage blues rock with heavy fuzz guitar, explosive stomp drums, and vintage overdrive grit',
    desc: '過激に歪んだファズギターと極太のドラム。現代のフェスやショート動画で最もテンションがアガるバズ系ブルース。'
  },
  {
    id: 'cyber_trap_blues',
    ja: 'サイバー・トラップ・ブルース (808重低音 × スライドギター)',
    en: 'modern dark trap blues fusion with booming 808 sub-bass, rattling hi-hats, and haunting delta slide guitar',
    desc: 'TikTokや海外SNSで熱狂を生む新世代スタイル。地を這う重低音808ベースに泥臭いボトルネックスライドが絡み合う。'
  },
  {
    id: 'delta_swamp',
    ja: 'デルタ・スワンプ (泥臭い生音アコギ × 足踏みストンプ)',
    en: 'authentic deep Mississippi delta swamp blues with resonator slide guitar, heavy wooden porch stomps, and raw field holler spirit',
    desc: 'ミシシッピの泥水と綿花畑の原初体験。木造ポーチを踏み鳴らす足拍子とリゾネーターギターの生々しい叫び。'
  },
  {
    id: 'chicago_electric',
    ja: 'シカゴ・エレクトリック (真空管アンプ歪み × 咆哮ハーモニカ)',
    en: 'electrified 1950s Chicago blues with roaring amplified blues harp, stinging guitar bends, and a driving rhythm section',
    desc: 'マディ・ウォーターズ直系の都会的でタフなサウンド。小型チューブアンプを限界まで歪ませたブルースハープが炸裂。'
  },
  {
    id: 'texas_shuffle',
    ja: 'テキサス・シャッフル (Stevie Ray Vaughan調・切れ味抜群)',
    en: 'high-octane Texas blues shuffle with ferocious Stratocaster tone, lightning-fast turnaround licks, and swinging groove',
    desc: 'ハイウェイをぶっ飛ばすような疾走感。強烈にハネるシャッフルビートと鋭利なストラトキャスターのチョーキング。'
  },
  {
    id: 'midnight_soul_bar',
    ja: 'ミッドナイト・ソウル・バー (深夜の酒場・泣きのサックス＆オルガン)',
    en: 'smoky midnight soul blues with weeping electric guitar solos, warm Hammond B3 organ swells, and sultry brass horns',
    desc: '煙草の煙が漂う真夜中のバー。グラスの氷が溶ける音と、ハモンドオルガン、泣きのギターソロが心に沁みるスローブルース。'
  },
  {
    id: 'jump_swing_jive',
    ja: 'ジャンプ・スウィング・ジャイヴ (陽気なホーン・踊れるレトロ)',
    en: 'upbeat retro jump blues and swing jive with punchy brass horns, boogie-woogie piano, and infectious dance party vibes',
    desc: 'ロックンロール前夜の熱気。跳ねるウォーキングベースと華やかなホーンセクションで誰もが踊り出す陽気なビート。'
  }
];

// 楽器・音色編成
export const INSTRUMENTS = [
  { id: 'slide_resonator', ja: 'ボトルネックスライド (リゾネーターギター)', en: 'metallic resonator guitar with weeping bottleneck slide bends' },
  { id: 'fuzz_electric_gtr', ja: '爆音ファズ・エレキギター (チューブアンプ歪み)', en: 'cranked vintage tube amp guitar with gritty fuzz distortion' },
  { id: 'crying_harmonica', ja: 'むせび泣くブルースハープ (歪みマイク)', en: 'cupped bullet-mic distorted blues harmonica wails' },
  { id: 'sub_808_bass', ja: '現代的808サブベース (腹に響く重低音)', en: 'booming modern 808 sub-bass providing deep floor-shaking low-end' },
  { id: 'hammond_b3', ja: 'ハモンドオルガン B3 (ロータリースピーカー)', en: 'warm, trembling Hammond B3 organ with Leslie rotating speaker' },
  { id: 'walking_upright_bass', ja: 'ウッドベース (重厚なウォーキングベース)', en: 'thick, thumping acoustic upright bass walking rhythm' },
  { id: 'foot_stomp_claps', ja: '地響き足踏み (Stomp) ＆ 手拍子 (Clap)', en: 'thunderous wooden porch stomps and gritty handclaps' },
  { id: 'vintage_brass_horns', ja: 'ヴィンテージ・ホーン (サックス・ブラス)', en: 'smoky tenor saxophone and punchy brass stabs' },
  { id: 'honky_tonk_piano', ja: 'ホンキートンク・ピアノ (転がるブギウギ)', en: 'tack-piano blues riffs and rolling boogie-woogie left-hand bass' }
];

// ボーカル質感
export const VOCAL_STYLES = [
  {
    id: 'raspy_grit',
    label: 'スモーキー＆しゃがれ声 (魂の咆哮・ハスキー)',
    ja: 'タバコとウイスキーで焼けたような、しゃがれた男の咆哮。感情が溢れるハスキーボーカル。',
    en: 'raw, raspy, smoke-and-whiskey textured gritty male vocal delivering visceral soul shouts'
  },
  {
    id: 'soulful_belting',
    label: 'ソウルフル・ベルティング (高音シャウト・熱唱)',
    ja: 'ゴスペル仕込みの圧倒的な声量と、胸を締め付ける高音のシャウト＆ヴィブラート。',
    en: 'powerful gospel-tinged soulful vocal belting with emotional chest resonance and cry'
  },
  {
    id: 'delta_spoken_holler',
    label: 'デルタ風スポークン＆ハラー (呟きと突然の叫び)',
    ja: 'ボソボソと呟くような語り口から、突如感情を爆発させて叫ぶデルタ・ブルースマンの語り。',
    en: 'intimate spoken-word murmurs suddenly bursting into passionate field holler shouts'
  },
  {
    id: 'female_blues_queen',
    label: 'ブルース・クイーン (艶やかで力強い女性ボーカル)',
    ja: 'エタ・ジェイムズやベッシー・スミスを思わせる、太く艶やかで堂々たる女性ボーカル。',
    en: 'commanding, sultry female blues queen vocal filled with swagger, heartbreak, and iron resilience'
  },
  {
    id: 'instrumental',
    label: '完全インストゥルメンタル (歌声なし・楽器のみ)',
    ja: 'ギターやハーモニカが歌の代わりにリードを執る、骨太なインストゥルメンタル。',
    en: 'pure instrumental blues with lead guitar and harmonica carrying the melodic voice, no vocals'
  }
];

// バズ要素・キラーフック（SNSで一瞬で耳を掴むスパイス）
export const BUZZ_HOOKS = [
  { id: 'intro_killer_riff', ja: '冒頭1秒で耳を奪うキラーギターリフ', en: 'instant high-energy opening signature guitar hook in the very first second' },
  { id: 'heavy_sub_kick', ja: 'スマホのスピーカーでも鳴り響く極太キック＆重低音', en: 'punchy modern kick drum and heavy low-end engineered for mobile phone speakers' },
  { id: 'raw_vocal_shout', ja: '曲頭の無伴奏アカペラ咆哮 (Intro Holler)', en: 'explosive unaccompanied vocal scream opening the track before instruments drop' },
  { id: 'call_and_response', ja: '歌とギターの激しい掛け合い (Call & Response)', en: 'dynamic call-and-response interplay where the guitar answers every vocal phrase' },
  { id: 'stomp_groove', ja: '自然に体が揺れる足踏みストンプ＆クラップ', en: 'infectious stomp-and-clap rhythmic backbone that commands head-nodding' },
  { id: 'slow_burn_crescendo', ja: '静寂から一気に爆発するダイナミクス展開', en: 'dramatic quiet intro erupting into an earth-shattering full-band crescendo' }
];

// 現代の悲哀・愚痴テーマ（AAB形式リリック自動生成）
export const LYRIC_THEMES = [
  {
    id: 'overwork_deadline',
    label: '残業・締め切り・終わらない仕事',
    title: 'ミッドナイト・残業ブルース',
    lyrics: {
      ja: [
        'A1: 昨日の夜もオフィスで夜が明けた、机の上には冷めたコーヒー',
        'A2: 昨日の夜もオフィスで夜が明けた、締め切りに追われて目の奥が疼く',
        'B: パソコンを叩き割って、安いウイスキーを一気にあおりたいぜ'
      ],
      en: [
        '[Verse 1 - A]',
        'I saw the sunrise from my swivel chair, cold black coffee in my cup',
        '[Verse 1 - A]',
        'Yeah, the sun came up while I was working late, and the boss man won\'t let up',
        '[Verse 1 - B]',
        'Gonna shut this laptop down for good, pour some whiskey in my gut'
      ]
    }
  },
  {
    id: 'empty_wallet',
    label: '金欠・物価高・空っぽの財布',
    title: '空っぽ財布のハイウェイ・ブルース',
    lyrics: {
      ja: [
        'A1: 給料日だってのに、俺の財布の中には冷たい隙間風',
        'A2: 給料日だってのに、スーパーで値札を見るたび涙がこぼれ落ちる',
        'B: だけど俺のポケットのブルースだけは、誰にも奪えやしないのさ'
      ],
      en: [
        '[Verse 1 - A]',
        'Just got paid this morning, but my wallet\'s blowing cold cold dust',
        '[Verse 1 - A]',
        'Lord, I just got paid this morning, and the prices make a poor man cuss',
        '[Verse 1 - B]',
        'They can take all my green money, but this blues they cannot bust'
      ]
    }
  },
  {
    id: 'sns_burnout',
    label: 'スマホ・SNS疲れ・通知地獄',
    title: 'ブルースクリーン・デジタル・ブルース',
    lyrics: {
      ja: [
        'A1: ピコンと鳴るたびに、胸の奥がチクチク痛みだす',
        'A2: 四六時中光る青白い画面、見知らぬ誰かの自慢話にうんざりだ',
        'B: スマホをドブ川に投げ捨てて、泥だらけのギターをかき鳴らすのさ'
      ],
      en: [
        '[Verse 1 - A]',
        'Every time that little screen rings, my heart skips a bitter beat',
        '[Verse 1 - A]',
        'Yeah, that blue screen keeps on shining, showing lies out in the street',
        '[Verse 1 - B]',
        'Gonna throw my phone down the muddy river, and let the slide guitar take the heat'
      ]
    }
  },
  {
    id: 'midnight_lonely',
    label: '真夜中の孤独・やるせなさ',
    title: '午前3時のスモーキー・ブルース',
    lyrics: {
      ja: [
        'A1: 午前3時の路地裏、雨がアスファルトを静かに濡らす',
        'A2: 午前3時の路地裏、街の灯りはすべて消えて一人きり',
        'B: くゆらす煙草の紫煙と一緒に、やり場のない後悔を吹き飛ばすのさ'
      ],
      en: [
        '[Verse 1 - A]',
        'Three in the morning, cold rain falling down the dark alleyway',
        '[Verse 1 - A]',
        'Yeah, three in the morning, all the streetlights faded to gray',
        '[Verse 1 - B]',
        'Blowing smoke up to the ceiling, watching all my sorrow drift away'
      ]
    }
  },
  {
    id: 'heartbreak_blues',
    label: '大人の失恋・すれ違いの別れ',
    title: '泥水と涙の別れ道',
    lyrics: {
      ja: [
        'A1: お前が出て行ったあとの部屋は、まるで嵐が通り過ぎたみたいだ',
        'A2: テーブルの上に鍵を置いて、お前は二度と振り返らなかった',
        'B: 泥水をすすってでも、俺は一人でこのぬかるんだ道を歩いていく'
      ],
      en: [
        '[Verse 1 - A]',
        'You walked right out the screen door, left my whole world wrecked and torn',
        '[Verse 1 - A]',
        'Left your cold brass key on the counter, didn\'t even look back this morn',
        '[Verse 1 - B]',
        'I\'m gonna pick up this battered guitar, blow my blues on a rusted horn'
      ]
    }
  },
  {
    id: 'custom',
    label: 'オリジナル入力 (自由テーマ)',
    title: '俺のリアルなブルース',
    lyrics: {
      ja: [],
      en: []
    }
  }
];

// 和声・コード進行
export const PROGRESSIONS = {
  standard_12bar_e: {
    ja: '王道12小節ブルース (Eメジャー / ドライブ感・爽快)',
    en: 'classic 12-bar blues progression in Key of E (E7 - A7 - B7) with driving shuffle rhythm',
    scale: 'E Blues / Pentatonic'
  },
  minor_blues_am: {
    ja: '哀愁マイナーブルース (Aマイナー / 泣き・ダーク)',
    en: 'deep emotional 12-bar minor blues progression in Key of Am (Am7 - Dm7 - E7alt)',
    scale: 'A Minor Blues'
  },
  heavy_riff_blues: {
    ja: '1コード押し・リフ主体ブルース (泥臭いワンコードグルーヴ)',
    en: 'hypnotic single-chord swamp blues groove driven by a heavy stomping riff and drone bass',
    scale: 'Open G Tuning Riff'
  },
  slow_blues_g: {
    ja: 'じっくり泣かせるスローブルース (G / 6/8拍子・濃密な夜)',
    en: 'smoky slow 12-bar blues in 6/8 time in Key of G with soaring expressive guitar vibrato',
    scale: 'G Blues / Soul'
  }
};

// 尺・フォーマット
export const DURATIONS = [
  { id: '15', label: '15秒 (TikTok/Reels 冒頭フック特化)', sec: 15 },
  { id: '30', label: '30秒 (YouTube Shorts / SNSリール)', sec: 30 },
  { id: '60', label: '60秒 (1コーラス＋泣きのギターソロ)', sec: 60 },
  { id: 'full', label: 'フル尺展開 (2分〜3分 / 完成曲)', sec: 180 }
];

// 出力先AIモデル
export const AI_TARGETS = [
  { id: 'suno_udio', label: 'Suno / Udio (スタイルタグ＆歌詞ブロック形式)', desc: '[Style: Neo Blues, Fuzz Slide] や [Verse 1] などのタグ最適化' },
  { id: 'flow', label: 'Google Flow Music (詳細インストラクション形式)', desc: 'Flow Music向けに音響・楽器構成・進行を緻密に指示' },
  { id: 'plain', label: 'シンプル文章形式', desc: 'ChatGPTや汎用プロンプト向け' }
];

// ネガティブプロンプト候補
export const NEGATIVE_OPTIONS = [
  { id: 'no_autotune', ja: '過度なオートチューン・ケロケロボイス (生々しさを保護)', en: 'heavy autotune, robotic pitch correction, artificial EDM vocals' },
  { id: 'no_cheap_synth', ja: '安っぽいユーロビートシンセ・チープな電子音', en: 'cheap eurobeat synth, plastic EDM leads, 80s synthpop' },
  { id: 'no_kpop_polish', ja: 'ツルツルに磨かれた無機質なポップス音響 (泥臭さを保護)', en: 'over-polished sterile pop production, clean acoustic elevator music' },
  { id: 'no_distracting_chatter', ja: '曲を邪魔する無駄な歓声・騒がしいMC', en: 'crowd chatter, announcer voice, background talking' }
];

// ブルース曲名ガチャ用のワード
export const TITLE_SUGGESTIONS = [
  'ミッドナイト・残業ブルース',
  '空っぽ財布のハイウェイ・ブルース',
  'ブルースクリーン・デジタル・ブルース',
  '午前3時のスモーキー・バー',
  '泥水と涙の別れ道',
  'ボロボロのスニーカーとボトルネック',
  '錆びたアンプとウイスキー',
  '満員電車のスローブルース',
  '冷めたブラックコーヒーの嘆き',
  'ラストトレイン・シャッフル',
  '真夜中のファズ・ギター',
  '808とブルースハープの夜'
];
