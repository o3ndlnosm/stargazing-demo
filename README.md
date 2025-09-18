# 🌟 觀星應用程式 (Stargazing Demo)

一個基於 d3-celestial 的互動式星圖應用程式，提供豐富的天文觀測功能和中文化界面。

## ✨ 功能特色

### 🌌 星圖顯示
- **互動式星圖**：基於 d3-celestial 庫的高質量星圖渲染
- **多種投影方式**：支援正射投影、球面投影等
- **即時位置定位**：自動獲取使用者地理位置
- **星等調整**：可調整顯示的星等限制（1-6等星）

### ⭐ 星座功能
- **十二星座導航**：一鍵導航至任意星座
- **平滑動畫效果**：使用 Celestial.rotate() 實現流暢的視角轉換
- **星座資訊面板**：詳細的星座神話故事、特徵描述
- **選擇性顯示**：點擊星座可隱藏其他星座線條，突出顯示選中星座
- **中文本地化**：完整的繁體中文星座名稱和描述

### 🌠 流星雨功能
- **即時流星雨追蹤**：顯示當前活躍的流星雨
- **輻射點可視化**：在星圖上標示流星雨輻射點位置
- **詳細資訊**：包含極大期、ZHR、母體彗星等資訊
- **年度流星雨日曆**：涵蓋主要流星雨事件

### 🎨 視覺效果
- **銀河顯示**：可切換銀河系可視化
- **網格線系統**：可選的赤道坐標網格
- **自定義色彩**：支援銀河顏色調整
- **響應式設計**：適應不同螢幕尺寸

## 🚀 快速開始

### 本地運行
1. 克隆專案：
```bash
git clone https://github.com/o3ndlnosm/stargazing-demo.git
cd stargazing-demo
```

2. 啟動本地伺服器（推薦使用 Python）：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. 開啟瀏覽器訪問：`http://localhost:8000`

### 系統需求
- 現代網頁瀏覽器（支援 HTML5 和 JavaScript）
- 網路連線（用於地理位置服務）
- 建議使用桌面瀏覽器以獲得最佳體驗

## 📁 專案結構

```
stargazing-demo/
├── index.html          # 主頁面
├── app.js              # 核心應用程式邏輯
├── .gitignore          # Git 忽略檔案
├── README.md           # 專案說明
├── data/               # 天文數據檔案
│   ├── stars.6.json    # 6等星資料
│   ├── constellations.json  # 星座資料
│   ├── mw.json         # 銀河資料
│   └── ...
└── libs/               # 第三方庫
    ├── d3.v3.min.js    # D3.js v3
    ├── celestial.js    # d3-celestial 庫
    └── ...
```

## 🎯 使用方法

### 基本操作
- **拖拽**：滑鼠拖拽旋轉星圖
- **滾輪**：縮放星圖
- **星座按鈕**：點擊十二星座按鈕快速導航
- **控制面板**：調整星等、投影方式等設定

### 星座探索
1. 點擊任意星座按鈕（如 ♈ 牡羊、♉ 金牛）
2. 星圖會平滑轉動至該星座
3. 其他星座線條會變淡，突出顯示選中星座
4. 右側會顯示詳細的星座資訊面板
5. 點擊空白處或按 ESC 鍵關閉資訊面板

### 流星雨觀測
1. 點擊「流星雨」按鈕開啟流星雨模式
2. 當前活躍的流星雨會在星圖上顯示為彩色圓點
3. 點擊輻射點可查看詳細資訊
4. 左下角狀態欄會顯示活躍流星雨列表

## 🛠 技術架構

### 核心技術
- **d3-celestial**: 天文可視化庫
- **D3.js v3**: 數據驅動文檔操作
- **HTML5 Canvas/SVG**: 圖形渲染
- **Geolocation API**: 位置服務
- **JavaScript ES6+**: 現代 JavaScript 特性

### 數據來源
- **星表數據**: Hipparcos 星表
- **星座數據**: IAU 官方星座邊界
- **流星雨數據**: IMO 國際流星組織
- **深空天體**: Messier 天體目錄

## 🌟 主要特色

### 中文本地化
- 完整的繁體中文界面
- 星座中文名稱對照
- 詳細的中文神話故事描述
- 本地化的日期和數字格式

### 平滑動畫系統
使用 `Celestial.rotate()` 實現：
- 無縫的視角轉換
- 自然的慣性效果
- 可中斷的動畫序列
- 動畫完成回調處理

### 智能星座高亮
- 選擇性隱藏非相關星座
- 保持選中星座完整可見
- 平滑的透明度過渡
- 一鍵恢復所有顯示

## 📝 開發說明

### 添加新星座
在 `app.js` 的 `zodiacConstellations` 物件中添加新的星座資料：

```javascript
NewConstellation: {
  name: "新星座",
  symbol: "⭐",
  dates: "日期範圍",
  element: "元素屬性",
  ruler: "守護星",
  story: "神話故事...",
  // ...其他屬性
}
```

### 自定義流星雨
在 `meteorShowers` 陣列中添加新的流星雨資料：

```javascript
{
  name: "新流星雨",
  nameEn: "New Shower",
  peak: "極大期",
  active: "活躍期",
  zhr: 數值,
  radiant: { ra: 赤經, dec: 赤緯 },
  // ...其他屬性
}
```

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📜 授權條款

此專案使用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- [d3-celestial](https://github.com/ofrohn/d3-celestial) - 優秀的天文可視化庫
- [D3.js](https://d3js.org/) - 強大的數據可視化框架
- IAU - 國際天文聯合會的官方星座資料
- IMO - 國際流星組織的流星雨資料

---

⭐ 如果這個專案對你有幫助，歡迎給個 Star！