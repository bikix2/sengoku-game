// game_core.js - Ver 43.0 (Shop & Speed Update)

const SAVE_KEY = 'sengoku_idle_save_v43_full'; 
const SECONDS_PER_DAY = 10; 

const REGION_MAP = {
    "east": ["陸奥", "出羽", "越後", "信濃", "上野", "下野", "常陸", "武蔵", "下総", "上総", "安房", "相模", "甲斐", "駿河", "伊豆"],
    "central": ["越中", "能登", "加賀", "越前", "美濃", "飛騨", "尾張", "三河", "遠江", "近江", "伊勢", "志摩", "山城", "大和", "紀伊", "河内", "和泉", "摂津", "丹波", "丹後", "但馬", "播磨"],
    "west": ["因幡", "伯耆", "出雲", "石見", "隠岐", "美作", "備前", "備中", "備後", "安芸", "周防", "長門", "淡路", "阿波", "讃岐", "伊予", "土佐", "筑前", "筑後", "豊前", "豊後", "肥前", "肥後", "日向", "大隅", "薩摩"]
};

// --- FATE DATA ---
const FATE_DATA = [
    { me: "上杉謙信", boss: "武田信玄", title: "川中島の決戦", text: "甲斐の虎よ、今日こそ決着をつけようぞ！" },
    { me: "武田信玄", boss: "上杉謙信", title: "川中島の決戦", text: "越後の龍か... 相手にとって不足なし！" },
    { me: "伊達政宗", boss: "真田幸村", title: "大坂夏の陣", text: "真田の兵、噂に違わぬ強さか... 楽しませてくれ！" },
    { me: "真田幸村", boss: "伊達政宗", title: "大坂夏の陣", text: "独眼竜のお手並み、拝見いたす！" },
    { me: "明智光秀", boss: "織田信長", title: "本能寺の変", text: "敵は... 本能寺にあり！！" },
    { me: "織田信長", boss: "明智光秀", title: "是非もなし", text: "光秀... 貴様が、我が夢を阻むか。" },
    { me: "森蘭丸", boss: "明智光秀", title: "本能寺の防衛", text: "上様には指一本触れさせませぬ！" },
    { me: "明智光秀", boss: "森蘭丸", title: "立ちはだかる小姓", text: "蘭丸、退け。私の狙いは信長公のみ。" },
    { me: "羽柴秀吉", boss: "明智光秀", title: "山崎の戦い", text: "主君の仇、討たせてもらう！" },
    { me: "明智光秀", boss: "羽柴秀吉", title: "山崎の戦い", text: "猿め... ここまで早く戻ってくるとは。" },
    { me: "羽柴秀吉", boss: "柴田勝家", title: "賤ヶ岳の戦い", text: "親父殿、時代は変わったのですよ。" },
    { me: "柴田勝家", boss: "羽柴秀吉", title: "賤ヶ岳の戦い", text: "成り上がりの猿風情が、儂に挑むか！" },
    { me: "徳川家康", boss: "豊臣秀吉", title: "小牧・長久手", text: "天下の行方、この一戦で定めん。" },
    { me: "石田三成", boss: "徳川家康", title: "関ヶ原の戦い", text: "大義は我らにあり！ 家康を討て！" },
    { me: "徳川家康", boss: "石田三成", title: "関ヶ原の戦い", text: "治部少輔、夢を見るのは終わりじゃ。" },
    { me: "真田幸村", boss: "徳川家康", title: "日本一の兵", text: "真田の六文銭、目に焼き付けよ！" },
    { me: "徳川家康", boss: "真田幸村", title: "大坂の陣", text: "また真田か...！ あの旗を見ると古傷が痛むわ。" },
    { me: "島左近", boss: "徳川家康", title: "鬼左近", text: "三成様に過ぎたるものと言われた力、見せてやる！" },
    { me: "小早川秀秋", boss: "石田三成", title: "裏切りの決断", text: "これも乱世の習い... 悪く思わぬことだ。" },
    { me: "浅井長政", boss: "織田信長", title: "金ヶ崎の退き口", text: "義兄上... 義のために、貴方を討ちます。" },
    { me: "織田信長", boss: "浅井長政", title: "姉川の戦い", text: "長政、なぜ儂を裏切った！" },
    { me: "お市", boss: "織田信長", title: "悲しき兄妹", text: "兄上... どうして戦わねばならぬのですか。" },
    { me: "松永久秀", boss: "織田信長", title: "梟雄の最期", text: "平蜘蛛は渡さん... わが命とともに砕け散れ！" },
    { me: "毛利元就", boss: "陶晴賢", title: "厳島の戦い", text: "勝負は戦う前から決まっているのだよ。" },
    { me: "長宗我部元親", boss: "羽柴秀吉", title: "四国征伐", text: "鳥なき島の蝙蝠かどうか、試してみるがよい！" },
    { me: "島津義久", boss: "大友宗麟", title: "耳川の戦い", text: "九州の覇者となるのは、我ら島津だ。" },
    { me: "立花誾千代", boss: "島津義弘", title: "雷神の娘", text: "立花の城は、女一人でも守り抜いてみせる！" },
    { me: "直江兼続", boss: "伊達政宗", title: "長谷堂の戦い", text: "愛の字の前では、独眼竜とて無力！" },
    { me: "伊達政宗", boss: "直江兼続", title: "長谷堂の戦い", text: "閻魔に愛ごときは通じぬぞ、兼続！" },
    { me: "北条氏康", boss: "上杉謙信", title: "小田原包囲網", text: "難攻不落の小田原城、抜けるものなら抜いてみよ。" },
    { me: "雑賀孫市", boss: "織田信長", title: "石山合戦", text: "俺たちの鉄砲は、魔王をも貫くぜ！" },
    { me: "前田慶次", boss: "前田利家", title: "加賀の傾奇者", text: "叔父御、たまには派手に暴れようぜ！" },
    { me: "服部半蔵", boss: "風魔小太郎", title: "忍びの頂上決戦", text: "伊賀の忍びと風魔の忍び... 生きて帰るは一人。" },
    { me: "宮本武蔵", boss: "佐々木小次郎", title: "巌流島の決闘", text: "小次郎敗れたり！" },
    { me: "武蔵坊弁慶", boss: "源義経", title: "安宅の関", text: "御曹司、ここはそれがしにお任せあれ！" },
    { me: "帰蝶", boss: "織田信長", title: "蝮の娘", text: "父の無念... 晴らさせてもらいます。" }
];

