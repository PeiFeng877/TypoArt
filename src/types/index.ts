export type FontSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
export type TextAlign = "left" | "center" | "right";
export type AspectRatio = "auto" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

export interface CardPage {
  id: string;
  icon: string;
  date: string;
  title: string;
  body: string;
  author: string;
}

export interface CardStyle {
  // Template
  templateId: string;
  // Background
  background: string; // CSS gradient or color
  backgroundAngle: number;
  // Container
  width: number;
  aspectRatio: AspectRatio;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  // Text
  titleSize: FontSize;
  bodySize: FontSize;
  bodyAlign: TextAlign;
  lineHeight: number;
  // Visibility
  showIcon: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showWatermark: boolean;
}

export interface CardState {
  pages: CardPage[];
  currentPageIndex: number;
  style: CardStyle;
}

export interface Template {
  id: string;
  name: string;
  preview: string; // CSS class or gradient
  defaultStyle: Partial<CardStyle>;
}

export const FONT_SIZES: Record<FontSize, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
};
