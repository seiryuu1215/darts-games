/**
 * 店舗カスタマイズ設定
 * ダーツバーごとにこのファイルを編集してカスタマイズ
 */
const STORE_CONFIG = {
  // === 基本情報 ===
  name: "DARTS BAR EXAMPLE",
  logo: "",                    // ロゴ画像URL（空白ならテキスト表示）
  color: "#378ADD",            // テーマカラー
  password: "1234",            // アクセスパスワード

  // === サウンド設定 ===
  sounds: {
    enabled: true,             // サウンド全体のON/OFF
    volume: 0.7,               // マスターボリューム (0.0 ~ 1.0)

    // カスタム音声ファイル（URLまたはパス）
    // 空文字 = デフォルトのシンセサウンドを使用
    custom: {
      correct: "",             // 正解時（例: "sounds/correct.mp3"）
      wrong: "",               // 不正解時
      spin: "",                // ルーレット回転中
      result: "",              // 結果発表
      countdown: "",           // カウントダウン
      timeup: "",              // タイムアップ
      flip: "",                // カードフリップ
      match: "",               // マッチ成立
      tap: "",                 // ボタンタップ
      fanfare: "",             // ファンファーレ（高スコア時）
      voice_encourage: "",     // 応援ボイス（店員の声など）
      voice_punishment: "",    // 罰ゲーム宣告ボイス
      voice_start: "",         // ゲーム開始ボイス
      bgm: "",                 // BGM（ループ再生）
    }
  },

  // === 罰ゲームカスタマイズ ===
  punishments: {
    // カスタム罰ゲームを追加（デフォルトに追加される）
    extra: [
      // { text: "店長のおすすめカクテル一杯", weight: 1 }
    ]
  },

  // === 表示カスタマイズ ===
  display: {
    showTrivia: true,          // 豆知識を表示するか
    language: "ja",            // "ja" | "en"
  }
};
