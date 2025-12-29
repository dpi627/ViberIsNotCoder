import React from 'react';
import { AppConfig, SlideType } from './types';

// ==========================================
// CONFIGURATION ZONE
// ==========================================

export const APP_CONFIG: AppConfig = {
  // Generated Avatar Update:
  // - top=fro: Afro hair
  // - accessories=sunglasses: Cool shades (covers eyes/eyebrows)
  // - mouth=twinkle: Closed smile (no teeth)
  // - facialHairProbability=0: Clean shaven (removes beard)
  // - eyes=default: Explicitly set regular eyes to prevent "X" shape (xD) from appearing
  characterImage: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&top=fro&accessories=sunglasses&accessoriesProbability=100&hairColor=2c1b18&skinColor=edb98a&backgroundColor=ff9800&clothing=collarAndSweater&clothingColor=3c4f5c&mouth=twinkle&facialHairProbability=0&eyes=default",

  slides: [
    {
      id: 'slide-1',
      type: SlideType.IMAGE,
      content: 'assets\\slide-1.png',
      dialogue: "大家好，我是 Will 保哥。你各位主管請出來面對。",
    },
    {
      id: 'slide-2',
      type: SlideType.IMAGE,
      content: "assets\\slide-2.png",
      dialogue: "Vibe Coding 的世界裡，程式是一次性消耗品。",
      backgroundColor: "bg-indigo-900"
    },
    {
      id: 'slide-3',
      type: SlideType.IMAGE,
      content: 'assets\\slide-3.png',
      dialogue: "Vibe Coding 是戰術工具，不是戰略能力。",
    },
    {
      id: 'slide-4',
      type: SlideType.IMAGE,
      content: "assets\\slide-4.png",
      dialogue: "工程師的世界裡，程式是長期負債與資產的混合體。",
    },
    {
      id: 'slide-5',
      type: SlideType.IMAGE,
      content: 'assets\\slide-5.png',
      dialogue: "理解，通常不是學來的，是被現實打出來的。",
    },
    {
      id: 'slide-6',
      type: SlideType.IMAGE,
      content: 'assets\\slide-6.png',
      dialogue: "這不是技術高低的差距，而是責任半徑的區別。",
    },
    {
      id: 'slide-7',
      type: SlideType.IMAGE,
      content: 'assets\\slide-7.png',
      dialogue: "不是不想教 Vibe Coding，而是很清楚那是一種完全不同的價值系統。",
    },
    {
      id: 'slide-8',
      type: SlideType.IMAGE,
      content: 'assets\\slide-8.png',
      dialogue: "不要外包大腦、不要外包你的大腦、不要外包。 (如果有的話)",
    }
  ]
};