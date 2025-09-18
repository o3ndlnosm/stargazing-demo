// 觀星網頁 JavaScript 主程式
// 使用 d3-celestial 庫創建互動式星圖

let celestialConfig = {
  width: 0, // 自動調整寬度
  height: 0, // 自動調整高度
  projection: "orthographic", // 預設投影方式
  transform: "equatorial", // 座標系統
  center: null, // 自動置中
  geopos: null, // 將使用瀏覽器地理位置

  // 配置數據來源為本地
  datapath: "data/",

  // 使用預設語言，稍後自定義星座名稱
  // culture: "cn",

  // 星星設定
  stars: {
    show: true,
    limit: 5, // 星等限制
    colors: true, // 顯示星星顏色
    style: { fill: "#ffffff", opacity: 0.8 },
    names: true,
    nameStyle: {
      fill: "#dddddd",
      font: "12px 'Microsoft YaHei', 'SimHei', Arial, sans-serif",
      align: "left",
      baseline: "top",
    },
    size: 7, // 星星大小
    exponent: -0.28, // 星等指數
    data: "stars.6.json",
  },

  // 深空天體設定
  dsos: {
    show: true,
    limit: 6,
    colors: true,
    style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 0.7 },
    names: true,
    data: "dsos.bright.json",
  },

  // 流星雨輻射點設定
  meteorShowers: {
    show: false, // 預設關閉
    style: {
      fill: "#ff6600",
      stroke: "#ffff00",
      width: 2,
      opacity: 0.8,
    },
    size: 8,
    names: true,
    nameStyle: {
      fill: "#ffff99",
      font: "12px 'Microsoft YaHei', 'SimHei', Arial, sans-serif",
      align: "left",
      baseline: "bottom",
    },
  },

  // 行星設定
  planets: {
    show: false, // 暫時關閉行星顯示
  },

  // 星座設定
  constellations: {
    names: true,
    nameStyle: {
      fill: "#cccc99",
      align: "center",
      baseline: "middle",
      font: "14px 'Microsoft YaHei', 'SimHei', Arial, sans-serif",
    },
    lines: true,
    lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
    bounds: false,
    namesType: "name", // 使用文化特定名稱
    // culture: "cn",      // 使用自定義名稱替代
    data: "constellations.json",
  },

  // 銀河設定
  mw: {
    show: true,
    style: { fill: "#6699cc", opacity: 0.2 },
    data: "mw.json",
  },

  // 網格線設定
  lines: {
    graticule: {
      show: false,
      stroke: "#cccccc",

      width: 0.6,
      opacity: 0.8,
    },
    equatorial: {
      show: false,
      stroke: "#aaaaaa",
      width: 1.3,
      opacity: 0.7,
    },
  },

  // 背景設定
  background: {
    fill: "#000011",
    stroke: "#000000",
    opacity: 1,
    width: 1.5,
  },

  // 互動設定
  interactive: true,
  controls: true,
  form: false,
  location: true,
};

// 全域變數
let celestialSphere;
let currentConfig = { ...celestialConfig };
let showMeteorShowers = false;

// 動畫相關變數
let isAnimating = false;
let animationId = null;

// 現代星座繁體中文名稱對照表
const constellationNames = {
  Aries: "牡羊座",
  Taurus: "金牛座",
  Gemini: "雙子座",
  Cancer: "巨蟹座",
  Leo: "獅子座",
  Virgo: "處女座",
  Libra: "天秤座",
  Scorpius: "天蠍座",
  Sagittarius: "射手座",
  Capricornus: "摩羯座",
  Aquarius: "水瓶座",
  Pisces: "雙魚座",
  Andromeda: "仙女座",
  Aquila: "天鷹座",
  Ara: "天壇座",
  Auriga: "御夫座",
  Boötes: "牧夫座",
  Caelum: "雕具座",
  Camelopardalis: "鹿豹座",
  "Canis Major": "大犬座",
  "Canis Minor": "小犬座",
  Capricornus: "摩羯座",
  Carina: "船底座",
  Cassiopeia: "仙后座",
  Centaurus: "半人馬座",
  Cepheus: "仙王座",
  Cetus: "鯨魚座",
  Columba: "天鴿座",
  "Corona Australis": "南冕座",
  "Corona Borealis": "北冕座",
  Corvus: "烏鴉座",
  Crater: "巨爵座",
  Crux: "南十字座",
  Cygnus: "天鵝座",
  Delphinus: "海豚座",
  Draco: "天龍座",
  Equuleus: "小馬座",
  Eridanus: "波江座",
  Hercules: "武仙座",
  Hydra: "長蛇座",
  Lepus: "天兔座",
  Lyra: "天琴座",
  Monoceros: "麒麟座",
  Ophiuchus: "蛇夫座",
  Orion: "獵戶座",
  Pegasus: "飛馬座",
  Perseus: "英仙座",
  "Piscis Austrinus": "南魚座",
  Puppis: "船尾座",
  Pyxis: "羅盤座",
  Sagitta: "天箭座",
  Serpens: "巨蛇座",
  Sextans: "六分儀座",
  Triangulum: "三角座",
  "Ursa Major": "大熊座",
  "Ursa Minor": "小熊座",
  Vela: "船帆座",
  Volans: "飛魚座",
  Vulpecula: "狐狸座",
};

