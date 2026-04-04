/**
 * 店舗カスタマイズ設定
 * ダーツバーごとにこのファイルを編集してカスタマイズ
 *
 * 【買い切りプラン】
 * Basic:   そのまま使える（このファイルを編集するだけ）
 * Pro:     ロゴ・カラー・SE・罰ゲームをフルカスタム
 * Premium: 専用ドメイン + カスタムゲーム追加対応
 */
const STORE_CONFIG = {
  // === 基本情報 ===
  name: "DARTS BAR EXAMPLE",
  logo: "",                    // ロゴ画像URL（空白ならテキスト表示）
  color: "#378ADD",            // テーマカラー
  colorSecondary: "",          // セカンダリカラー（空白ならcolorの暗い版を自動生成）
  password: "1234",            // アクセスパスワード（空文字ならパスワードなし）
  storeUrl: "",                // 店舗HP URL（あれば表示）
  instagram: "",               // Instagram ID（@なし）
  line: "",                    // LINE公式アカウントURL

  // === サウンド設定 ===
  sounds: {
    enabled: true,
    volume: 0.7,
    custom: {
      correct: "",
      wrong: "",
      spin: "",
      result: "",
      countdown: "",
      timeup: "",
      flip: "",
      match: "",
      tap: "",
      fanfare: "",
      voice_encourage: "",     // 応援ボイス（例: 店長「ナイスー！」）
      voice_punishment: "",    // 罰ゲーム宣告（例: 店長「罰ゲームー！」）
      voice_start: "",         // ゲーム開始（例: 店長「いくぞー！」）
      voice_loser: "",         // 最下位発表（例: 「ドンマイ！」）
      bgm: "",
    }
  },

  // === 罰ゲームカスタマイズ ===
  punishments: {
    // true = デフォルト罰ゲームも使う + extraを追加
    // false = extraだけ使う（完全カスタム）
    useDefaults: true,
    extra: [
      // { text: "店長のおすすめカクテル一杯", category: "drink", weight: 1 },
      // { text: "次回来店時ドリンク1杯サービス", category: "reward", weight: 0.5 },
    ]
  },

  // === ゲーム設定 ===
  games: {
    // 個別ゲームの有効/無効（false = トップページに表示しない）
    roulette: true,
    quiz: true,
    sprint: true,
    memory: true,
    higherLower: true,
    puzzle: true,
    flash: true,
    boardQuiz: true,

    // デフォルト難易度
    defaultDifficulty: "normal",  // "easy" | "normal" | "hard"

    // マルチプレイヤー設定
    multiplayer: {
      minPlayers: 2,
      maxPlayers: 8,
      punishmentEnabled: true,     // 最下位に罰ゲームを出すか
      punishmentSeverity: "normal", // "easy" | "normal" | "hard"
    }
  },

  // === 表示カスタマイズ ===
  display: {
    showTrivia: true,
    showWatermark: true,         // false = "Powered by Darts Games" 非表示（Pro以上）
    language: "ja",              // "ja" | "en"
    customCss: "",               // カスタムCSSのURL（上級者向け）
  },

  // === 拡張ゲーム ===
  // Premium プランで追加ゲームを登録可能
  customGames: [
    // {
    //   id: "custom-1",
    //   title: "オリジナルゲーム",
    //   desc: "店舗オリジナルのゲーム",
    //   icon: "🌟",
    //   url: "games/custom-1.html",
    //   bg: "linear-gradient(135deg, #ff6b6b, #ee5a24)"
    // }
  ],
};
