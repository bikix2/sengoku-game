// game_core.js - Ver 33.0 (Food Balance Adjustment)

const SAVE_KEY = 'sengoku_idle_save_v33_foodbal';
const SECONDS_PER_DAY = 10; 

// --- ■1. 兵種相関図 ---
const TYPE_MATRIX = {
    "足軽": { "足軽":1.0, "弓兵":1.5, "騎馬":0.6, "鉄砲":0.6, "忍者":0.6, "水兵":1.5 },
    "弓兵": { "足軽":0.6, "弓兵":1.0, "騎馬":1.5, "鉄砲":1.5, "忍者":0.6, "水兵":0.6 },
    "騎馬": { "足軽":1.5, "弓兵":0.6, "騎馬":1.0, "鉄砲":0.6, "忍者":1.5, "水兵":0.6 },
    "鉄砲": { "足軽":1.5, "弓兵":0.6, "騎馬":1.5, "鉄砲":1.0, "忍者":1.5, "水兵":0.6 },
    "忍者": { "足軽":1.5, "弓兵":1.5, "騎馬":0.6, "鉄砲":0.6, "忍者":1.0, "水兵":1.5 },
    "水兵": { "足軽":0.6, "弓兵":1.5, "騎馬":1.5, "鉄砲":1.5, "忍者":0.6, "水兵":1.0 }
};

const TARGET_PREF = {
    "足軽": "front", "鉄砲": "front", "水兵": "front",
    "弓兵": "back",  "忍者": "back",  "騎馬": "all"
};

// --- ■2. 地域制覇報酬データ ---
const REGION_REWARDS = {
    "尾張": { name: "森蘭丸", rarity: "R" },
    "美濃": { name: "森蘭丸", rarity: "R" },
    "山城": { name: "三好長慶", rarity: "R" },
    "河内": { name: "細川ガラシャ", rarity: "R" },
    "越前": { name: "朝倉宗滴", rarity: "R" },
    "近江": { name: "浅井長政", rarity: "R" },
    "紀伊": { name: "松永久秀", rarity: "R" },
    "摂津": { name: "雑賀孫市", rarity: "SR" },
    "駿河": { name: "太原雪斎", rarity: "SR" },
    "豊後": { name: "立花誾千代", rarity: "SR" },
    "肥前": { name: "鍋島直茂", rarity: "SR" },
    "陸奥": { name: "片倉小十郎", rarity: "SR" },
    "武蔵": { name: "北条氏康", rarity: "R" },
    "土佐": { name: "長宗我部信親", rarity: "SR" },
    "三河": { name: "酒井忠次", rarity: "SR" },
    "安芸": { name: "小早川隆景", rarity: "SR" },
    "薩摩": { name: "島津歳久", rarity: "SR" },
    "信濃": { name: "山本勘助", rarity: "SR" },
    "越後": { name: "直江景綱", rarity: "SR" }
};