// 十二星座詳細資料庫
const zodiacConstellations = {
  Aries: {
    name: "牡羊座",
    symbol: "♈",
    dates: "3月21日 - 4月19日",
    element: "火象星座",
    ruler: "火星",
    story:
      "希臘神話中，牡羊座代表長有金羊毛的公羊。這隻神奇的公羊救了被繼母迫害的王子佛里克索斯和公主赫勒，載著他們飛越海洋。雖然赫勒中途落海，但佛里克索斯安全到達，並將金羊毛獻給宙斯，公羊則被升上天空成為星座。",
    traits: "勇敢、衝動、熱情、開創性強、直率坦誠",
    mainStars: "婁宿三（α Arietis）、婁宿一（β Arietis）、婁宿二（γ Arietis）",
    bestViewing: "11月至12月",
    mythology:
      "金羊毛的故事啟發了後來著名的阿爾戈英雄遠征，伊阿宋率領英雄們尋找金羊毛的冒險成為希臘神話中最偉大的英雄史詩之一。",
  },
  Taurus: {
    name: "金牛座",
    symbol: "♉",
    dates: "4月20日 - 5月20日",
    element: "土象星座",
    ruler: "金星",
    story:
      "宙斯愛上了腓尼基公主歐羅巴，為了接近她，化身為一頭美麗溫馴的白牛。當歐羅巴騎上牛背時，宙斯載著她渡海到克里特島。為紀念這段愛情，宙斯將白牛的形象升上天空。",
    traits: "穩重、務實、耐心、固執、享受生活",
    mainStars:
      "畢宿五（α Tauri，Aldebaran）- 全天第14亮星、昴宿星團（Pleiades）- 七姊妹星團",
    bestViewing: "12月至1月",
    mythology:
      "金牛座包含著名的昴宿星團，在許多文化中都有重要地位。中國稱為『昴宿』，日本稱為『すばる』（Subaru），是肉眼可見最美麗的星團。",
  },
  Gemini: {
    name: "雙子座",
    symbol: "♊",
    dates: "5月21日 - 6月20日",
    element: "風象星座",
    ruler: "水星",
    story:
      "代表斯巴達王后勒達的雙胞胎兒子卡斯托爾和波魯克斯。卡斯托爾是凡人，波魯克斯是宙斯之子。當卡斯托爾戰死後，波魯克斯請求與兄弟分享永生，宙斯感動之下將兄弟倆化為星座，永遠相伴。",
    traits: "機智、好奇、善變、溝通力強、多才多藝",
    mainStars: "北河三（α Geminorum，Castor）、北河二（β Geminorum，Pollux）",
    bestViewing: "1月至2月",
    mythology:
      "雙子兄弟是航海者的守護神，當海上風暴來臨時，水手們會向他們祈禱。聖艾爾摩之火（船桅上的電光）被認為是雙子座的顯靈。",
  },
  Cancer: {
    name: "巨蟹座",
    symbol: "♋",
    dates: "6月21日 - 7月22日",
    element: "水象星座",
    ruler: "月亮",
    story:
      "海克力斯與九頭蛇海德拉戰鬥時，女神赫拉派出巨蟹攻擊海克力斯的腳。雖然巨蟹被英雄踩死，但赫拉為了表彰它的忠誠，將它升上天空成為星座。",
    traits: "敏感、顧家、情感豐富、保護欲強、念舊",
    mainStars: "柳宿增三（β Cancri）、鬼宿星團（M44，Beehive Cluster）",
    bestViewing: "2月至3月",
    mythology:
      "巨蟹座中心的鬼宿星團（蜂巢星團）在中國被稱為『積屍氣』，肉眼看似一片雲霧，實際上包含數百顆恆星，是最接近地球的疏散星團之一。",
  },
  Leo: {
    name: "獅子座",
    symbol: "♌",
    dates: "7月23日 - 8月22日",
    element: "火象星座",
    ruler: "太陽",
    story:
      "代表海克力斯十二項任務中的第一項：殺死刀槍不入的涅墨亞獅子。海克力斯最終用雙手扼死了獅子，並剝下獅皮作為盔甲。宙斯將獅子升上天空以紀念這個壯舉。",
    traits: "自信、慷慨、領導力強、驕傲、忠誠",
    mainStars:
      "軒轅十四（α Leonis，Regulus）- 獅子之心、五帝座一（β Leonis，Denebola）- 獅子之尾",
    bestViewing: "3月至4月",
    mythology:
      "軒轅十四是天空中第21亮的恆星，自古以來被稱為『王者之星』，在占星學中象徵著王權和榮耀。",
  },
  Virgo: {
    name: "處女座",
    symbol: "♍",
    dates: "8月23日 - 9月22日",
    element: "土象星座",
    ruler: "水星",
    story:
      "代表農業女神狄蜜特的女兒珀耳塞福涅，或正義女神阿斯特賴亞。當人類墮落後，阿斯特賴亞是最後離開地球的神祇，她升上天空成為處女座，手持正義的天秤（天秤座）。",
    traits: "細心、分析力強、追求完美、謙虛、實際",
    mainStars: "角宿一（α Virginis，Spica）- 麥穗星，全天第16亮星",
    bestViewing: "4月至5月",
    mythology:
      "角宿一（Spica）的拉丁文意思是『麥穗』，象徵豐收。這顆藍白色巨星是雙星系統，古代用它來確定季節和農時。",
  },
  Libra: {
    name: "天秤座",
    symbol: "♎",
    dates: "9月23日 - 10月22日",
    element: "風象星座",
    ruler: "金星",
    story:
      "代表正義女神阿斯特賴亞手中的天秤，用來衡量人類的善惡。也有說法認為是冥王黑帝斯用來秤量靈魂的天秤。天秤座是黃道十二宮中唯一的非生物星座。",
    traits: "公正、優雅、社交能力強、追求和諧、優柔寡斷",
    mainStars:
      "氐宿一（α Librae，Zubenelgenubi）- 南爪、氐宿四（β Librae，Zubeneschamali）- 北爪",
    bestViewing: "5月至6月",
    mythology:
      "天秤座的兩顆主星古代曾被視為天蠍座的螯，後來才獨立成為天秤座。有趣的是，氐宿四是少數呈現綠色的恆星。",
  },
  Scorpius: {
    name: "天蠍座",
    symbol: "♏",
    dates: "10月23日 - 11月21日",
    element: "水象星座",
    ruler: "冥王星（古代為火星）",
    story:
      "獵戶座奧利安因驕傲自大，聲稱要殺盡所有動物。大地之母蓋亞派出巨蠍刺死了奧利安。宙斯將兩者都升上天空，但安排在相反位置，當天蠍升起時，獵戶就會落下。",
    traits: "熱情、神秘、洞察力強、執著、極端",
    mainStars: "心宿二（α Scorpii，Antares）- 火星的對手，紅超巨星",
    bestViewing: "6月至7月",
    mythology:
      "心宿二是全天第15亮星，這顆紅超巨星的直徑是太陽的700倍。它的紅色光芒常被誤認為火星，故名『火星的對手』（Antares）。",
  },
  Sagittarius: {
    name: "射手座",
    symbol: "♐",
    dates: "11月22日 - 12月21日",
    element: "火象星座",
    ruler: "木星",
    story:
      "代表半人馬喀戎（Chiron），他是希臘神話中最智慧的半人馬，精通醫術、音樂和預言，是許多英雄的導師。被毒箭誤傷後，他放棄永生，宙斯將他升上天空成為星座。",
    traits: "樂觀、冒險、自由、哲學思維、直率",
    mainStars:
      "箕宿三（ε Sagittarii，Kaus Australis）、斗宿六（σ Sagittarii，Nunki）",
    bestViewing: "7月至8月",
    mythology:
      "射手座指向銀河系中心，這個區域充滿星雲和星團，包括著名的礁湖星雲（M8）和三裂星雲（M20）。",
  },
  Capricornus: {
    name: "摩羯座",
    symbol: "♑",
    dates: "12月22日 - 1月19日",
    element: "土象星座",
    ruler: "土星",
    story:
      "代表牧神潘恩。當怪物提風來襲時，潘恩跳入尼羅河變身逃跑，但因慌張只有下半身變成魚，上半身仍是山羊。宙斯覺得這形象有趣，將其升上天空。",
    traits: "自律、野心、務實、責任感強、保守",
    mainStars: "壘壁陣四（δ Capricorni，Deneb Algedi）- 山羊之尾",
    bestViewing: "8月至9月",
    mythology:
      "摩羯座在古巴比倫被稱為『山羊魚』，與智慧之神恩基有關。這個半羊半魚的形象象徵著從物質（土）到情感（水）的轉化。",
  },
  Aquarius: {
    name: "水瓶座",
    symbol: "♒",
    dates: "1月20日 - 2月18日",
    element: "風象星座",
    ruler: "天王星（古代為土星）",
    story:
      "代表特洛伊王子蓋尼米德，他的美貌讓宙斯著迷。宙斯化身老鷹將他帶到奧林帕斯山，讓他成為諸神的斟酒人，負責倒出神酒。",
    traits: "創新、獨立、人道主義、理智、反叛",
    mainStars:
      "危宿一（α Aquarii，Sadalmelik）、虛宿一（β Aquarii，Sadalsuud）",
    bestViewing: "9月至10月",
    mythology:
      "水瓶座倒出的水流向南魚座，古人認為這是尼羅河的源頭。這個區域被稱為『水之領域』，附近還有雙魚座、鯨魚座等水相關星座。",
  },
  Pisces: {
    name: "雙魚座",
    symbol: "♓",
    dates: "2月19日 - 3月20日",
    element: "水象星座",
    ruler: "海王星（古代為木星）",
    story:
      "愛神阿芙蘿黛蒂和兒子厄洛斯為躲避怪物提風，跳入幼發拉底河變成兩條魚。為了不失散，他們用絲帶綁住彼此的尾巴。這對母子魚被升上天空成為雙魚座。",
    traits: "同情心、想像力豐富、直覺強、藝術性、逃避現實",
    mainStars: "外屏七（η Piscium）、右更二（γ Piscium）",
    bestViewing: "10月至11月",
    mythology:
      "雙魚座的兩條魚分別游向不同方向，象徵著靈性與物質、理想與現實的拉扯。春分點曾經在雙魚座，現已因歲差移至寶瓶座。",
  },
};