// --- ACHIEVEMENT DATA ---
const ACHIEVEMENT_DATA = [
    {id:1, name: "国取り開始", cond: "最初の戦場をクリア", reward_tactic: "出陣ことはじめ"},
    {id:2, name: "初国獲り", cond: "1つの地域を制覇", reward_tactic: null},
    {id:3, name: "天下布武", cond: "全ての戦場を制覇", reward_text: "天下統一！"},
    {id:4, name: "策士", cond: "戦術を6個以上獲得", reward_tactic: "道を借りて各を伐つ"},
    {id:5, name: "知将", cond: "戦術を12個以上獲得", reward_tactic: "梁を盗み柱に換える"},
    {id:6, name: "謀将", cond: "戦術を24個以上獲得", reward_tactic: "苦肉の計"},
    {id:7, name: "初黒星", cond: "撤退を経験する", reward_tactic: "水を混ぜて魚を探る"},
    {id:8, name: "歴戦の勇", cond: "出陣回数100回", reward_tactic: "草を打って蛇を驚かす"},
    {id:9, name: "百戦錬磨", cond: "出陣回数500回", reward_tactic: "屋根に上げて梯子を外す"},
    {id:10, name: "軍神の如し", cond: "50連勝達成", reward_tactic: "岸を隔てて火を観る"},
    {id:11, name: "大軍勢", cond: "総兵力が10000を超える", reward_tactic: "魏を囲んで趙を救う"},
    {id:12, name: "死中活路", cond: "兵糧0で勝利", reward_tactic: "火につけこんで劫を打つ"},
    {id:13, name: "怒涛の進軍", cond: "難易度6以上をクリア", reward_tactic: "門を関ざして賊を捕らう"},
    {id:14, name: "獅子奮迅", cond: "難易度9以上をクリア", reward_tactic: "無中に有を生ず"},
    {id:15, name: "1000里突破", cond: "累計距離1000達成", reward_tactic: "桑を指して槐を罵る"},
    {id:16, name: "10000里突破", cond: "累計距離10000達成", reward_tactic: "痴を偽るも転せず"},
    {id:17, name: "敗軍の将", cond: "全滅を経験", reward_tactic: "逃げるを上とする"},
    {id:18, name: "死神の如し", cond: "全滅30回", reward_tactic: "金蝉、殻を脱ぐ"},
    {id:19, name: "勇み足", cond: "兵糧切れで全滅", reward_tactic: "天を欺き海を渡る"},
    {id:20, name: "仇は討った", cond: "撤退武将が出た状態で勝利", reward_tactic: "空城の計"},
    {id:21, name: "閻魔大名", cond: "累計死者数30人", reward_tactic: "煉瓦を投げて玉を引く"},
    {id:22, name: "吸血大名", cond: "累計死者数100人", reward_tactic: "李、桃に代わって倒る"},
    {id:23, name: "先手必勝", cond: "先制攻撃成功", reward_tactic: "客を反して主と為す"},
    {id:24, name: "独眼竜敗れたり！", cond: "伊達政宗(敵)に勝利", reward_tactic: "逸を以って労を待つ"},
    {id:25, name: "軍神敗れたり！", cond: "上杉謙信(敵)に勝利", reward_tactic: "刀を借りて人を殺す"},
    {id:26, name: "甲斐の虎敗れたり！", cond: "武田信玄(敵)に勝利", reward_tactic: "連環の計"},
    {id:27, name: "天下無双敗れたり！", cond: "本多忠勝(敵)に勝利", reward_tactic: "将を射んとすれば馬を射よ"},
    {id:28, name: "謀神敗れたり！", cond: "毛利元就(敵)に勝利", reward_tactic: "笑裏に刀を蔵す"},
    {id:29, name: "鬼島津敗れたり！", cond: "島津義弘(敵)に勝利", reward_tactic: "手に順いて羊を引く"},
    {id:30, name: "人材宝庫", cond: "武将50人所持", reward_tactic: "遠く交わり近く攻む"},
    {id:31, name: "大軍団", cond: "武将100人所持", reward_tactic: "樹上に花を咲かす"},
    {id:32, name: "真田三代", cond: "真田幸隆・昌幸・幸村を所持", reward_tactic: "反間の計"},
    {id:33, name: "浅井三姉妹", cond: "茶々・初・江を所持", reward_tactic: "美人の計"},
    {id:34, name: "人たらし大名", cond: "捕虜登用5人", reward_tactic: "捕らんと欲すれば暫く待て"},
    {id:35, name: "天竜のくじ", cond: "ガチャ50回", reward_tactic: "暗かに陳倉に渡る"},
    {id:36, name: "100人組手", cond: "対戦100回(代用:累計勝利100)", reward_tactic: "東に叫んで西を撃つ"},
    {id:37, name: "解雇", cond: "武将を解雇する", reward_text: "心無き者よ..."},
    {id:38, name: "大解雇", cond: "武将を30人解雇", reward_text: "冷徹な采配"},
    {id:39, name: "天下三肩付", cond: "楢柴・新田・初花肩衝を収集", reward_text: "天下の三肩付！"},
    {id:40, name: "天下五剣", cond: "童子切・大包平・三日月・鬼丸・大典太を収集", reward_text: "天下五剣！"},
    {id:41, name: "天下の大数寄者", cond: "財宝を30種類以上収集", reward_text: "目利きの大名"},
    {id:42, name: "風雲児", cond: "東日本を制覇", reward_text: "東国の覇者"},
    {id:43, name: "麒麟児", cond: "中央を制覇", reward_text: "天下の麒麟児"},
    {id:44, name: "革命児", cond: "西日本を制覇", reward_text: "西国の革命児"},
    {id:45, name: "達人", cond: "R以上の武将1名のみで制覇", reward_text: "武の極み"},
    {id:46, name: "戦上手", cond: "C以下の武将3名で制覇", reward_text: "用兵の妙"},
    {id:47, name: "単騎駆け", cond: "武将1名で制覇", reward_text: "一騎当千"},
    {id:48, name: "敵中突破", cond: "総兵力500以下で制覇", reward_text: "奇跡の生還"},
    {id:49, name: "戦の申し子", cond: "無傷(HP100%)で制覇", reward_text: "完全勝利"}
];

// --- TACTICS DATA ---
const TACTICS_DATA = [
    {name: "出陣ことはじめ", desc: "敵兵を少し減らす", source: "国取り開始"},
    {name: "逃げるを上とする", desc: "兵力7割以下で撤退", source: "敗軍の将"},
    {name: "桑を指して槐を罵る", desc: "兵糧消費を1減らす", source: "1000里突破"},
    {name: "魏を囲んで趙を救う", desc: "小勢の敵に攻撃UP", source: "大軍勢"},
    {name: "刀を借りて人を殺す", desc: "敵兵を1割減らす", source: "軍神敗れたり！"},
    {name: "連環の計", desc: "足止め罠を無効化", source: "甲斐の虎敗れたり！"},
    {name: "苦肉の計", desc: "奇襲を無効化", source: "謀将"},
    {name: "反間の計", desc: "計略を無効化", source: "真田三代"},
    {name: "逸を以って労を待つ", desc: "毎日兵が1%回復", source: "独眼竜敗れたり！"},
    {name: "火につけこんで劫を打つ", desc: "残兵糧に応じて攻撃UP", source: "死中活路"},
    {name: "無中に有を生ず", desc: "兵半減で攻撃倍増", source: "獅子奮迅"},
    {name: "岸を隔てて火を観る", desc: "小勢の敵の攻撃DOWN", source: "軍神の如し"},
    {name: "笑裏に刀を蔵す", desc: "勝利時兵糧+1", source: "謀神敗れたり！"},
    {name: "李、桃に代わって倒る", desc: "死者数×10の兵糧回復", source: "吸血大名"},
    {name: "手に順いて羊を引く", desc: "敵より少勢なら先制", source: "鬼島津敗れたり！"},
    {name: "草を打って蛇を驚かす", desc: "先制攻撃が発生しない", source: "歴戦の勇"},
    {name: "捕らんと欲すれば暫く待て", desc: "捕獲率アップ", source: "人たらし大名"},
    {name: "煉瓦を投げて玉を引く", desc: "確率で敵攻撃回避", source: "閻魔大名"},
    {name: "将を射んとすれば馬を射よ", desc: "稀に敵を一撃死", source: "天下無双敗れたり！"},
    {name: "釜の底より薪を抜く", desc: "敵兵糧を減らす", source: "天と地と"},
    {name: "水を混ぜて魚を探る", desc: "撤退時の兵糧減少なし", source: "初黒星"},
    {name: "金蝉、殻を脱ぐ", desc: "兵半減で撤退", source: "死神の如し"},
    {name: "門を関ざして賊を捕らう", desc: "敵より大勢なら攻撃UP", source: "怒涛の進軍"},
    {name: "遠く交わり近く攻む", desc: "C・N武将の攻撃UP", source: "人材宝庫"},
    {name: "道を借りて各を伐つ", desc: "戦闘回避率アップ", source: "策士"},
    {name: "梁を盗み柱に換える", desc: "相性を無視する", source: "知将"},
    {name: "痴を偽るも転せず", desc: "兵糧50以下で敵攻撃DOWN", source: "10000里突破"},
    {name: "屋根に上げて梯子を外す", desc: "兵半減で兵糧+50(1回)", source: "百戦錬磨"},
    {name: "樹上に花を咲かす", desc: "低ランク武将がいれば先制", source: "大軍団"},
    {name: "客を反して主と為す", desc: "被先制で運アップ", source: "先手必勝"},
    {name: "空城の計", desc: "誰か撤退したら全軍撤退", source: "仇は討った"},
    {name: "天を欺き海を渡る", desc: "兵糧切れで即撤退", source: "勇み足"},
    {name: "暗かに陳倉に渡る", desc: "野営時1名回復", source: "天竜のくじ"},
    {name: "東に叫んで西を撃つ", desc: "運上昇(財宝発見率UP)", source: "100人組手"},
    {name: "美人の計", desc: "女性武将で敵攻撃半減", source: "浅井三姉妹"},
    {name: "天地明察", desc: "【超】敵の特技を無効化(手形10枚)", source: "超戦術", isSuper: true, cost: 10},
    {name: "蒼天航路", desc: "【超】罠・妨害を完全無効(手形10枚)", source: "超戦術", isSuper: true, cost: 10},
    {name: "翔ぶが如く", desc: "【超】進軍速度4倍(手形10枚)", source: "超戦術", isSuper: true, cost: 10}
];

