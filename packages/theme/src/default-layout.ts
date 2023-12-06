import type { LayoutTheme } from './types'

export const defaultLayout: LayoutTheme = {
  spacingUnit: 4,
  disabledOpacity: '.5',
  dividerWeight: '1px',
  fontSize: {
    title: '1.125rem',
    mainBody: '0.9375rem',
    desc: '0.8125rem',
    tiny: '0.6875rem',
  },
  lineHeight: {
    title: '1.125rem',
    mainBody: '0.9375rem',
    desc: '0.8125rem',
    tiny: '0.6875rem',
  },
  radius: {
    small: '0.125rem',
    medium: '0.375rem',
    large: '0.5rem',
  },
  borderWidth: {
    small: '1px',
    medium: '2px',
    large: '3px',
  },
  boxShadow: {
    small:
      '0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
    medium:
      '0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
    large:
      '0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
  },
}
export const defaultYLLayout: LayoutTheme = {
  spacingUnit: 4,
  disabledOpacity: '.5',
  dividerWeight: '1px',
  fontSize: {
    title: '0.34rem',
    mainBody: '0.3rem',
    desc: '0.26rem',
    tiny: '0.22rem',
  },
  lineHeight: {
    title: '0.34rem',
    mainBody: '0.3rem',
    desc: '0.26rem',
    tiny: '0.22rem',
  },
  radius: {
    small: '0.04rem',
    medium: '0.12rem',
    large: '0.16rem',
  },
  borderWidth: {
    small: '1px',
    medium: '2px',
    large: '3px',
  },
  boxShadow: {
    small:
      '0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
    medium:
      '0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
    large:
      '0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
  },
}

export const lightLayout: LayoutTheme = {
  hoverOpacity: '.8',
}

export const darkLayout: LayoutTheme = {
  hoverOpacity: '.9',
  boxShadow: {
    small:
      '0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
    medium:
      '0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
    large:
      '0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
  },
}
