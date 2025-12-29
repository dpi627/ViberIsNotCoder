import React from 'react';

export enum SlideType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  HTML = 'HTML'
}

// Slide enter/exit animation types
export enum SlideAnimation {
  FADE = 'fade',
  SLIDE_LEFT = 'slideLeft',
  SLIDE_RIGHT = 'slideRight',
  SLIDE_UP = 'slideUp',
  SLIDE_DOWN = 'slideDown',
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
  FLIP = 'flip',
  BOUNCE = 'bounce',
  NONE = 'none'
}

// Character effect animations
export enum CharacterAnimation {
  BOUNCE = 'bounce',
  SPIN = 'spin',
  SHAKE = 'shake',
  JUMP = 'jump',
  WAVE = 'wave',
  PULSE = 'pulse',
  NONE = 'none'
}

// Dialogue box animations
export enum DialogueAnimation {
  TYPEWRITER = 'typewriter',
  FADE_IN = 'fadeIn',
  SLIDE_UP = 'slideUp',
  POP = 'pop',
  NONE = 'none'
}

// Transition configuration for each slide
export interface TransitionConfig {
  slideEnter?: SlideAnimation;
  slideExit?: SlideAnimation;
  characterEffect?: CharacterAnimation;
  dialogueStyle?: DialogueAnimation;
  duration?: number; // milliseconds
}

export interface SlideConfig {
  id: string;
  type: SlideType;
  content: string | React.ReactNode; // URL for image, Text for text, or Node
  title?: string; // Optional title for text slides
  dialogue: string;
  backgroundColor?: string;
  transition?: TransitionConfig; // Animation configuration
}

export interface AppConfig {
  characterImage: string;
  slides: SlideConfig[];
}

export enum CharacterState {
  IDLE = 'IDLE',
  RUNNING_LEFT = 'RUNNING_LEFT',
  RUNNING_RIGHT = 'RUNNING_RIGHT',
  HIDDEN = 'HIDDEN'
}