// 流星雨數據庫
const meteorShowers = [
  {
    name: "象限儀座流星雨",
    nameEn: "Quadrantids",
    peak: "1/3-1/4",
    active: "12/28-1/12",
    zhr: 120,
    radiant: { ra: 230, dec: 49 }, // 赤經赤緯
    parent: "小行星 2003 EH1",
    velocity: 41,
    color: "#ffff00",
  },
  {
    name: "天琴座流星雨",
    nameEn: "Lyrids",
    peak: "4/22-4/23",
    active: "4/16-4/25",
    zhr: 18,
    radiant: { ra: 271, dec: 34 },
    parent: "C/1861 G1 (Thatcher)",
    velocity: 49,
    color: "#ff6600",
  },
  {
    name: "水瓶座η流星雨",
    nameEn: "Eta Aquariids",
    peak: "5/5-5/6",
    active: "4/19-5/28",
    zhr: 50,
    radiant: { ra: 338, dec: -1 },
    parent: "1P/Halley",
    velocity: 66,
    color: "#00ffff",
  },
  {
    name: "英仙座流星雨",
    nameEn: "Perseids",
    peak: "8/12-8/13",
    active: "7/17-8/24",
    zhr: 100,
    radiant: { ra: 48, dec: 58 },
    parent: "109P/Swift-Tuttle",
    velocity: 59,
    color: "#ff0080",
  },
  {
    name: "獵戶座流星雨",
    nameEn: "Orionids",
    peak: "10/21-10/22",
    active: "10/2-11/7",
    zhr: 25,
    radiant: { ra: 95, dec: 16 },
    parent: "1P/Halley",
    velocity: 66,
    color: "#80ff00",
  },
  {
    name: "獅子座流星雨",
    nameEn: "Leonids",
    peak: "11/17-11/18",
    active: "11/6-11/30",
    zhr: 15,
    radiant: { ra: 152, dec: 22 },
    parent: "55P/Tempel-Tuttle",
    velocity: 71,
    color: "#ff8000",
  },
  {
    name: "雙子座流星雨",
    nameEn: "Geminids",
    peak: "12/13-12/14",
    active: "12/4-12/20",
    zhr: 120,
    radiant: { ra: 112, dec: 33 },
    parent: "3200 Phaethon",
    velocity: 35,
    color: "#0080ff",
  },
  {
    name: "小熊座流星雨",
    nameEn: "Ursids",
    peak: "12/22-12/23",
    active: "12/17-12/26",
    zhr: 10,
    radiant: { ra: 217, dec: 76 },
    parent: "8P/Tuttle",
    velocity: 33,
    color: "#ff4080",
  },
];

