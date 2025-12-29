import React from 'react';

export enum SlideType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  HTML = 'HTML'
}

export interface SlideConfig {
  id: string;
  type: SlideType;
  content: string | React.ReactNode; // URL for image, Text for text, or Node
  title?: string; // Optional title for text slides
  dialogue: string;
  backgroundColor?: string;
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