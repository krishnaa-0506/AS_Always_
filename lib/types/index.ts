export interface TemplateLayout {
  structure: string;
  padding?: string;
  borderRadius?: string;
  background?: string;
}

export interface Template {
  id: string;
  name: string;
  layouts: TemplateLayout[];
}

export interface Memory {
  id: string;
  type: 'image' | 'video' | 'audio';
  content: string;
  caption?: string;
  filename?: string;
  url?: string;
}

export interface Screen {
  messageId: string;
  screenIndex: number;
  content: string;
  background: string;
  animation: string;
  duration: number;
  emotion: string;
  createdAt: Date;
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
}

export type ThemeId = 'sunset-romance' | 'ocean-serenity' | 'golden-memories';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}
