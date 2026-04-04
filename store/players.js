/**
 * 共有プレイヤーシステム
 * 全ゲーム共通でプレイヤー名・スコア・履歴を管理
 */
const PlayerSystem = (() => {
  const STORAGE_KEY = 'darts-players';
  const HISTORY_KEY = 'darts-player-history';
  const LOG_KEY = 'darts-game-log';
  const MAX_HISTORY = 30;
  const MAX_LOG = 100;

  // === プレイヤー名履歴 ===
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  }

  function saveToHistory(names) {
    const history = loadHistory();
    const updated = [...new Set([...names.filter(n => n.trim()), ...history])].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  // === 現在のプレイヤーリスト（セッション） ===
  function loadPlayers() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function savePlayers(players) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    saveToHistory(players.map(p => p.name));
  }

  function createPlayer(name) {
    return { name: name || '', score: 0, tags: [] };
  }

  // === ゲームログ ===
  function saveGameResult(result) {
    try {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      log.unshift({
        date: new Date().toISOString(),
        ...result
      });
      localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, MAX_LOG)));
    } catch {}
  }

  function loadGameLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
    catch { return []; }
  }

  // === ランキング・罰ゲーム判定 ===
  function rankPlayers(players, higherIsBetter = true) {
    const sorted = [...players].sort((a, b) =>
      higherIsBetter ? b.score - a.score : a.score - b.score
    );
    return sorted;
  }

  function getLoser(players, higherIsBetter = true) {
    const ranked = rankPlayers(players, higherIsBetter);
    return ranked[ranked.length - 1];
  }

  function getWinner(players, higherIsBetter = true) {
    const ranked = rankPlayers(players, higherIsBetter);
    return ranked[0];
  }

  // === 罰ゲームシステム ===
  const DEFAULT_PUNISHMENTS = [
    { text: "みんなの前で一発芸", category: "action", weight: 2 },
    { text: "好きな異性のタイプを発表", category: "talk", weight: 2 },
    { text: "変顔で自撮り → SNS投稿", category: "action", weight: 1.5 },
    { text: "ドリンク1杯おごり", category: "drink", weight: 2 },
    { text: "次のゲームはハンデ付き", category: "game", weight: 3 },
    { text: "推しのスタッフを発表", category: "talk", weight: 2 },
    { text: "最近の恥ずかしい話を暴露", category: "talk", weight: 1.5 },
    { text: "全員にドリンクおごり", category: "drink", weight: 0.5 },
    { text: "1位が指定する曲を歌う", category: "action", weight: 1 },
    { text: "スマホの検索履歴を見せる", category: "action", weight: 0.8 },
    { text: "次の1時間は敬語で話す", category: "action", weight: 2 },
    { text: "センブリ茶を飲む", category: "drink", weight: 1 },
    { text: "1位とツーショット撮影", category: "action", weight: 2.5 },
    { text: "今日のダーツ代を全額負担", category: "money", weight: 0.3 },
    { text: "罰ゲーム免除！ラッキー！", category: "safe", weight: 1 },
  ];

  function getPunishments(playerTags = []) {
    const storeConfig = typeof STORE_CONFIG !== 'undefined' ? STORE_CONFIG : {};
    const punishmentConfig = storeConfig.punishments || {};
    const useDefaults = punishmentConfig.useDefaults !== false;

    let punishments = useDefaults ? [...DEFAULT_PUNISHMENTS] : [];

    // 店舗カスタム罰ゲーム追加
    if (punishmentConfig.extra) {
      punishments = [...punishments, ...punishmentConfig.extra.map(p => ({
        text: p.text, category: p.category || 'custom', weight: p.weight || 1
      }))];
    }

    // ノンアルコール対応
    if (playerTags.includes('no-alcohol')) {
      punishments = punishments.filter(p => p.category !== 'drink');
    }

    return punishments;
  }

  function selectPunishment(playerTags = [], severity = 'normal') {
    const punishments = getPunishments(playerTags);
    // severity で重み調整
    const adjusted = punishments.map(p => {
      let w = p.weight;
      if (severity === 'hard') {
        if (p.category === 'safe') w *= 0.3;
        if (p.category === 'money' || p.category === 'drink') w *= 2;
      } else if (severity === 'easy') {
        if (p.category === 'safe') w *= 3;
        if (p.category === 'money') w *= 0.1;
      }
      return { ...p, w };
    });

    const total = adjusted.reduce((s, p) => s + p.w, 0);
    let rand = Math.random() * total;
    for (const p of adjusted) {
      rand -= p.w;
      if (rand <= 0) return p;
    }
    return adjusted[adjusted.length - 1];
  }

  return {
    loadHistory,
    saveToHistory,
    loadPlayers,
    savePlayers,
    createPlayer,
    saveGameResult,
    loadGameLog,
    rankPlayers,
    getLoser,
    getWinner,
    getPunishments,
    selectPunishment,
    DEFAULT_PUNISHMENTS,
  };
})();