// --- ■3. クエストデータ ---
const QUEST_DATA = [
    { id: 101, region:"尾張", name: "稲生", diff: 1, money: 100, food: 4, boss_r: "N", type: "足軽", terrain: "平原", interference: [], s_cond: "R織田信長", s_reward_char: "R竹中半兵衛" },
    { id: 102, region:"尾張", name: "桶狭間", diff: 3, money: 300, food: 9, boss_r: "C", type: "弓兵", terrain: "山岳", interference: ["悪天候"], s_cond: "R織田信長", s_reward_char: "R竹中半兵衛" },
    { id: 103, region:"美濃", name: "稲葉山城", diff: 3, money: 350, food: 15, boss_r: "R", type: "足軽", terrain: "城郭", interference: [], s_cond: "R竹中半兵衛", s_reward_char: "C明智光秀" },
    { id: 201, region:"山城", name: "比叡山", diff: 2, money: 200, food: 9, boss_r: "C", type: "足軽", terrain: "山岳", interference: [], s_cond: "C明智光秀", s_reward_char: "R三好長慶" },
    { id: 202, region:"山城", name: "二条城", diff: 4, money: 400, food: 15, boss_r: "SR", type: "足軽", terrain: "城郭", interference: [], s_cond: "R織田信長", s_reward_char: "R三好長慶" },
    { id: 301, region:"河内", name: "飯盛山城", diff: 3, money: 250, food: 10, boss_r: "C", type: "弓兵", terrain: "山岳", interference: [], s_cond: "R三好長慶" },
    { id: 302, region:"河内", name: "大坂城", diff: 6, money: 600, food: 26, boss_r: "R", type: "弓兵", terrain: "城郭", interference: ["足止め罠"], s_cond: "UR徳川家康", s_reward_char: "R朝倉宗滴" },
    { id: 401, region:"越前", name: "九頭竜川", diff: 4, money: 400, food: 24, boss_r: "N", type: "騎馬", terrain: "平原", interference: ["悪天候"], s_cond: "R朝倉宗滴", s_reward_char: "R織田信長" },
    { id: 402, region:"越前", name: "一乗谷城", diff: 6, money: 600, food: 36, boss_r: "R", type: "騎馬", terrain: "城郭", interference: ["悪天候"], s_cond: "R織田信長", s_reward_char: "R浅井長政" },
    { id: 501, region:"近江", name: "野良田", diff: 5, money: 500, food: 24, boss_r: "R", type: "騎馬", terrain: "平原", interference: ["奇襲"], s_cond: "R浅井長政", s_reward_char: "R徳川家康" },
    { id: 502, region:"近江", name: "姉川", diff: 6, money: 600, food: 30, boss_r: "SR", type: "騎馬", terrain: "水辺", interference: ["悪天候"], s_cond: "R徳川家康", s_reward_char: "R雑賀孫市" },
    { id: 601, region:"紀伊", name: "雑賀川", diff: 6, money: 600, food: 30, boss_r: "R", type: "鉄砲", terrain: "平原", interference: ["計略"], s_cond: "R雑賀孫市", s_reward_char: "R羽柴秀吉" },
    { id: 602, region:"紀伊", name: "信貴山城", diff: 8, money: 800, food: 45, boss_r: "R", type: "鉄砲", terrain: "城郭", interference: ["計略"], s_cond: "R羽柴秀吉", s_reward_char: "R織田信長" },
    { id: 701, region:"摂津", name: "榎並城", diff: 6, money: 550, food: 27, boss_r: "C", type: "足軽", terrain: "城郭", interference: ["布陣失敗"], s_cond: "R織田信長", s_reward_char: "R雑賀孫市" },
    { id: 702, region:"摂津", name: "石山本願寺", diff: 8, money: 900, food: 42, boss_r: "R", type: "足軽", terrain: "城郭", interference: ["布陣失敗"], s_cond: "R雑賀孫市", s_reward_char: "C今川義元" },
    { id: 801, region:"駿河", name: "小豆坂", diff: 6, money: 500, food: 30, boss_r: "C", type: "弓兵", terrain: "平原", interference: ["足止め罠"], s_cond: "C今川義元" },
    { id: 802, region:"駿河", name: "高天神城", diff: 8, money: 800, food: 45, boss_r: "R", type: "弓兵", terrain: "城郭", interference: ["足止め罠"], s_cond: "SR太原雪斎", s_reward_char: "R島津家久" },
    { id: 901, region:"豊後", name: "戸次川", diff: 7, money: 600, food: 24, boss_r: "R", type: "弓兵", terrain: "平原", interference: ["悪天候", "計略"], s_cond: "R島津家久" },
    { id: 902, region:"豊後", name: "勢場ケ原", diff: 7, money: 700, food: 42, boss_r: "SR", type: "弓兵", terrain: "平原", interference: ["悪天候", "計略"], s_cond: "SR立花誾千代", s_reward_char: "R黒田官兵衛" },
    { id: 1001, region:"肥前", name: "根白坂", diff: 7, money: 600, food: 24, boss_r: "C", type: "足軽", terrain: "山岳", interference: ["奇襲", "足止め罠"], s_cond: "R黒田官兵衛", s_reward_char: "R伊達政宗" },
    { id: 1101, region:"陸奥", name: "摺上原", diff: 8, money: 800, food: 48, boss_r: "R", type: "騎馬", terrain: "平原", interference: ["悪天候", "奇襲"], s_cond: "R伊達政宗", s_reward_char: "R北条氏康" },
    { id: 1201, region:"武蔵", name: "小沢原", diff: 8, money: 600, food: 24, boss_r: "R", type: "足軽", terrain: "平原", interference: ["足止め罠"], s_cond: "R北条氏康" },
    { id: 1202, region:"武蔵", name: "小田原城", diff: 9, money: 1000, food: 50, boss_r: "SR", type: "足軽", terrain: "城郭", interference: ["足止め罠", "計略"], s_cond: "SR北条氏康", s_reward_char: "R長宗我部元親" },
    { id: 1301, region:"土佐", name: "一宮城", diff: 8, money: 800, food: 36, boss_r: "R", type: "水兵", terrain: "城郭", interference: ["布陣失敗", "傷病"], s_cond: "R長宗我部元親", s_reward_char: "R武田信玄" },
    { id: 1401, region:"三河", name: "三方ヶ原", diff: 9, money: 1200, food: 96, boss_r: "R", type: "騎馬", terrain: "平原", interference: ["奇襲", "布陣失敗"], s_cond: "R武田信玄", s_reward_char: "R織田信長" },
    { id: 1402, region:"三河", name: "長篠", diff: 10, money: 1500, food: 112, boss_r: "SR", type: "騎馬", terrain: "平原", interference: ["奇襲", "布陣失敗"], s_cond: "R織田信長", s_reward_char: "R毛利元就" },
    { id: 1501, region:"安芸", name: "厳島", diff: 10, money: 1500, food: 104, boss_r: "R", type: "水兵", terrain: "水辺", interference: ["奇襲", "計略", "傷病"], s_cond: "R毛利元就" },
    { id: 1502, region:"安芸", name: "吉田郡山城", diff: 12, money: 2000, food: 140, boss_r: "SSR", type: "弓兵", terrain: "城郭", interference: ["奇襲", "計略", "傷病"], s_cond: "SR毛利元就", s_reward_char: "R島津家久" },
    { id: 1601, region:"薩摩", name: "耳川", diff: 11, money: 1800, food: 80, boss_r: "R", type: "鉄砲", terrain: "平原", interference: ["奇襲", "計略"], s_cond: "R島津家久", s_reward_char: "R島津義久" },
    { id: 1602, region:"薩摩", name: "内城", diff: 13, money: 2500, food: 110, boss_r: "SR", type: "鉄砲", terrain: "城郭", interference: ["奇襲", "計略"], s_cond: "R島津義久", s_reward_char: "R真田幸隆" },
    { id: 1701, region:"信濃", name: "上田原", diff: 10, money: 1500, food: 60, boss_r: "R", type: "騎馬", terrain: "山岳", interference: ["奇襲", "悪天候", "計略", "足止め罠"], s_cond: "R真田幸隆", s_reward_char: "R上杉謙信" },
    { id: 1801, region:"越後", name: "川中島", diff: 11, money: 2000, food: 136, boss_r: "R", type: "騎馬", terrain: "山岳", interference: ["奇襲", "悪天候", "計略", "足止め罠", "傷病"], s_cond: "R上杉謙信" },
    { id: 1802, region:"越後", name: "春日山城", diff: 13, money: 3000, food: 180, boss_r: "SSR", type: "騎馬", terrain: "城郭", interference: ["奇襲", "悪天候", "計略", "足止め罠", "傷病"], s_cond: "SSR上杉謙信" }
];