// --- TREASURE DATA ---
const TREASURE_DATA = [
    {id: 1, name: "九十九茄子", type: "茶入", rank: 10}, {id: 2, name: "松本茄子", type: "茶入", rank: 9}, {id: 3, name: "富士茄子", type: "茶入", rank: 9},
    {id: 4, name: "七夕茄子", type: "茶入", rank: 8}, {id: 5, name: "国司茄子", type: "茶入", rank: 8}, {id: 6, name: "北野茄子", type: "茶入", rank: 8},
    {id: 7, name: "宗悟茄子", type: "茶入", rank: 7}, {id: 8, name: "紹鴎茄子", type: "茶入", rank: 7}, {id: 9, name: "若狭茄子", type: "茶入", rank: 7},
    {id: 10, name: "京極茄子", type: "茶入", rank: 6}, {id: 11, name: "茜屋茄子", type: "茶入", rank: 6}, {id: 12, name: "豊後茄子", type: "茶入", rank: 6},
    {id: 13, name: "松花", type: "茶壺", rank: 10}, {id: 14, name: "三日月", type: "茶壺", rank: 10}, {id: 15, name: "松島", type: "茶壺", rank: 9},
    {id: 16, name: "橋立", type: "茶壺", rank: 8}, {id: 17, name: "金花", type: "茶壺", rank: 8}, {id: 18, name: "浅茅", type: "茶壺", rank: 7},
    {id: 19, name: "千鳥", type: "茶壺", rank: 7}, {id: 20, name: "生野", type: "茶壺", rank: 6}, {id: 21, name: "打雲", type: "茶壺", rank: 6},
    {id: 22, name: "楢柴肩衝", type: "茶入", rank: 10}, {id: 23, name: "新田肩衝", type: "茶入", rank: 10}, {id: 24, "name": "初花肩衝", type: "茶入", rank: 10},
    {id: 25, name: "北野肩衝", type: "茶入", rank: 9}, {id: 26, name: "遅桜肩衝", type: "茶入", rank: 9}, {id: 27, name: "松屋肩衝", type: "茶入", rank: 8},
    {id: 28, name: "安国寺肩衝", type: "茶入", rank: 8}, {id: 29, name: "玉垣肩衝", type: "茶入", rank: 8}, {id: 30, name: "油屋肩衝", type: "茶入", rank: 7},
    {id: 31, name: "在中庵肩衝", type: "茶入", rank: 7}, {id: 32, name: "勢高肩衝", type: "茶入", rank: 7}, {id: 33, name: "博多肩衝", type: "茶入", rank: 6},
    {id: 34, name: "唐支那肩衝", type: "茶入", rank: 6}, {id: 35, name: "円城寺", type: "花入", rank: 7}, {id: 36, name: "夜長", type: "花入", rank: 7},
    {id: 37, name: "尺八", type: "花入", rank: 7}, {id: 38, name: "細川井戸", type: "茶碗", rank: 7}, {id: 39, name: "加賀井戸", type: "茶碗", rank: 7},
    {id: 40, name: "喜左衛門井戸", type: "茶碗", rank: 7}, {id: 41, name: "松本舟", type: "花入", rank: 7}, {id: 42, name: "針屋舟", type: "花入", rank: 7},
    {id: 43, name: "淡路屋舟", type: "花入", rank: 7}, {id: 44, name: "童子切", type: "刀剣", rank: 10}, {id: 45, name: "大包平", type: "刀剣", rank: 10},
    {id: 46, name: "三日月宗近", type: "刀剣", rank: 10}, {id: 47, name: "鬼丸", type: "刀剣", rank: 10}, {id: 48, name: "大典太", type: "刀剣", rank: 10},
    {id: 49, name: "数珠丸", type: "刀剣", rank: 9}, {id: 50, name: "大般若長光", type: "刀剣", rank: 9}, {id: 51, name: "小竜景光", type: "刀剣", rank: 9},
    {id: 52, name: "宗三左文字", type: "刀剣", rank: 8}, {id: 53, name: "へし切長谷部", type: "刀剣", rank: 8}, {id: 54, name: "雷切", type: "刀剣", rank: 8},
    {id: 55, name: "村正", type: "刀剣", rank: 8}, {id: 56, name: "日光一文字", type: "刀剣", rank: 7}, {id: 57, name: "菊一文字", type: "刀剣", rank: 7},
    {id: 58, name: "和泉守兼定", type: "刀剣", rank: 7}, {id: 59, name: "陸奥守吉行", type: "刀剣", rank: 7}, {id: 60, name: "加州清光", type: "刀剣", rank: 6},
    {id: 61, name: "長曽祢虎徹", type: "刀剣", rank: 6}, {id: 62, name: "蜻蛉切", type: "槍", rank: 10}, {id: 63, name: "日本号", type: "槍", rank: 10},
    {id: 64, name: "御手杵", type: "槍", rank: 10}, {id: 65, name: "一期一振", type: "刀剣", rank: 9}, {id: 66, name: "平蜘蛛", type: "釜", rank: 10},
    {id: 67, name: "銀貨", type: "財宝", rank: 1}, {id: 68, name: "砂金", type: "財宝", rank: 2}, {id: 69, name: "金塊", type: "財宝", rank: 3},
    {id: 70, name: "翡翠", type: "財宝", rank: 4}, {id: 71, name: "珊瑚", type: "財宝", rank: 5}, {id: 72, name: "瑪瑙", type: "財宝", rank: 6},
    {id: 73, name: "水晶", type: "財宝", rank: 7}, {id: 74, name: "孔雀石", type: "財宝", rank: 8}, {id: 75, name: "黒真珠", type: "財宝", rank: 9},
    {id: 76, name: "ダイヤモンド", type: "財宝", rank: 10}
];

// --- TYPE MATRIX ---
const TYPE_MATRIX = {
    "足軽": { "足軽":1.0, "弓兵":1.8, "騎馬":0.5, "鉄砲":0.5, "忍者":0.5, "水兵":1.8 },
    "弓兵": { "足軽":0.5, "弓兵":1.0, "騎馬":1.8, "鉄砲":1.8, "忍者":0.5, "水兵":0.5 },
    "騎馬": { "足軽":1.8, "弓兵":0.5, "騎馬":1.0, "鉄砲":0.5, "忍者":1.8, "水兵":0.5 },
    "鉄砲": { "足軽":1.8, "弓兵":0.5, "騎馬":1.8, "鉄砲":1.0, "忍者":1.8, "水兵":0.5 },
    "忍者": { "足軽":1.8, "弓兵":1.8, "騎馬":0.5, "鉄砲":0.5, "忍者":1.0, "水兵":1.5 },
    "水兵": { "足軽":0.5, "弓兵":1.8, "騎馬":1.8, "鉄砲":1.8, "忍者":0.5, "水兵":1.0 }
};

const TARGET_PREF = {
    "足軽": "front", "鉄砲": "front", "水兵": "front",
    "弓兵": "back",  "忍者": "back",  "騎馬": "all"
};

// --- QUEST DATA ---
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
    completed_regions: [],
    achievements: [], 
    tactics: ["逃げるを上となす", "出陣ことはじめ"], 
    collected_treasures: [], 
    records: { 
        totalDistance: 0,
        totalBattles: 0,
        totalWins: 0,
        totalDead: 0,
        retreatCount: 0,
        winStreak: 0,
        gachaCount: 0,
        capturedCount: 0,
        totalReleased: 0,
        lastExpeditionStats: null
    }
};

function loadSaveData() {
    const json = localStorage.getItem(SAVE_KEY);
    let data;
    if (!json) { saveData(DEFAULT_SAVE); data = JSON.parse(JSON.stringify(DEFAULT_SAVE)); } 
    else { data = JSON.parse(json); }
    if (!data.prisoners) data.prisoners = [];
    if (!data.deck) data.deck = [null, null, null];
    if (!data.s_ranks) data.s_ranks = [];
    if (!data.completed_regions) data.completed_regions = [];
    if (!data.items) data.items = { ticket: 0, kokoro: 0 };
    if (!data.achievements) data.achievements = [];
    if (!data.tactics) data.tactics = ["逃げるを上となす", "出陣ことはじめ"];
    if (!data.collected_treasures) data.collected_treasures = [];
    if (!data.records) data.records = { totalDistance: 0, totalBattles: 0, totalWins: 0, totalDead: 0, retreatCount: 0, winStreak: 0, gachaCount: 0, capturedCount: 0, totalReleased: 0 };
    
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
function saveData(data) { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); }
function resetSaveData() { localStorage.removeItem(SAVE_KEY); }
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
        if(data && data.money !== undefined && data.owned_ids) { saveData(data); return true; }
        return false;
    } catch(e) { console.error("Import Error:", e); return false; }
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