// 轉換赤經赤緯到球面座標
function raDec2Spherical(ra, dec) {
  // 赤經(度) 轉 弧度，赤緯(度) 轉 弧度
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  return [(raRad * 180) / Math.PI, (decRad * 180) / Math.PI];
}

// 取得目前活躍的流星雨
function getActiveMeteorShowers() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return meteorShowers.filter((shower) => {
    // 簡化的日期檢查（實際應該更精確）
    const activeRange = shower.active;
    const [startStr, endStr] = activeRange.split("-");
    const [startMonth, startDay] = startStr.split("/").map(Number);
    const [endMonth, endDay] = endStr.split("/").map(Number);

    // 處理跨年的情況
    if (startMonth > endMonth) {
      return (
        month >= startMonth ||
        month <= endMonth ||
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      );
    } else {
      return (
        (month > startMonth || (month === startMonth && day >= startDay)) &&
        (month < endMonth || (month === endMonth && day <= endDay))
      );
    }
  });
}

// 繪製流星雨輻射點
function drawMeteorShowers() {
  if (!showMeteorShowers) return;

  const activeShowers = getActiveMeteorShowers();

  // 清除現有的流星雨標記
  d3.selectAll(".meteor-shower").remove();

  // 繪製活躍流星雨的輻射點
  activeShowers.forEach((shower) => {
    const coords = raDec2Spherical(shower.radiant.ra, shower.radiant.dec);
    const projection = Celestial.projection();
    const projected = projection(coords);

    if (projected && !isNaN(projected[0]) && !isNaN(projected[1])) {
      // 繪製輻射點圓圈
      d3.select("#celestial-map svg g")
        .append("circle")
        .attr("class", "meteor-shower")
        .attr("cx", projected[0])
        .attr("cy", projected[1])
        .attr("r", Math.max(3, shower.zhr / 20))
        .style("fill", shower.color)
        .style("stroke", "#ffffff")
        .style("stroke-width", 1)
        .style("opacity", 0.8)
        .on("click", function () {
          showMeteorShowerInfo(shower);
        });

      // 繪製名稱標籤
      d3.select("#celestial-map svg g")
        .append("text")
        .attr("class", "meteor-shower meteor-shower-label")
        .attr("x", projected[0] + 8)
        .attr("y", projected[1] - 8)
        .text(shower.name)
        .style("fill", "#ffff99")
        .style("font", "12px Microsoft YaHei, SimHei, Arial, sans-serif")
        .style("text-anchor", "start");
    }
  });
}

