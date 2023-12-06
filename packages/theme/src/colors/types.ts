export type ColorScale =
  // | Partial<{
  //   50: string
  //   100: string
  //   200: string
  //   300: string
  //   400: string
  //   500: string
  //   600: string
  //   700: string
  //   800: string
  //   900: string
  //   foreground: string
  //   DEFAULT: string
  // }>
  | string

export interface BaseColors {
  primary: ColorScale
  text: ColorScale
  secondary: ColorScale
  light: ColorScale
  tertiary: ColorScale
  link: ColorScale
  background: {
    'page': string
    'gray-tab': string
    'blue-tab': string
    'list': string
    'list-active': string
  }
  divider: ColorScale
  error: ColorScale
  warn: ColorScale
  normal: ColorScale
  succuss: ColorScale
}

export type ThemeColors = BaseColors

export interface SemanticBaseColors {
  light: BaseColors
  dark: BaseColors
}
