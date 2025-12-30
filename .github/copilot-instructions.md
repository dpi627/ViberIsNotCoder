# StorySlider Framework - AI Coding Instructions

## 專案概述
React + TypeScript 互動式簡報框架，結合動畫角色與打字機對話系統。純前端 SPA，部署至 GitHub Pages。

## 架構核心

### 資料流與狀態管理
- **集中式設定**: 所有投影片內容定義於 [constants.tsx](../constants.tsx) 的 `APP_CONFIG`
- **狀態集中於 App.tsx**: `currentSlideIndex`, `characterState`, `showDialogue`, `charPosition` 等狀態統一管理
- **計時器管理**: 使用 `useRef` 追蹤所有 `setTimeout`，切換投影片時透過 `clearTimers()` 清除

### 元件職責
| 元件 | 職責 |
|-----|-----|
| `App.tsx` | 狀態協調、導航邏輯、鍵盤事件 |
| `SlideContent.tsx` | 根據 `SlideType` 渲染 IMAGE/TEXT/HTML |
| `Character.tsx` | 角色動畫狀態機 (IDLE/RUNNING_LEFT/RUNNING_RIGHT/HIDDEN) |
| `DialogueBox.tsx` | 打字機效果、對話循環 |

## 關鍵模式

### 新增投影片
編輯 `constants.tsx`，遵循現有結構：
```typescript
{
  id: 'slide-new',
  type: SlideType.IMAGE,
  content: assetPath('assets/slide-new.png'),
  dialogue: "對話內容",
  transition: {
    slideEnter: SlideAnimation.FADE,
    characterEffect: CharacterAnimation.WAVE,
    dialogueStyle: DialogueAnimation.SLIDE_UP
  }
}
```

### 資源路徑處理
使用 `assetPath()` 函數處理靜態資源，確保開發與 GitHub Pages 部署相容：
```typescript
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
```

### 動畫系統
- **CSS Keyframes**: 定義於 `index.html` 的 `<style>` 區塊
- **Enum 對應**: `types.ts` 的 enum 透過 `getXxxAnimationClass()` 函數映射至 CSS class
- **角色動畫類別**: `animate-float`, `animate-run`, `animate-char-*`
- **投影片動畫類別**: `animate-slide-*`

## 開發工作流

```bash
npm run dev      # 啟動開發伺服器 (port 3000)
npm run build    # 建構至 dist/
npm run preview  # 預覽建構結果
```

## 重要約定

1. **型別優先**: 所有設定使用 `types.ts` 定義的 enum 和 interface
2. **TailwindCSS via CDN**: 樣式使用 Tailwind utility classes，無需本地編譯
3. **外部依賴**:
   - DiceBear API: 角色頭像 (`characterImage` 設定)
   - Google Fonts: Noto Sans TC
4. **GitHub Pages 部署**: `vite.config.ts` 中 `base: '/ViberIsNotCoder/'` 必須與 repo 名稱一致

## 常見任務

- **修改對話內容**: 編輯 `constants.tsx` 中的 `dialogue` 欄位
- **調整動畫**: 修改 `transition` 設定或 `index.html` 中的 `@keyframes`
- **新增投影片圖片**: 放置於 `public/assets/`，命名為 `slide-*.png`