// 顯示流星雨詳細資訊
function showMeteorShowerInfo(shower) {
  const info = `
流星雨: ${shower.name}
極大期: ${shower.peak}
活躍期: ${shower.active}
ZHR: ${shower.zhr}
母體: ${shower.parent}
速度: ${shower.velocity} km/s
    `.trim();

  alert(info);
}

// 更新活躍流星雨狀態指示器
function updateMeteorShowerStatus() {
  const activeShowers = getActiveMeteorShowers();
  const statusDiv = document.getElementById("active-showers");

  if (activeShowers.length === 0) {
    statusDiv.innerHTML = '<span style="color: #888;">目前無活躍流星雨</span>';
  } else {
    const statusHtml = activeShowers
      .map((shower) => {
        const intensity =
          shower.zhr > 50 ? "強" : shower.zhr > 20 ? "中" : "弱";
        return `
                <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    <span style="color: ${shower.color}; font-weight: bold;">●</span>
                    <strong>${shower.name}</strong>
                    <br>
                    <small>極大期: ${shower.peak} | ZHR: ${shower.zhr} (${intensity})</small>
                </div>
            `;
      })
      .join("");
    statusDiv.innerHTML = statusHtml;
  }
}

// 初始化星圖
function initCelestialMap() {
  // 調整畫布大小
  currentConfig.width = window.innerWidth;
  currentConfig.height = window.innerHeight;

  // 嘗試獲取使用者位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        currentConfig.geopos = [lon, lat];

        document.getElementById(
          "location-info"
        ).textContent = `位置: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

        // 用獲取到的位置初始化星圖
        initMap();
      },
      (error) => {
        console.warn("無法獲取地理位置:", error);
        document.getElementById("location-info").textContent =
          "使用預設位置 (台北: 25.03°N, 121.57°E)";
        currentConfig.geopos = [121.5654, 25.033]; // 台北
        initMap();
      }
    );
  } else {
    document.getElementById("location-info").textContent =
      "瀏覽器不支援地理位置";
    currentConfig.geopos = [121.5654, 25.033]; // 台北
    initMap();
  }
}

// 實際初始化地圖
function initMap() {
  try {
    // 設定星座名稱為中文
    currentConfig.lang = "zh";

    // 載入星星名稱數據以支援星星發光效果
    fetch('data/starnames.json')
      .then(response => response.json())
      .then(data => {
        window.starNamesData = data;
        console.log('星星名稱數據已載入');
      })
      .catch(error => {
        console.warn('無法載入星星名稱數據:', error);
      });

    Celestial.display(currentConfig);

    // 更新流星雨狀態並繪製輻射點
    updateMeteorShowerStatus();
    setTimeout(() => {
      drawMeteorShowers();
    }, 1000);

    // 設置事件監聽器
    setupEventListeners();
  } catch (error) {
    console.error("星圖初始化失敗:", error);

    // 顯示錯誤訊息
    document.getElementById("celestial-map").innerHTML =
      '<div style="color: white; text-align: center; padding: 50px;">' +
      "<h2>初始化錯誤</h2>" +
      "<p>星圖載入失敗: " +
      error.message +
      "</p>" +
      "<p>請檢查網路連線並重新整理頁面</p>" +
      "</div>";
  }
}

// 設置事件監聽器
function setupEventListeners() {
  // 星等滑桿
  const magSlider = document.getElementById("magnitude");
  const magValue = document.getElementById("mag-value");

  magSlider.addEventListener("input", function () {
    const value = parseFloat(this.value);
    magValue.textContent = value.toFixed(1);

    currentConfig.stars.limit = value;
    Celestial.display(currentConfig);
    // 重繪流星雨
    setTimeout(() => drawMeteorShowers(), 500);
  });

  // 投影方式選擇
  const projectionSelect = document.getElementById("projection");
  projectionSelect.addEventListener("change", function () {
    currentConfig.projection = this.value;
    Celestial.display(currentConfig);
    // 重繪流星雨
    setTimeout(() => drawMeteorShowers(), 500);
  });

  // 視窗大小調整
  window.addEventListener("resize", function () {
    currentConfig.width = window.innerWidth;
    currentConfig.height = window.innerHeight;
    Celestial.display(currentConfig);
    // 重繪流星雨
    setTimeout(() => drawMeteorShowers(), 500);
  });
}

// 控制功能函數
function toggleConstellations() {
  currentConfig.constellations.lines = !currentConfig.constellations.lines;
  Celestial.display(currentConfig);
}

function toggleConstellationNames() {
  currentConfig.constellations.names = !currentConfig.constellations.names;
  Celestial.display(currentConfig);
}

function toggleMilkyWay() {
  currentConfig.mw.show = !currentConfig.mw.show;
  Celestial.display(currentConfig);
}

function toggleGrid() {
  const isGridShown = currentConfig.lines.graticule.show;
  currentConfig.lines.graticule.show = !isGridShown;
  currentConfig.lines.equatorial.show = !isGridShown;
  Celestial.display(currentConfig);
}

function toggleMeteorShowers() {
  showMeteorShowers = !showMeteorShowers;
  if (showMeteorShowers) {
    drawMeteorShowers();
  } else {
    // 清除流星雨標記
    d3.selectAll(".meteor-shower").remove();
  }
}

function resetView() {
  // 重置為初始配置
  currentConfig = { ...celestialConfig };
  currentConfig.width = window.innerWidth;
  currentConfig.height = window.innerHeight;

  // 重置中心位置和縮放
  currentConfig.center = null;
  currentConfig.zoomlevel = null;

  // 重置控制項
  document.getElementById("magnitude").value = 5;
  document.getElementById("mag-value").textContent = "5.0";
  document.getElementById("projection").value = "orthographic";

  // 重置流星雨顯示
  showMeteorShowers = false;
  d3.selectAll(".meteor-shower").remove();

  // 關閉星座資訊面板
  closeConstellationInfo();

  console.log("重置視圖到初始狀態");
  Celestial.display(currentConfig);
}

// 顯示全天視圖（不重置其他設定）
function showAllSkyView() {
  if (isAnimating) {
    console.log("動畫進行中，忽略全天視圖請求");
    return;
  }

  console.log("平滑切換到全天視圖");

  const targetCenter = [0, 0, 0];
  const currentCenter = currentConfig.center || [0, 0, 0];

  // 使用內建動畫回到全天視圖
  animateToPosition(currentCenter, targetCenter, 1200);
}

// 移除 DOMContentLoaded 事件，改由 HTML 中的 window.load 觸發

// 星座資訊顯示功能
function showConstellationInfo(constellationKey) {
  const constellation = zodiacConstellations[constellationKey];
  if (!constellation) {
    console.error("找不到星座資料:", constellationKey);
    return;
  }

  // 填充星座資訊面板
  document.getElementById('constellation-name').textContent = constellation.name;
  document.getElementById('constellation-symbol').textContent = constellation.symbol;
  document.getElementById('constellation-dates').textContent = constellation.dates;
  document.getElementById('constellation-element').textContent = constellation.element;
  document.getElementById('constellation-ruler').textContent = constellation.ruler;
  document.getElementById('constellation-viewing').textContent = constellation.bestViewing;
  document.getElementById('constellation-stars').textContent = constellation.mainStars;
  document.getElementById('constellation-story').textContent = constellation.story;
  document.getElementById('constellation-mythology').textContent = constellation.mythology;

  // 顯示星座資訊面板
  document.getElementById('constellation-info-panel').style.display = 'block';

  // 隱藏其他星座線條，只顯示選中的星座
  highlightSelectedConstellation(constellationKey);

  // 移動視角到星座位置
  centerOnConstellation(constellationKey);
}

function closeConstellationInfo() {
  document.getElementById("constellation-info-panel").style.display = "none";

  // 恢復所有星座線條的顯示
  restoreAllConstellations();
}

// 高亮選中的星座，隱藏其他星座線條
function highlightSelectedConstellation(selectedConstellation) {
  // 記錄選中的星座
  Celestial.selectedConstellation = selectedConstellation;

  console.log('高亮星座:', selectedConstellation);

  // 不重繪星圖，直接操作現有的 SVG 元素
  setTimeout(() => {
    hideNonSelectedConstellations(selectedConstellation);
  }, 50);
}

// 隱藏非選中的星座線條
function hideNonSelectedConstellations(selectedConstellation) {
  // 獲取所有星座線條元素
  const constellationLines = d3.selectAll('.constellation');
  const constellationNames = d3.selectAll('.constellation-name');

  // 隱藏所有星座線條
  constellationLines.style('opacity', function(d) {
    if (d && d.properties && d.properties.id) {
      return d.properties.id === selectedConstellation ? 1 : 0.1;
    }
    return 0.1;
  });

  // 隱藏所有星座名稱，除了選中的
  constellationNames.style('opacity', function(d) {
    if (d && d.id) {
      return d.id === selectedConstellation ? 1 : 0.2;
    }
    return 0.2;
  });

  // 或者使用更直接的方法
  try {
    d3.selectAll('.constellation').each(function(d) {
      const element = d3.select(this);
      if (d && d.properties && d.properties.id !== selectedConstellation) {
        element.style('opacity', 0.1);
      } else {
        element.style('opacity', 1);
      }
    });
  } catch (error) {
    console.log('星座線條選擇性顯示失敗:', error);
  }
}

// 恢復所有星座線條的顯示
function restoreAllConstellations() {
  // 清除選中狀態
  Celestial.selectedConstellation = null;

  console.log('恢復所有星座線條顯示');

  // 不重繪星圖，直接恢復所有星座線條的透明度
  try {
    d3.selectAll('.constellation').style('opacity', 1);
    d3.selectAll('.constellation-name').style('opacity', 1);
    d3.selectAll('.constellation-line').style('opacity', 1);
    d3.selectAll('[class*="constellation"]').style('opacity', 1);
  } catch (error) {
    console.log('恢復星座線條透明度失敗:', error);
  }
}

// 取得星座中心位置（基於主要恆星的實際座標）
function getConstellationCenter(constellationKey) {
  // 使用赤經（度）和赤緯（度），基於主要恆星位置
  const centers = {
    Aries: [32.2, 20.8], // 婁宿三（α Arietis）附近
    Taurus: [68.9, 16.5], // 畢宿五（Aldebaran）附近
    Gemini: [116.3, 28.0], // 北河二、北河三中間
    Cancer: [130.8, 19.5], // 鬼宿星團（M44）附近
    Leo: [152.1, 11.9], // 軒轅十四（Regulus）附近
    Virgo: [201.3, -11.2], // 角宿一（Spica）附近
    Libra: [229.3, -16.0], // 氐宿一、氐宿四中間
    Scorpius: [247.4, -26.3], // 心宿二（Antares）附近
    Sagittarius: [283.8, -25.4], // 箕宿三附近（弓箭手中心）
    Capricornus: [308.3, -17.2], // 壘壁陣四附近
    Aquarius: [331.4, -9.9], // 危宿一附近（水瓶中心）
    Pisces: [23.7, 3.8], // 雙魚中間位置
  };
  return centers[constellationKey];
}

// 使用 Celestial.rotate 實現真正的平滑動畫
function animateToPosition(startCenter, endCenter, duration = 1200) {
  if (isAnimating) {
    console.log("動畫進行中，忽略新的請求");
    return;
  }

  isAnimating = true;
  console.log("開始平滑動畫到位置:", endCenter);

  // 使用 Celestial 內建的 rotate 功能實現平滑旋轉
  try {
    // 直接使用 Celestial.rotate 進行平滑旋轉
    Celestial.rotate({
      center: endCenter
    });

    // 更新配置
    currentConfig.center = endCenter;

    // 設置動畫完成的延遲，給旋轉動畫時間完成
    setTimeout(() => {
      isAnimating = false;
      console.log("動畫完成");

      // 重繪流星雨
      if (showMeteorShowers) {
        setTimeout(drawMeteorShowers, 100);
      }
    }, duration);

  } catch (error) {
    console.error("動畫失敗:", error);
    isAnimating = false;

    // 備用方案：直接設置位置
    currentConfig.center = endCenter;
    Celestial.display(currentConfig);

    // 重繪流星雨
    if (showMeteorShowers) {
      setTimeout(drawMeteorShowers, 100);
    }
  }
}

// 將視角平滑轉移到指定星座
function centerOnConstellation(constellationKey) {
  if (isAnimating) {
    console.log("動畫進行中，忽略新的移動請求");
    return;
  }

  const center = getConstellationCenter(constellationKey);
  if (!center) {
    console.warn("找不到星座中心位置:", constellationKey);
    return;
  }

  // 轉換坐標：從赤經/赤緯（度）轉為 d3-celestial 的中心格式
  let longitude = center[0];

  // 處理赤經超過 180° 的情況
  if (longitude > 180) {
    longitude = longitude - 360;
  }

  const latitude = center[1];

  // 確保緯度在有效範圍內
  const clampedLatitude = Math.max(-90, Math.min(90, latitude));

  const targetCenter = [longitude, clampedLatitude, 0];

  // 獲取當前位置
  const currentCenter = currentConfig.center || [0, 0, 0];

  console.log(`平滑移動到星座: ${constellationKey}`);
  console.log(`當前位置: [${currentCenter[0].toFixed(1)}, ${currentCenter[1].toFixed(1)}]`);
  console.log(`目標位置: [${targetCenter[0].toFixed(1)}, ${targetCenter[1].toFixed(1)}]`);

  // 開始平滑動畫
  animateToPosition(currentCenter, targetCenter, 1200);
}

// 點擊外部關閉面板
document.addEventListener("click", function (event) {
  const panel = document.getElementById("constellation-info-panel");
  if (panel.style.display === "block" && !panel.contains(event.target)) {
    // 檢查點擊的是否為星座按鈕
    const isConstellationButton =
      event.target.onclick &&
      event.target.onclick.toString().includes("showConstellationInfo");
    if (!isConstellationButton) {
      closeConstellationInfo();
    }
  }
});

// ESC 鍵關閉面板
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeConstellationInfo();
  }
});

// 載入錯誤處理
window.addEventListener("error", function (e) {
  console.error("發生錯誤:", e.error);

  // 如果是載入錯誤，顯示備用訊息
  if (e.error && e.error.message && e.error.message.includes("Celestial")) {
    document.getElementById("celestial-map").innerHTML =
      '<div style="color: white; text-align: center; padding-top: 50vh;">' +
      "<h2>載入錯誤</h2>" +
      "<p>無法載入星圖庫，請檢查網路連線。</p>" +
      "</div>";
  }
});

// 更改銀河顏色
function changeMilkyWayColor(color) {
  currentConfig.mw.style.fill = color;
  Celestial.display(currentConfig);

  // 重繪流星雨
  setTimeout(() => {
    if (showMeteorShowers) {
      drawMeteorShowers();
    }
  }, 500);
}
