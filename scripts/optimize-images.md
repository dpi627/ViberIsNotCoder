# 圖檔壓縮與優化指南

## 🎯 快速壓縮步驟

### 方案 1: TinyPNG (推薦 - 最簡單)

1. 前往 https://tinypng.com/
2. 上傳 `public/assets/` 內所有 PNG 圖檔
3. 下載壓縮後的檔案
4. 覆蓋原始檔案

**優點**: 無需安裝工具、品質損失極小、壓縮率 60-80%

---

### 方案 2: Squoosh (推薦 - 最靈活)

1. 前往 https://squoosh.app/
2. 拖曳圖檔進入
3. 選擇壓縮格式:
   - **WebP**: 最佳壓縮率 (推薦)
   - **MozJPEG**: 適用 JPEG
   - **OxiPNG**: 適用 PNG
4. 調整品質滑桿 (建議 75-85)
5. 下載並替換原檔

**優點**: 支援格式轉換、可視化比較、離線使用

---

### 方案 3: 自動化腳本 (適合大量圖檔)

#### 安裝依賴
```bash
npm install --save-dev sharp
```

#### 建立壓縮腳本 `scripts/auto-compress.js`
```javascript
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const ASSETS_DIR = './public/assets';

async function compressAll() {
  const files = await fs.readdir(ASSETS_DIR);
  
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    
    const input = path.join(ASSETS_DIR, file);
    const output = path.join(ASSETS_DIR, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    await sharp(input)
      .webp({ quality: 80 })
      .toFile(output);
    
    const oldSize = (await fs.stat(input)).size;
    const newSize = (await fs.stat(output)).size;
    const saved = ((1 - newSize/oldSize) * 100).toFixed(1);
    
    console.log(`✅ ${file} → ${path.basename(output)} (節省 ${saved}%)`);
  }
}

compressAll();
```

#### 執行
```bash
node scripts/auto-compress.js
```

#### 更新 constants.tsx
```typescript
// 將所有 .png 改為 .webp
content: assetPath('assets/slide-1.webp'),
```

---

## 📊 預期效果

| 方案 | 壓縮率 | 品質損失 | 瀏覽器支援 |
|-----|-------|---------|----------|
| TinyPNG (PNG) | 60-70% | 極小 | 100% |
| Squoosh (WebP) | 70-80% | 小 | 97%+ |
| 自動化 (WebP) | 70-80% | 可控 | 97%+ |

---

## ⚠️ 注意事項

1. **備份原始檔案**: 壓縮前請先備份
2. **測試品質**: 壓縮後檢查畫面是否可接受
3. **WebP 回退**: 如使用 WebP，建議保留 PNG 作為回退
4. **Git LFS**: 如檔案過大，考慮使用 Git LFS 管理

---

## 🚀 建議流程

1. **先測試**: 選一張圖用 Squoosh 試壓
2. **檢查品質**: 確認畫面符合需求
3. **批次處理**: 使用 TinyPNG 或自動化腳本
4. **驗證載入**: 執行 `npm run dev` 測試
5. **提交變更**: commit 並部署