const DEFAULT_SAVE = {
    money: 5000,
    items: { ticket: 5, kokoro: 0 }, 
    owned_ids: [],
    deck: [null, null, null],
    prisoners: [], 
    expedition: null,
    locked_ids: [],
    s_ranks: [], 
    completed_regions: []
};

function loadSaveData() {
    const json = localStorage.getItem(SAVE_KEY);
    let data;
    if (!json) {
        saveData(DEFAULT_SAVE);
        data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    } else {
        data = JSON.parse(json);
    }

    if (!data.prisoners) data.prisoners = [];
    if (!data.locked_ids) data.locked_ids = [];
    if (!data.deck) data.deck = [null, null, null];
    if (!data.s_ranks) data.s_ranks = [];
    if (!data.completed_regions) data.completed_regions = [];
    if (!data.items) data.items = { ticket: 0, kokoro: 0 };
    if (typeof data.items.kokoro === 'undefined') data.items.kokoro = 0;

    if (window.characterData && window.characterData.length > 0) {
        let starter = window.characterData.find(c => c.name.includes("織田信長") && c.rarity === "R");
        if (!starter) starter = window.characterData.find(c => c.name.includes("織田信長"));
        if (!starter) starter = window.characterData[0];

        if (starter && !data.owned_ids.includes(starter.id)) {
            data.owned_ids.push(starter.id);
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        }
    }

    return { ...DEFAULT_SAVE, ...data };
}