// --- checkAchievements (Fix & Extension) ---
function checkAchievements(save) {
    const newAchieved = [];
    const newTactics = [];
    const ownedChars = save.owned_ids.map(id => getCharacterById(id)).filter(c => c);
    const lastStats = save.records.lastExpeditionStats; 

    const checkRegionComplete = (regionList) => {
        const targetQIds = [];
        QUEST_DATA.forEach(q => { if (regionList.includes(q.region)) targetQIds.push(q.id); });
        if (targetQIds.length === 0) return false;
        return targetQIds.every(qid => save.s_ranks.includes(qid));
    };

    ACHIEVEMENT_DATA.forEach(ach => {
        if (save.achievements.includes(ach.id)) return; 
        let cleared = false;
        
        switch (ach.name) {
            case "国取り開始": cleared = save.s_ranks.length >= 1; break;
            case "初国獲り": cleared = save.completed_regions.length >= 1; break;
            case "天下布武": cleared = save.s_ranks.length >= QUEST_DATA.length; break;
            case "策士": cleared = save.tactics.length >= 6; break;
            case "知将": cleared = save.tactics.length >= 12; break;
            case "謀将": cleared = save.tactics.length >= 24; break;
            case "初黒星": cleared = save.records.retreatCount >= 1; break;
            case "歴戦の勇": cleared = save.records.totalBattles >= 100; break;
            case "百戦錬磨": cleared = save.records.totalBattles >= 500; break;
            case "軍神の如し": cleared = save.records.winStreak >= 50; break;
            case "1000里突破": cleared = save.records.totalDistance >= 1000; break;
            case "10000里突破": cleared = save.records.totalDistance >= 10000; break;
            case "敗軍の将": cleared = save.records.totalDead >= 3; break; 
            case "死神の如し": cleared = save.records.totalDead >= 90; break; 
            case "閻魔大名": cleared = save.records.totalDead >= 30; break;
            case "吸血大名": cleared = save.records.totalDead >= 100; break;
            case "人材宝庫": cleared = save.owned_ids.length >= 50; break;
            case "大軍団": cleared = save.owned_ids.length >= 100; break;
            case "真田三代": cleared = ["真田幸隆", "真田昌幸", "真田幸村"].every(n => ownedChars.some(c => c.name.includes(n))); break;
            case "浅井三姉妹": cleared = ["茶々", "初", "江"].every(n => ownedChars.some(c => c.name.includes(n))); break;
            case "人たらし大名": cleared = save.records.capturedCount >= 5; break;
            case "天竜のくじ": cleared = save.records.gachaCount >= 50; break;
            case "100人組手": cleared = save.records.totalWins >= 100; break; 
            case "解雇": cleared = save.records.totalReleased >= 1; break;
            case "大解雇": cleared = save.records.totalReleased >= 30; break;
            case "天下三肩付": cleared = [22, 23, 24].every(id => save.collected_treasures.includes(id)); break;
            case "天下五剣": cleared = [44, 45, 46, 47, 48].every(id => save.collected_treasures.includes(id)); break;
            case "天下の大数寄者": cleared = save.collected_treasures.length >= 30; break;
            case "風雲児": cleared = checkRegionComplete(REGION_MAP.east); break;
            case "麒麟児": cleared = checkRegionComplete(REGION_MAP.central); break;
            case "革命児": cleared = checkRegionComplete(REGION_MAP.west); break;
        }

        if (lastStats && lastStats.result === 'win') {
            switch (ach.name) {
                case "達人": cleared = (lastStats.deckCount === 1 && lastStats.deckRarities.some(r => ["R","SR","SSR","UR","LOB"].includes(r))); break;
                case "戦上手": cleared = lastStats.deckRarities.every(r => ["C","N"].includes(r)) && lastStats.deckCount === 3; break;
                case "単騎駆け": cleared = lastStats.deckCount === 1; break;
                case "敵中突破": cleared = lastStats.startHp <= 500; break;
                case "戦の申し子": cleared = lastStats.endHp >= lastStats.maxHp; break;
                case "大軍勢": cleared = lastStats.maxHp >= 10000; break;
                case "死中活路": cleared = lastStats.endFood <= 0; break;
                case "怒涛の進軍": cleared = lastStats.questDiff >= 6; break;
                case "獅子奮迅": cleared = lastStats.questDiff >= 9; break;
                case "仇は討った": cleared = lastStats.deadCount >= 1; break;
                case "先手必勝": cleared = lastStats.preemptive; break;
            }
            if (ach.cond.includes("(敵)に勝利") && save.records.lastDefeatedBoss) {
                if (ach.cond.includes(save.records.lastDefeatedBoss)) cleared = true;
            }
        }
        if (lastStats && lastStats.result !== 'win') {
             if (ach.name === "勇み足" && lastStats.endFood <= 0 && lastStats.result === 'retired') cleared = true;
        }

        if (cleared) {
            save.achievements.push(ach.id);
            newAchieved.push(ach.name);
            if (ach.reward_tactic && !save.tactics.includes(ach.reward_tactic)) {
                save.tactics.push(ach.reward_tactic);
                newTactics.push(ach.reward_tactic);
            }
        }
    });

    if (newAchieved.length > 0) {
        let msg = "【実績解除】\n" + newAchieved.join("\n");
        if (newTactics.length > 0) msg += "\n\n【新戦術獲得】\n" + newTactics.join("\n");
        alert(msg);
        delete save.records.lastDefeatedBoss;
        saveData(save);
    }
}

// --- cancelExpedition ---
function cancelExpedition() {
    const save = loadSaveData();
    if (!save.expedition) return;
    const now = Date.now();
    const exp = save.expedition;
    const q = QUEST_DATA.find(x => x.id === exp.questId);
    
    // speedModeによる調整は完了時刻にのみ影響するため、経過率計算は本来の日数ベースで行う
    // ただし、電撃強行軍の場合は即完了なのでここには来ないはずだが、念のため考慮
    const totalDuration = exp.endTime - exp.startTime;
    const elapsed = now - exp.startTime;
    const currentDay = Math.min(q.food, (elapsed / totalDuration) * q.food);
    
    exp.result = 'retired';
    exp.endTime = now;
    exp.logs.events = exp.logs.events.filter(ev => ev.day <= currentDay);
    exp.logs.daysTraveled = currentDay;
    exp.logs.events.push({ day: currentDay, text: `<span class="ev-bad">全軍撤退！進軍を中止し帰還しました。</span>` });
    exp.captured = []; 
    exp.treasures = [];
    save.records.retreatCount = (save.records.retreatCount || 0) + 1;
    saveData(save);
}

