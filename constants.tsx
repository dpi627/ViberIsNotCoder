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
      content: 'https://picsum.photos/1920/1080?random=1',
      dialogue: "Yo! Welcome to the StorySlider! Check out my new style. Afro and shades, ready to roll!",
    },
    {
      id: 'slide-2',
      type: SlideType.TEXT,
      title: "Design Philosophy",
      content: "We believe in separating content from presentation. This text slide is rendered purely from configuration data.",
      dialogue: "Even with these sunglasses on, I can clearly see the beautiful typography here.",
      backgroundColor: "bg-indigo-900"
    },
    {
      id: 'slide-3',
      type: SlideType.IMAGE,
      content: 'https://picsum.photos/1920/1080?random=2',
      dialogue: "Moving through the slides with style. The orange background really pops, doesn't it?",
    },
    {
      id: 'slide-4',
      type: SlideType.HTML,
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <h2 className="text-4xl font-bold text-pink-400 mb-4">Interactive Elements</h2>
                <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 transition-colors rounded-full font-bold shadow-lg transform hover:scale-105 active:scale-95">
                    Click Me!
                </button>
            </div>
        </div>
      ),
      dialogue: "Interactive components are cool, but my hair is cooler.",
      backgroundColor: "bg-gray-800"
    },
    {
      id: 'slide-5',
      type: SlideType.IMAGE,
      content: 'https://picsum.photos/1920/1080?random=3',
      dialogue: "That's a wrap! I'm heading out to the disco. Peace!",
    }
  ]
};