function saveData(data) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function resetSaveData() {
    localStorage.removeItem(SAVE_KEY);
}

function getCharacterById(id) {
    if (!window.characterData || window.characterData.length === 0) return null;
    return window.characterData.find(c => c.id == id);
}

function exportSaveData() {
    const data = loadSaveData();
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function importSaveData(code) {
    try {
        const jsonStr = decodeURIComponent(escape(atob(code)));
        const data = JSON.parse(jsonStr);
        if(data && data.money !== undefined && data.owned_ids) {
            saveData(data);
            return true;
        }
        return false;
    } catch(e) {
        console.error("Import Error:", e);
        return false;
    }
}

function checkAndDistributeStarter() {
    if (!window.characterData || window.characterData.length === 0) return { success: false };
    const currentSave = loadSaveData();
    let starterChar = window.characterData.find(c => c.name.includes("織田信長") && c.rarity === "R");
    if (!starterChar) starterChar = window.characterData.find(c => c.name.includes("織田信長"));
    if (!starterChar) starterChar = window.characterData[0];

    if (starterChar) {
        if (!currentSave.owned_ids.includes(starterChar.id)) {
            currentSave.owned_ids.push(starterChar.id);
            saveData(currentSave);
            return { success: true, name: starterChar.name, rarity: starterChar.rarity };
        }
    }
    return { success: false };
}

function findCharacterByNameAndRarity(fullName) {
    if(!window.characterData) return null;
    const rarity = fullName.match(/^[A-Z]+/)[0];
    const name = fullName.replace(/^[A-Z]+/, '');
    return window.characterData.find(c => c.name.includes(name) && c.rarity === rarity);
}

function startExpeditionCore(questId) {
    const save = loadSaveData();
    const deck = save.deck.map(id => getCharacterById(id));
    const quest = QUEST_DATA.find(q => q.id === questId);
    if (!quest) return { error: "クエストが見つかりません" };
    if (!deck.some(c => c)) return { error: "大将がいません" };

    const bossChar = (window.characterData.filter(c => c.rarity === quest.boss_r)[0]) || window.characterData[0];
    const weather = determineWeather(quest.id);
    const logs = simulateExpeditionLoop(quest, deck, weather, bossChar);
    const actualDays = logs.daysTraveled;
    const duration = actualDays * SECONDS_PER_DAY * 1000;
    const now = Date.now();

    save.expedition = { 
        questId: quest.id, 
        startTime: now, 
        endTime: now + duration, 
        weather: weather, 
        logs: logs, 
        result: logs.result, 
        bossId: bossChar.id, 
        captured: logs.capturedIds, 
        stats: logs.stats 
    };
    saveData(save);
    return { success: true };
}

function parseSkill(char) {
    if (!char || !char.skill) return { type: 'none', rate: 0, power: 0 };
    const desc = char.skill.desc || ""; 
    const effect = { type: 'none', name: char.skill.name, desc: desc, rate: 0.3, power: 1.0, targets: [], encounterMod: 0 };
    if (desc.includes("高確率") || desc.includes("しばしば")) effect.rate = 0.7;
    if (desc.includes("必ず") || desc.includes("100%")) effect.rate = 1.0;
    if (desc.includes("稀に") || desc.includes("ときどき")) effect.rate = 0.2;
    if (desc.includes("超大幅")) effect.power = 3.0; else if (desc.includes("大幅") || desc.includes("2倍")) effect.power = 2.0; else if (desc.includes("1.5倍")) effect.power = 1.5; else if (desc.includes("半減")) effect.power = 0.5;
    const preventMap = { "罠": "足止め罠", "奇襲": "奇襲", "悪天候": "悪天候", "計略": "計略", "布陣": "布陣失敗", "傷病": "傷病" };
    const prevents = [];
    Object.keys(preventMap).forEach(k => { if (desc.includes(k) && (desc.includes("無効")||desc.includes("防"))) prevents.push(preventMap[k]); });
    if (prevents.length > 0) { effect.type = "prevent"; effect.targets = prevents; return effect; }
    if (desc.includes("一撃必殺")) { effect.type = "instant_kill"; return effect; }
    if (desc.includes("攻撃力") && desc.includes("アップ")) { effect.type = "buff_atk"; return effect; }
    if (desc.includes("反射")) { effect.type = "reflect"; effect.reflectTarget = desc.includes("騎馬")?"騎馬":(desc.includes("鉄砲")?"鉄砲":"all"); return effect; }
    if (desc.includes("回復")) { effect.type = desc.includes("兵糧")?"heal_food":"heal_hp"; return effect; }
    if (desc.includes("捕獲")) { effect.type = "capture_up"; return effect; }
    return effect;
}

function simulateBattle(deck, enemy, quest) {
    const battleLog = [];
    let myParty = deck.map((c, i) => {
        if (!c) return null;
        return { ...c, currentHp: c.hp, pos: i, isDead: false, skill: parseSkill(c) };
    });
    let enemyUnit = {
        name: enemy.name, rarity: enemy.rarity, type: enemy.type || "足軽",
        war: Math.floor(enemy.war * (1.0 + quest.diff * 0.1)),
        hp: Math.floor(enemy.hp * (1.0 + quest.diff * 0.25)),
        skill: parseSkill(enemy)
    };
    battleLog.push(`敵将【${enemyUnit.name}】(${enemyUnit.type})と遭遇！`);
    myParty.forEach(c => {
        if (c && !c.isDead && c.skill.type === 'instant_kill' && Math.random() < c.skill.rate) {
            enemyUnit.hp = 0; battleLog.push(`<span class="ev-skill">【${c.name}】の一撃必殺！</span>`);
        }
    });
    
    if (enemyUnit.hp > 0 && enemyUnit.skill.type === 'instant_kill' && Math.random() < enemyUnit.skill.rate) {
        let targets = myParty.filter(c => c && !c.isDead);
        if (targets.length > 0) {
            let victim = targets[Math.floor(Math.random() * targets.length)];
            victim.currentHp = 0; victim.isDead = true;
            battleLog.push(`<span class="ev-bad">敵【${enemyUnit.name}】の一撃必殺！【${victim.name}】は倒れた...</span>`);
        }
    }

    if (enemyUnit.hp <= 0) return { result: 'win', log: battleLog, remainingHpRate: 1.0, deadCount: 0 };

    for (let turn = 1; turn <= 10; turn++) {
        let totalDmg = 0;
        myParty.forEach(c => {
            if (!c || c.isDead) return;
            let m = TYPE_MATRIX[c.type][enemyUnit.type] || 1.0;
            if (c.skill.type === 'buff_atk' && Math.random() < c.skill.rate) m *= c.skill.power;
            totalDmg += Math.floor(c.war * m * (0.9 + Math.random() * 0.2));
        });
        enemyUnit.hp -= totalDmg;
        battleLog.push(`味方攻撃: ${totalDmg}ダメ (敵残:${Math.max(0, enemyUnit.hp)})`);
        if (enemyUnit.hp <= 0) {
            battleLog.push(`<span class="ev-good">敵撃破！</span>`);
            let currentTotal = 0, maxTotal = 0, dead = 0;
            myParty.forEach(c => { if(c) { currentTotal += Math.max(0, c.currentHp); maxTotal += c.hp; if(c.isDead) dead++; } });
            return { result: 'win', log: battleLog, remainingHpRate: (currentTotal/maxTotal), deadCount: dead };
        }

        const pref = TARGET_PREF[enemyUnit.type] || "random";
        let targets = myParty.filter(c => c && !c.isDead);
        if (targets.length === 0) break;
        let victim = null;
        if (pref === "front") victim = targets.find(c => c.pos === 0) || targets.find(c => c.pos === 1) || targets.find(c => c.pos === 2);
        else if (pref === "back") victim = targets.find(c => c.pos === 2) || targets.find(c => c.pos === 1) || targets.find(c => c.pos === 0);
        else victim = targets[Math.floor(Math.random() * targets.length)];

        if (victim) {
            let enemyAtkPower = enemyUnit.war;
            if (enemyUnit.skill.type === 'buff_atk' && Math.random() < enemyUnit.skill.rate) {
                enemyAtkPower *= enemyUnit.skill.power;
                battleLog.push(`<span class="ev-bad">敵【${enemyUnit.name}】の${enemyUnit.skill.name}！攻撃力が上がった！</span>`);
            }

            let m = TYPE_MATRIX[enemyUnit.type][victim.type] || 1.0;
            if (victim.skill.type === 'reflect' && (victim.skill.reflectTarget === 'all' || victim.skill.reflectTarget === enemyUnit.type)) {
                enemyUnit.hp -= Math.floor(enemyUnit.war * 1.5);
                battleLog.push(`<span class="ev-reflect">【${victim.name}】反射！</span>`);
                if (enemyUnit.hp <= 0) {
                     let currentTotal = 0, maxTotal = 0, dead = 0;
                     myParty.forEach(c => { if(c) { currentTotal += Math.max(0, c.currentHp); maxTotal += c.hp; if(c.isDead) dead++; } });
                     return { result: 'win', log: battleLog, remainingHpRate: (currentTotal/maxTotal), deadCount: dead };
                }
            } else {
                let dmg = Math.floor(enemyAtkPower * m * (0.9 + Math.random() * 0.2));
                victim.currentHp -= dmg;
                battleLog.push(`敵攻撃: 【${victim.name}】に${dmg}`);
                if (victim.currentHp <= 0) { victim.isDead = true; battleLog.push(`<span class="ev-bad">【${victim.name}】撤退</span>`); }
            }
        }
        
        if (enemyUnit.hp > 0 && enemyUnit.skill.type === 'heal_hp' && Math.random() < enemyUnit.skill.rate) {
             let heal = Math.floor(enemyUnit.war * 2);
             enemyUnit.hp += heal;
             battleLog.push(`<span class="ev-bad">敵【${enemyUnit.name}】が兵力を${heal}回復した！</span>`);
        }

        if (myParty.every(c => !c || c.isDead)) { battleLog.push("全滅..."); return { result: 'defeat', log: battleLog, remainingHpRate: 0, deadCount: 3 }; }
    }
    return { result: 'draw', log: battleLog, remainingHpRate: 0, deadCount: 0 };
}

function simulateExpeditionLoop(quest, deck, weather, bossChar) {
    const events = [];
    const capturedIds = [];
    const totalDays = quest.food; 
    let totalCost = deck.reduce((s, c) => s + (c ? c.cost : 0), 0);
    // ★兵糧バランス調整: 総コスト*1.2 + 20
    let currentFood = Math.floor(totalCost * 1.2) + 20;
    
    let hp = deck.reduce((s, c) => s + (c ? c.hp : 0), 0);
    const maxHp = hp;
    let totalDead = 0;
    const addLog = (day, text) => events.push({ day: day, text: text });

    addLog(0, `<span class="log-time">出発</span> 兵糧:${currentFood} (行程:${totalDays}日)`);

    for (let d = 1; d <= totalDays; d++) {
        let cost = (weather === '雪') ? 2 : 1;
        const healer = deck.find(c => c && parseSkill(c).type === 'heal_food');
        if (healer && Math.random() < parseSkill(healer).rate) cost = 0;
        
        currentFood -= cost;
        if (currentFood <= 0) {
            addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">兵糧尽きる... 撤退</span>`);
            return { events: events, result: 'retired', capturedIds: capturedIds, weather: weather, stats: { hpRate: 0, dead: 0 }, daysTraveled: d };
        }

        let eventOccurred = false;
        if (quest.interference && quest.interference.length > 0 && Math.random() < 0.2) {
            eventOccurred = true;
            const inf = quest.interference[Math.floor(Math.random() * quest.interference.length)];
            const block = deck.find(c => c && parseSkill(c).type === 'prevent' && parseSkill(c).targets.includes(inf));
            
            if (block) {
                addLog(d, `${d}日目(糧${currentFood}): <span class="ev-skill">【${block.name}】が${inf}を回避！</span>`);
            } else {
                let dmg = 0;
                if (inf === "悪天候" || inf === "計略") {
                    currentFood -= 5;
                    addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">${inf}により兵糧5を失った...</span>`);
                } else {
                    dmg = Math.floor(maxHp * 0.15);
                    hp -= dmg;
                    addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">${inf}被害！ 兵${dmg}減少</span>`);
                }
            }
        }
        else if (Math.random() < 0.25) {
            eventOccurred = true;
            // ★戦闘発生で兵糧追加消費 (-2)
            currentFood -= 2;
            
            const enemy = { name: "敵部隊", rarity: "N", type: quest.type, war: 30 + (quest.diff*5), hp: 200 + (quest.diff*50) };
            const battle = simulateBattle(deck, enemy, quest);
            if (battle.result === 'win') {
                addLog(d, `${d}日目(糧${currentFood}): 敵部隊を撃破！(兵糧-2)`);
                if (Math.random() * 100 < 5) capturedIds.push(window.characterData[0].id);
            } else {
                hp -= Math.floor(maxHp * 0.2);
                addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">敗走... 被害を受けた。(兵糧-2)</span>`);
            }
            totalDead += battle.deadCount;
        }

        if (!eventOccurred) {
            addLog(d, `${d}日目(糧${currentFood}): 順調に進軍中...`);
        }

        if (hp <= 0) {
            addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">部隊全滅... 敗北</span>`);
            return { events: events, result: 'defeat', capturedIds: capturedIds, weather: weather, stats: { hpRate: 0, dead: totalDead }, daysTraveled: d };
        }
        if (currentFood <= 0) {
            addLog(d, `${d}日目: <span class="ev-bad">兵糧尽きる... 撤退</span>`);
            return { events: events, result: 'retired', capturedIds: capturedIds, weather: weather, stats: { hpRate: 0, dead: totalDead }, daysTraveled: d };
        }
    }

    addLog(totalDays, `<span class="ev-battle">目的地到着！敵本陣【${bossChar.name}】と決戦！</span>`);
    const bossBattle = simulateBattle(deck, bossChar, quest);
    bossBattle.log.forEach((l, idx) => { if (idx > 0) addLog(totalDays + 0.1, l); });
    totalDead += bossBattle.deadCount;

    return { 
        events: events, 
        result: bossBattle.result, 
        capturedIds: capturedIds, 
        weather: weather,
        stats: { hpRate: bossBattle.remainingHpRate, dead: totalDead },
        daysTraveled: totalDays
    };
}

function determineWeather(questId) { const seeds = ["晴れ", "雨", "曇り", "雪"]; return seeds[Math.floor(Math.random() * seeds.length)]; }
function calculateCaptureProb(deck, enemyRarity) {
    let maxRate = 0;
    deck.forEach(c => {
        if (!c) return;
        const s = parseSkill(c);
        if (s.type === 'capture_up') {
            let base = (c.rarity === 'LOB' || c.rarity === 'UR') ? 10.0 : 1.0;
            let val = base * s.power; if (val > maxRate) maxRate = val;
        }
    });
    if (enemyRarity === 'SSR' || enemyRarity === 'UR') return Math.min(50, maxRate);
    return Math.min(95, maxRate * 5 + 5);
}