// --- startExpeditionCore (Updated) ---
function startExpeditionCore(questId, tacticName, speedMode = 'normal') {
    const save = loadSaveData();
    const deck = save.deck.map(id => getCharacterById(id));
    const quest = QUEST_DATA.find(q => q.id === questId);
    if (!quest) return { error: "クエストが見つかりません" };
    if (!deck.some(c => c)) return { error: "大将がいません" };
    
    let tactic = null;
    if (tacticName) {
        tactic = TACTICS_DATA.find(t => t.name === tacticName);
        if (tactic && save.tactics.includes(tacticName)) {
            if (tactic.isSuper) {
                const cost = tactic.cost || 10;
                if ((save.items.ticket || 0) < cost) return { error: `手形が足りません(必要: ${cost}枚)` };
                save.items.ticket -= cost;
            }
        } else {
            tactic = null;
        }
    }

    // --- Speed Mode Modifiers ---
    let timeMultiplier = 1.0;
    let foodMultiplier = 1.0;
    let enemyBuff = 1.0;

    if (speedMode === 'kakeashi') {
        timeMultiplier = 0.5; // 時間半分
        foodMultiplier = 1.5; // 兵糧1.5倍
    } else if (speedMode === 'dengeki') {
        timeMultiplier = 0.0; // 一瞬
        foodMultiplier = 3.0; // 兵糧3倍
        enemyBuff = 1.5;      // 敵ステータス1.5倍
    }

    if (tactic && tactic.name === "翔ぶが如く") timeMultiplier *= 0.25;

    const bossChar = (window.characterData.filter(c => c.rarity === quest.boss_r)[0]) || window.characterData[0];
    const weather = determineWeather(quest.id);
    
    const logs = simulateExpeditionLoop(quest, deck, weather, bossChar, tactic, foodMultiplier, enemyBuff);
    
    const actualDays = logs.daysTraveled;
    const duration = actualDays * SECONDS_PER_DAY * 1000 * timeMultiplier;
    
    const now = Date.now();
    const endTime = (speedMode === 'dengeki') ? now : (now + duration);

    if (logs.gainedItems) {
        if (logs.gainedItems.kokoro > 0) save.items.kokoro = (save.items.kokoro || 0) + logs.gainedItems.kokoro;
    }
    
    const validDeck = deck.filter(c => c);
    save.records.lastExpeditionStats = {
        result: logs.result,
        startHp: validDeck.reduce((a,c)=>a+c.hp,0),
        maxHp: validDeck.reduce((a,c)=>a+c.hp,0),
        endHp: logs.stats.hpRate * validDeck.reduce((a,c)=>a+c.hp,0),
        endFood: logs.finalFood,
        deckCount: validDeck.length,
        deckRarities: validDeck.map(c=>c.rarity),
        questDiff: quest.diff,
        deadCount: logs.stats.dead,
        preemptive: logs.preemptiveOccurred,
        speedMode: speedMode
    };

    save.expedition = { 
        questId: quest.id, 
        startTime: now, 
        endTime: endTime, 
        weather: weather, 
        logs: logs, 
        result: logs.result, 
        bossId: bossChar.id, 
        captured: logs.capturedIds, 
        stats: logs.stats,
        tactic: tactic ? tactic.name : null,
        treasures: logs.treasures
    };
    saveData(save);
    return { success: true };
}

function parseSkill(char) {
    if (!char || !char.skill) return { type: 'none', rate: 0, power: 0 };
    const desc = char.skill.desc || ""; 
    const effect = { type: 'none', name: char.skill.name, desc: desc, rate: 0.3, power: 1.0, targets: [], encounterMod: 0 };
    
    if (desc.includes("財宝")) {
        if (desc.includes("発見") && desc.includes("確率")) { effect.type = "treasure_rate_up"; effect.power = desc.includes("高確率") ? 0.15 : 0.05; return effect; }
        if (desc.includes("イベント")) { effect.type = "treasure_rate_up"; effect.power = 0.15; return effect; }
        if (desc.includes("ココロの鍵")) { effect.type = "treasure_to_key"; return effect; }
        if (desc.includes("使って")) {
            if (desc.includes("兵") && desc.includes("兵糧")) effect.type = "treasure_heal_both";
            else if (desc.includes("兵糧")) effect.type = "treasure_heal_food";
            else effect.type = "treasure_heal_hp";
            return effect;
        }
    }

    if (desc.includes("防御") || desc.includes("軽減") || desc.includes("半減")) { effect.type = "def_up"; effect.power = 0.5; return effect; }
    if (desc.includes("2回") || desc.includes("連続") || desc.includes("２回")) { effect.type = "multi_attack"; effect.count = 2; return effect; }
    if (desc.includes("全体") || desc.includes("全員")) { effect.type = "aoe_attack"; return effect; }
    if (desc.includes("毒")) { effect.type = "poison"; return effect; }
    if (desc.includes("混乱")) { effect.type = "confusion"; return effect; }
    
    const slayers = { "騎馬": "騎馬", "鉄砲": "鉄砲", "槍": "足軽", "弓": "弓兵", "男": "male", "女": "female", "織田": "織田家", "武田": "武田家", "上杉": "上杉家" };
    for (let k in slayers) {
        if (desc.includes(k) && (desc.includes("強い") || desc.includes("キラー") || desc.includes("特効"))) {
            effect.type = "slayer"; effect.target = slayers[k]; effect.power = 2.0; return effect;
        }
    }

    if (desc.includes("高確率") || desc.includes("しばしば")) effect.rate = 0.7;
    if (desc.includes("必ず") || desc.includes("100%")) effect.rate = 1.0;
    if (desc.includes("稀に") || desc.includes("ときどき")) effect.rate = 0.2;
    if (desc.includes("超大幅")) effect.power = 3.0; else if (desc.includes("大幅") || desc.includes("2倍")) effect.power = 2.0; else if (desc.includes("1.5倍")) effect.power = 1.5; else if (desc.includes("半減")) effect.power = 0.5;
    
    const preventMap = { "罠": "足止め罠", "奇襲": "奇襲", "悪天候": "悪天候", "計略": "計略", "布陣": "布陣失敗", "傷病": "傷病" };
    const prevents = [];
    Object.keys(preventMap).forEach(k => { if (desc.includes(k) && (desc.includes("無効")||desc.includes("防"))) prevents.push(preventMap[k]); });
    if (prevents.length > 0) { effect.type = "prevent"; effect.targets = prevents; return effect; }
    if (desc.includes("一撃必殺") || desc.includes("葬り去る")) { effect.type = "instant_kill"; return effect; }
    if (desc.includes("攻撃力") && desc.includes("アップ")) { effect.type = "buff_atk"; return effect; }
    if (desc.includes("反射")) { effect.type = "reflect"; effect.reflectTarget = desc.includes("騎馬")?"騎馬":(desc.includes("鉄砲")?"鉄砲":"all"); return effect; }
    if (desc.includes("回復")) { effect.type = desc.includes("兵糧")?"heal_food":"heal_hp"; return effect; }
    if (desc.includes("捕獲")) { effect.type = "capture_up"; return effect; }
    return effect;
}

function isFemale(char) {
    if (!char) return false;
    if (char.gender) return char.gender === 'female';
    const fNames = ["姫", "尼", "局", "ガラシャ", "誾千代", "千代", "初", "江", "茶々", "小松", "築山", "ねね", "まつ", "阿国", "直虎"];
    return fNames.some(n => char.name.includes(n));
}

