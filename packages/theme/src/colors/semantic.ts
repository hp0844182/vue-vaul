// import { readableColor } from 'color2k'
import type { SemanticBaseColors, ThemeColors } from './types'

const base: SemanticBaseColors = {
  light: {
    primary: '#1675FA',
    text: '#222222',
    secondary: '#8C8C8C',
    light: '#B3B3B3',
    tertiary: '#CCCCCC',
    link: '#2E71E6',
    background: {
      'page': '#F3F3F5',
      'gray-tab': '#F7F8FA',
      'blue-tab': '#E6EFFF',
      'list': '#FFFFFF',
      'list-active': '#E6E6E6',
    },
    divider: '#E6E6E6',
    error: '#FF3526',
    warn: '#FD6C3B',
    normal: '#4484FB',
    succuss: '#00B577',
  },
  dark: {
    primary: '#1675FA',
    text: '#222222',
    secondary: '#8C8C8C',
    light: '#B3B3B3',
    tertiary: '#CCCCCC',
    link: '#2E71E6',
    background: {
      'page': '#F3F3F5',
      'gray-tab': '#F7F8FA',
      'blue-tab': '#E6EFFF',
      'list': '#FFFFFF',
      'list-active': '#E6E6E6',
    },
    divider: '#E6E6E6',
    error: '#FF3526',
    warn: '#FD6C3B',
    normal: '#4484FB',
    succuss: '#00B577',
  },
}

export const themeColorsLight: ThemeColors = base.light

export const themeColorsDark: ThemeColors = base.dark

export const semanticColors = {
  light: themeColorsLight,
  dark: themeColorsDark,
}