// --- simulateBattle (Updated with enemyBuff) ---
function simulateBattle(deck, enemy, quest, tactic, enemyBuff = 1.0) {
    const battleLog = [];
    let lowRarityBuff = (tactic && tactic.name === "遠く交わり近く攻む") ? 1.5 : 1.0;
    
    let synergyAtkMod = 1.0;
    if (deck.filter(c => c && c.name.includes("真田")).length >= 3) synergyAtkMod *= 1.2;
    if (deck.filter(c => c && ["茶々", "初", "江"].includes(c.name)).length >= 3) synergyAtkMod *= 1.2;
    if (deck.filter(c => c && c.clan === "織田家").length >= 3) synergyAtkMod *= 1.1;

    let myParty = deck.map((c, i) => {
        if (!c) return null;
        let war = c.war;
        if ((c.rarity === 'N' || c.rarity === 'C') && lowRarityBuff > 1.0) war = Math.floor(war * lowRarityBuff);
        war = Math.floor(war * synergyAtkMod); 
        return { ...c, currentHp: c.hp, pos: i, isDead: false, skill: parseSkill(c), war: war, gender: c.gender || (isFemale(c) ? 'female' : 'male'), status: [] };
    });
    
    let enemySkill = parseSkill(enemy);
    if (tactic && tactic.name === "天地明察") {
        enemySkill = { type: 'none', rate: 0 };
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">超戦術【${tactic.name}】！敵の特技を封じた！</span>`);
    }

    // 敵ステータスに enemyBuff を適用
    let enemyUnit = {
        name: enemy.name, rarity: enemy.rarity, type: enemy.type || "足軽",
        war: Math.floor(enemy.war * (1.0 + quest.diff * 0.2) * enemyBuff), 
        hp: Math.floor(enemy.hp * (1.0 + quest.diff * 0.5) * enemyBuff),
        skill: enemySkill,
        maxHp: Math.floor(enemy.hp * (1.0 + quest.diff * 0.5) * enemyBuff),
        status: []
    };
    
    if (enemyBuff > 1.0) {
        battleLog.push(`<span class="ev-bad">敵軍強化！(強行軍の影響) 戦力${Math.floor(enemyBuff*100)}%</span>`);
    }

    battleLog.push(`敵将【${enemyUnit.name}】(${enemyUnit.type})と遭遇！`);
    
    if (tactic && tactic.name === "美人の計") {
        if (myParty.some(c => c && isFemale(c))) {
            battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">【美人の計】発動！敵攻撃力激減！</span>`);
            enemyUnit.war = Math.floor(enemyUnit.war * 0.3); 
        }
    }
    if (tactic && tactic.name === "魏を囲んで趙を救う" && enemyUnit.hp <= 1000) {
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！味方攻撃力UP！</span>`);
        myParty.forEach(c => { if(c) c.war = Math.floor(c.war * 2.0); }); 
    }
    if (tactic && tactic.name === "岸を隔てて火を観る" && enemyUnit.hp <= 1000) {
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！敵攻撃力DOWN！</span>`);
        enemyUnit.war = Math.floor(enemyUnit.war * 0.7);
    }
    if (tactic && tactic.name === "刀を借りて人を殺す") {
        let dmg = Math.floor(enemyUnit.hp * 0.1);
        enemyUnit.hp -= dmg;
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！敵に${dmg}のダメージ！</span>`);
    }
    const myTotalHp = myParty.reduce((a,c)=>a+(c?c.currentHp:0), 0);
    if (tactic && tactic.name === "門を関ざして賊を捕らう" && enemyUnit.hp > myTotalHp) {
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！大軍相手に奮起し攻撃UP！</span>`);
        myParty.forEach(c => { if(c) c.war = Math.floor(c.war * 1.5); });
    }
    if (tactic && tactic.name === "出陣ことはじめ") {
         enemyUnit.hp -= 10;
         battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！敵に10のダメージ！</span>`);
    }

    myParty.forEach(c => {
        if(!c) return;
        const fate = FATE_DATA.find(f => c.name.includes(f.me) && enemyUnit.name.includes(f.boss));
        if(fate) battleLog.push(`<span class="ev-fate" data-main="${fate.title}" data-sub="${fate.text}">【${c.name}】「${fate.text}」</span>`);
    });

    myParty.forEach(c => {
        if (c && !c.isDead && c.skill.type === 'instant_kill' && Math.random() < c.skill.rate) {
            enemyUnit.hp = 0; 
            battleLog.push(`<span class="ev-skill" data-char="${c.name}" data-skill="${c.skill.name}">【${c.name}】の${c.skill.name}！</span><span class="ev-good">一撃必殺！</span>`);
        }
    });
    if (tactic && tactic.name === "将を射んとすれば馬を射よ" && Math.random() < 0.05) {
        enemyUnit.hp = 0;
        battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】発動！敵将を射抜いた！</span>`);
    }
    if (enemyUnit.hp > 0 && enemyUnit.skill.type === 'instant_kill' && Math.random() < enemyUnit.skill.rate) {
        let targets = myParty.filter(c => c && !c.isDead);
        if (targets.length > 0) {
            let victim = targets[Math.floor(Math.random() * targets.length)];
            victim.currentHp = 0; victim.isDead = true;
            battleLog.push(`<span class="ev-bad ev-skill" data-char="${enemyUnit.name}" data-skill="${enemyUnit.skill.name}">敵【${enemyUnit.name}】の${enemyUnit.skill.name}！</span><span class="ev-bad">【${victim.name}】は倒れた...</span>`);
        }
    }

    if (enemyUnit.hp <= 0) {
        battleLog.push(`<span class="ev-good flash-on-win">敵将を討ち取ったり！</span>`);
        let currentTotal = 0, maxTotal = 0, dead = 0;
        myParty.forEach(c => { if(c) { currentTotal += Math.max(0, c.currentHp); maxTotal += c.hp; if(c.isDead) dead++; } });
        return { result: 'win', log: battleLog, remainingHpRate: (currentTotal/maxTotal), deadCount: dead };
    }
    if (myParty.every(c => !c || c.isDead)) {
        battleLog.push("部隊壊滅...");
        return { result: 'defeat', log: battleLog, remainingHpRate: 0, deadCount: deck.filter(x=>x).length };
    }

    // --- TURN LOOP ---
    for (let turn = 1; turn <= 10; turn++) {
        if (tactic && tactic.name === "逃げるを上とする" && (myParty.reduce((a,c)=>a+(c?c.currentHp:0),0) / myParty.reduce((a,c)=>a+(c?c.hp:0),0)) <= 0.7) {
             battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】！不利を悟り撤退！</span>`);
             return { result: 'retired', log: battleLog, remainingHpRate: 0, deadCount: myParty.filter(c=>c&&c.isDead).length };
        }

        // PLAYER ATTACK
        myParty.forEach(c => {
            if (!c || c.isDead) return;
            if (c.status.includes('confusion') && Math.random() < 0.3) {
                let selfDmg = Math.floor(c.war * 0.5);
                c.currentHp -= selfDmg;
                battleLog.push(`<span class="ev-bad">【${c.name}】は混乱している！自分を攻撃して${selfDmg}のダメージ！</span>`);
                return;
            }
            if (c.status.includes('poison')) {
                let poisonDmg = Math.floor(c.hp * 0.05);
                c.currentHp -= poisonDmg;
                if(c.currentHp <= 0) c.isDead = true;
                battleLog.push(`<span class="ev-bad" style="font-size:0.7rem;">(毒: ${c.name} -${poisonDmg})</span>`);
                if(c.isDead) return;
            }

            let attacks = (c.skill.type === 'multi_attack') ? c.skill.count : 1;
            
            for(let i=0; i<attacks; i++) {
                let m = TYPE_MATRIX[c.type][enemyUnit.type] || 1.0;
                if (tactic && tactic.name === "梁を盗み柱に換える") m = 1.0;
                
                if (c.skill.type === 'buff_atk' && Math.random() < c.skill.rate) m *= c.skill.power;
                if (c.name === "武蔵坊弁慶" && myParty.some(p => p && !p.isDead && p.gender === 'male' && p !== c)) m *= 1.5; 
                if (tactic && tactic.name === "無中に有を生ず" && c.currentHp <= c.hp * 0.5) m *= 2.0;
                
                if (c.skill.type === 'slayer') {
                    let isTarget = false;
                    if (enemyUnit.type === c.skill.target) isTarget = true;
                    if (isTarget) { m *= c.skill.power; battleLog.push(`<span class="ev-critical">【${c.name}】の特攻！</span>`); }
                }

                let dmg = Math.floor(c.war * m * (0.9 + Math.random() * 0.2));
                if (Math.random() < 0.1) { dmg = Math.floor(dmg * 1.5); battleLog.push(`<span class="ev-critical">【${c.name}】の会心の一撃！</span>`); }
                
                if (c.skill.type === 'aoe_attack') battleLog.push(`【${c.name}】の全体攻撃！`);

                enemyUnit.hp -= dmg;
                battleLog.push(`味方攻撃: ${dmg}ダメージ (敵残:${Math.max(0, enemyUnit.hp)})`);
            }
            
            if (c.skill.type === 'poison' && Math.random() < 0.3) {
                if(!enemyUnit.status.includes('poison')) { enemyUnit.status.push('poison'); battleLog.push(`<span class="ev-bad">敵【${enemyUnit.name}】に毒を与えた！</span>`); }
            }
        });

        if (enemyUnit.hp <= 0) {
            battleLog.push(`<span class="ev-good flash-on-win">敵将を討ち取ったり！</span>`);
            let currentTotal = 0, maxTotal = 0, dead = 0;
            myParty.forEach(c => { if(c) { currentTotal += Math.max(0, c.currentHp); maxTotal += c.hp; if(c.isDead) dead++; } });
            return { result: 'win', log: battleLog, remainingHpRate: (currentTotal/maxTotal), deadCount: dead };
        }
        
        // ENEMY ATTACK
        if (enemyUnit.status.includes('poison')) {
            let pDmg = Math.floor(enemyUnit.maxHp * 0.05);
            enemyUnit.hp -= pDmg;
            battleLog.push(`<span class="ev-bad" style="font-size:0.7rem;">(毒: 敵 -${pDmg})</span>`);
            if (enemyUnit.hp <= 0) return { result: 'win', log: battleLog, remainingHpRate: 1, deadCount: 0 };
        }

        const pref = TARGET_PREF[enemyUnit.type] || "random";
        let targets = myParty.filter(c => c && !c.isDead);
        if (targets.length === 0) break;
        let victim = null;
        if (pref === "front") victim = targets.find(c => c.pos === 0) || targets.find(c => c.pos === 1) || targets.find(c => c.pos === 2);
        else if (pref === "back") victim = targets.find(c => c.pos === 2) || targets.find(c => c.pos === 1) || targets.find(c => c.pos === 0);
        else victim = targets[Math.floor(Math.random() * targets.length)];

        if (victim) {
            if (tactic && tactic.name === "煉瓦を投げて玉を引く" && Math.random() < 0.2) {
                 battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">【${victim.name}】は戦術により攻撃を回避！</span>`);
            } else {
                let enemyAtkPower = enemyUnit.war;
                if (enemyUnit.skill.type === 'buff_atk' && Math.random() < enemyUnit.skill.rate) {
                    enemyAtkPower *= enemyUnit.skill.power;
                    battleLog.push(`<span class="ev-bad ev-skill" data-char="${enemyUnit.name}" data-skill="${enemyUnit.skill.name}">敵【${enemyUnit.name}】の${enemyUnit.skill.name}！</span>`);
                }
                
                if (enemyUnit.skill.type === 'aoe_attack' && Math.random() < 0.3) {
                    battleLog.push(`<span class="ev-bad ev-skill">敵【${enemyUnit.name}】の全体攻撃！</span>`);
                    targets.forEach(t => {
                        let aoeDmg = Math.floor(enemyAtkPower * 0.8 * (TYPE_MATRIX[enemyUnit.type][t.type]||1.0));
                        if (t.skill.type === 'def_up') { aoeDmg = Math.floor(aoeDmg * t.skill.power); }
                        t.currentHp -= aoeDmg;
                        if(t.currentHp<=0) { t.isDead = true; battleLog.push(`<span class="ev-bad">【${t.name}】撤退</span>`); }
                    });
                } else {
                    let m = TYPE_MATRIX[enemyUnit.type][victim.type] || 1.0;
                    if (tactic && tactic.name === "梁を盗み柱に換える") m = 1.0;

                    if (victim.skill.type === 'reflect' && (victim.skill.reflectTarget === 'all' || victim.skill.reflectTarget === enemyUnit.type)) {
                        enemyUnit.hp -= Math.floor(enemyUnit.war * 1.5);
                        battleLog.push(`<span class="ev-reflect">【${victim.name}】反射！</span>`);
                    } else {
                        let dmg = Math.floor(enemyAtkPower * m * (0.9 + Math.random() * 0.2));
                        if (Math.random() < 0.1) { dmg = Math.floor(dmg * 1.5); battleLog.push(`<span class="ev-bad ev-critical">敵【${enemyUnit.name}】の痛恨の一撃！</span>`); }
                        
                        if (victim.skill.type === 'def_up') { 
                            dmg = Math.floor(dmg * victim.skill.power); 
                            battleLog.push(`<span class="ev-skill" style="font-size:0.8rem">【${victim.name}】防御 (${victim.skill.name})</span>`);
                        }

                        victim.currentHp -= dmg;
                        battleLog.push(`<span class="log-dmg">敵攻撃: 【${victim.name}】に${dmg}</span>`);
                        
                        if (enemyUnit.skill.type === 'poison' && Math.random() < 0.3) victim.status.push('poison');
                        if (enemyUnit.skill.type === 'confusion' && Math.random() < 0.3) victim.status.push('confusion');

                        if (victim.currentHp <= 0) { 
                            victim.isDead = true; 
                            battleLog.push(`<span class="ev-bad">【${victim.name}】撤退</span>`);
                            if (tactic && tactic.name === "空城の計") {
                                battleLog.push(`<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】！味方撤退により全軍退却！</span>`);
                                return { result: 'retired', log: battleLog, remainingHpRate: 0, deadCount: myParty.filter(c=>c&&c.isDead).length };
                            }
                        }
                    }
                }
            }
        }

        if (myParty.every(c => !c || c.isDead)) { battleLog.push("全滅..."); return { result: 'defeat', log: battleLog, remainingHpRate: 0, deadCount: 3 }; }
    }
    return { result: 'draw', log: battleLog, remainingHpRate: 0, deadCount: 0 };
}

// --- simulateExpeditionLoop (Updated with foodMultiplier & enemyBuff) ---
function simulateExpeditionLoop(quest, deck, weather, bossChar, tactic, foodMultiplier = 1.0, enemyBuff = 1.0) {
    const events = [];
    const capturedIds = [];
    const treasures = [];
    const gainedItems = { kokoro: 0 }; 
    const totalDays = quest.food; 
    let currentFood = Math.floor(deck.reduce((s, c) => s + (c ? c.cost : 0), 0) * 1.0) + 15;
    
    let hp = deck.reduce((s, c) => s + (c ? c.hp : 0), 0);
    const maxHp = hp;
    let totalDead = 0;
    let ladderUsed = false;
    let luck = 1.0;
    if (tactic && tactic.name === "東に叫んで西を撃つ") luck = 2.0;

    let treasureBaseRate = 0.03 * luck;
    deck.forEach(c => {
        if (!c) return;
        const s = parseSkill(c);
        if (s.type === 'treasure_rate_up') treasureBaseRate += s.power;
    });

    const addLog = (day, text) => events.push({ day: day, text: text });
    let preemptiveOccurred = false;

    addLog(0, `<span class="log-time">出発</span> 兵糧:${currentFood} (行程:${totalDays}日)`);
    if (tactic) addLog(0, `<span style="color:#d4af37;">【戦術採用】${tactic.name}</span>`);
    if (foodMultiplier > 1.0) addLog(0, `<span class="ev-bad">強行軍！兵糧消費${foodMultiplier}倍</span>`);

    for (let d = 1; d <= totalDays; d++) {
        let cost = (weather === '雪') ? 2 : 1;
        if (tactic && tactic.name === "桑を指して槐を罵る") cost = Math.max(0, cost - 1);
        const healer = deck.find(c => c && parseSkill(c).type === 'heal_food');
        if (healer && Math.random() < parseSkill(healer).rate) cost = 0;
        
        // Apply Food Multiplier
        cost = Math.ceil(cost * foodMultiplier);
        currentFood -= cost;
        
        if (tactic && tactic.name === "屋根に上げて梯子を外す" && !ladderUsed && (hp / maxHp <= 0.5)) {
            currentFood += 50; ladderUsed = true;
            addLog(d, `<span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】！兵糧50回復！</span>`);
        }
        
        if (tactic && tactic.name === "天を欺き海を渡る" && currentFood <= 0) {
             addLog(d, `${d}日目: <span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】！兵糧尽き撤退</span>`);
             return { events: events, result: 'retired', capturedIds: capturedIds, weather: weather, stats: { hpRate: hp/maxHp, dead: totalDead }, daysTraveled: d, treasures: treasures, gainedItems: gainedItems, finalFood: currentFood };
        }
        if (currentFood <= 0) {
            addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">兵糧尽きる... 撤退</span>`);
            return { events: events, result: 'retired', capturedIds: capturedIds, weather: weather, stats: { hpRate: 0, dead: 0 }, daysTraveled: d, treasures: treasures, gainedItems: gainedItems, finalFood: currentFood };
        }

        // Treasure
        if (Math.random() < treasureBaseRate) {
            const t = TREASURE_DATA[Math.floor(Math.random() * TREASURE_DATA.length)];
            let handled = false;
            const keyConverter = deck.find(c => c && parseSkill(c).type === 'treasure_to_key');
            if (keyConverter && Math.random() < 0.3) {
                gainedItems.kokoro++;
                addLog(d, `${d}日目: <span class="ev-skill" data-char="${keyConverter.name}" data-skill="${keyConverter.skill.name}">【${keyConverter.name}】の${keyConverter.skill.name}！</span>財宝が「ココロの鍵」に変化！`);
                handled = true;
            }
            if (!handled) {
                const bothHealer = deck.find(c => c && parseSkill(c).type === 'treasure_heal_both');
                if (bothHealer) {
                    hp = Math.min(maxHp, hp + Math.floor(maxHp * 0.2)); currentFood += 10;
                    addLog(d, `${d}日目: <span class="ev-skill" data-char="${bothHealer.name}">【${bothHealer.name}】が財宝で回復！</span>`);
                    handled = true;
                }
            }
            if (!handled) {
                const foodHealer = deck.find(c => c && parseSkill(c).type === 'treasure_heal_food');
                if (foodHealer) { currentFood += 20; addLog(d, `${d}日目: 【${foodHealer.name}】が財宝で兵糧回復！`); handled = true; }
            }
            if (!handled) {
                const hpHealer = deck.find(c => c && parseSkill(c).type === 'treasure_heal_hp');
                if (hpHealer) { hp = Math.min(maxHp, hp + Math.floor(maxHp * 0.3)); addLog(d, `${d}日目: 【${hpHealer.name}】が財宝で兵力回復！`); handled = true; }
            }
            if (!handled) {
                treasures.push(t.id);
                addLog(d, `${d}日目: <span style="color:#fd0;">✨ 家宝「${t.name}」を発見した！</span>`);
            }
        }

        // Event
        let eventOccurred = false;
        if (quest.interference && quest.interference.length > 0 && Math.random() < (0.3 / luck)) { 
            eventOccurred = true;
            const inf = quest.interference[Math.floor(Math.random() * quest.interference.length)];
            
            // 超戦術: 蒼天航路
            if (tactic && tactic.name === "蒼天航路") {
                addLog(d, `${d}日目: <span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】が${inf}を無効化！</span>`);
            } else {
                const block = deck.find(c => c && parseSkill(c).type === 'prevent' && parseSkill(c).targets.includes(inf));
                let tacticBlock = false;
                if (tactic) {
                    if (inf === "足止め罠" && tactic.name === "連環の計") tacticBlock = true;
                    if (inf === "奇襲" && tactic.name === "苦肉の計") tacticBlock = true;
                    if (inf === "計略" && tactic.name === "反間の計") tacticBlock = true;
                }
                if (block) { addLog(d, `${d}日目(糧${currentFood}): <span class="ev-skill" data-char="${block.name}" data-skill="妨害回避">【${block.name}】が${inf}を回避！</span>`); }
                else if (tacticBlock) { addLog(d, `${d}日目(糧${currentFood}): <span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術【${tactic.name}】が${inf}を無効化！</span>`); }
                else {
                    let dmg = 0;
                    if (inf === "悪天候" || inf === "計略") { currentFood -= 5; addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">${inf}により兵糧5を失った...</span>`); }
                    else { dmg = Math.floor(maxHp * 0.20); hp -= dmg; addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad log-dmg">${inf}被害！ 兵${dmg}減少</span>`); }
                }
            }
        }
        else if (Math.random() < 0.3) { 
            let avoid = false;
            if (tactic && tactic.name === "道を借りて各を伐つ" && Math.random() < 0.5) avoid = true;
            if (!avoid) {
                eventOccurred = true;
                currentFood -= Math.ceil(2 * foodMultiplier); // Battle cost also scaled
                const enemy = { name: "敵部隊", rarity: "N", type: quest.type, war: 40 + (quest.diff*8), hp: 300 + (quest.diff*80) };
                
                // Pass enemyBuff to battle
                const battle = simulateBattle(deck, enemy, quest, tactic, enemyBuff);
                
                if (battle.result === 'win') {
                    addLog(d, `${d}日目(糧${currentFood}): 敵部隊を撃破！`);
                    if (Math.random() * 100 < 5) capturedIds.push(window.characterData[0].id);
                    if (tactic && tactic.name === "笑裏に刀を蔵す") { currentFood += 1; }
                } else if (battle.result === 'retired') {
                    addLog(d, `${d}日目: 戦闘より撤退。`);
                    return { events: events, result: 'retired', capturedIds: capturedIds, weather: weather, stats: { hpRate: hp/maxHp, dead: totalDead }, daysTraveled: d, treasures: treasures, gainedItems: gainedItems, finalFood: currentFood };
                } else {
                    let dmg = Math.floor(maxHp * 0.2);
                    if (tactic && tactic.name === "痴を偽るも転せず" && currentFood <= 50) { dmg = Math.floor(dmg * 0.5); addLog(d, `<span class="ev-skill" style="font-size:0.8rem">戦術【痴を偽るも転せず】により被害軽減</span>`); }
                    hp -= dmg;
                    addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad log-dmg">敗走... 被害を受けた。</span>`);
                }
                totalDead += battle.deadCount;
            } else {
                addLog(d, `${d}日目(糧${currentFood}): <span class="ev-skill" data-char="戦術" data-skill="${tactic.name}">戦術により戦闘を回避。</span>`);
            }
        }
        
        if (tactic && tactic.name === "逸を以って労を待つ") { hp = Math.min(maxHp, hp + Math.floor(maxHp * 0.01)); }
        if (tactic && tactic.name === "暗かに陳倉に渡る") { hp = Math.min(maxHp, hp + Math.floor(maxHp * 0.01)); }

        if (!eventOccurred) addLog(d, `${d}日目(糧${currentFood}): 順調に進軍中...`);
        if (hp <= 0) { addLog(d, `${d}日目(糧${currentFood}): <span class="ev-bad">部隊全滅... 敗北</span>`); return { events: events, result: 'defeat', capturedIds: capturedIds, weather: weather, stats: { hpRate: 0, dead: totalDead }, daysTraveled: d, treasures: treasures, gainedItems: gainedItems, finalFood: currentFood }; }
    }

    addLog(totalDays, `<span class="ev-battle">目的地到着！敵本陣【${bossChar.name}】と決戦！</span>`);
    // Boss Battle with Buff
    const bossBattle = simulateBattle(deck, bossChar, quest, tactic, enemyBuff);
    
    bossBattle.log.forEach((l, idx) => { if (idx > 0) addLog(totalDays + 0.1, l); if(l.includes("先制")) preemptiveOccurred = true; });
    totalDead += bossBattle.deadCount;

    return { 
        events: events, 
        result: bossBattle.result, 
        capturedIds: capturedIds, 
        weather: weather,
        stats: { hpRate: bossBattle.remainingHpRate, dead: totalDead },
        daysTraveled: totalDays,
        treasures: treasures,
        gainedItems: gainedItems,
        finalFood: currentFood,
        preemptiveOccurred: preemptiveOccurred
    };
}

function determineWeather(questId) { const seeds = ["晴れ", "雨", "曇り", "雪"]; return seeds[Math.floor(Math.random() * seeds.length)]; }
function calculateCaptureProb(deck, enemyChar, tactic) { 
    let maxRate = 0;
    if (!enemyChar) return 0;
    const enemyRarity = enemyChar.rarity;
    const enemyGender = enemyChar.gender || "male"; 
    deck.forEach(c => {
        if (!c) return;
        const s = parseSkill(c);
        if (s.type === 'capture_up') {
            let base = (c.rarity === 'LOB' || c.rarity === 'UR') ? 10.0 : 1.0;
            if (c.rarity === 'SSR') base = 5.0; 
            let val = base * s.power; 
            if (c.name === "帰蝶") { if (enemyGender === "male") val = 50.0; else val = 0; }
            if (val > maxRate) maxRate = val;
        }
    });
    let baseRate = maxRate * 5 + 5;
    if (enemyRarity === 'SSR' || enemyRarity === 'UR') baseRate = Math.min(50, maxRate * 5); 
    if (tactic && tactic.name === "捕らんと欲すれば暫く待て") baseRate += 10;
    return Math.min(95, baseRate);
}

// --- SHOP & ITEM LOGIC ---

/**
 * アイテムを購入する
 * @param {string} itemId - 'ticket' | 'kokoro'
 * @returns {object} { success: boolean, msg: string, current: saveObject }
 */
function buyItem(itemId) {
    const save = loadSaveData();
    let cost = 0;
    let name = "";

    if (itemId === 'ticket') {
        cost = 500;
        name = "手形";
    } else if (itemId === 'kokoro') {
        cost = 2000;
        name = "ココロの鍵";
    } else {
        return { success: false, msg: "無効なアイテムです" };
    }

    if ((save.money || 0) < cost) {
        return { success: false, msg: "銀貨が足りません！" };
    }

    save.money -= cost;
    
    if (itemId === 'ticket') {
        save.items.ticket = (save.items.ticket || 0) + 1;
    } else if (itemId === 'kokoro') {
        save.items.kokoro = (save.items.kokoro || 0) + 1;
    }

    saveData(save);
    return { success: true, msg: `「${name}」を購入しました！`, current: save };
}

/**
 * 家宝を売却する
 * @param {number} treasureId 
 * @returns {object} { success: boolean, msg: string, current: saveObject }
 */
function sellTreasure(treasureId) {
    const save = loadSaveData();
    const index = save.collected_treasures.indexOf(treasureId);
    
    if (index === -1) {
        return { success: false, msg: "その家宝は所持していません" };
    }

    const treasure = TREASURE_DATA.find(t => t.id === treasureId);
    if (!treasure) {
        return { success: false, msg: "データが存在しません" };
    }

    const price = treasure.rank * 100;
    
    // 売却処理: リストから削除し、金を加算
    save.collected_treasures.splice(index, 1);
    save.money = (save.money || 0) + price;

    saveData(save);
    return { success: true, msg: `「${treasure.name}」を${price}銭で売却しました。`, current: save };
}