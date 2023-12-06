export type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | (object & string) // any other string

export interface PrimitiveProps {
  /**
   * Setting "asChild" to true has the same effect as setting "as" to "template".
   * @default false
   */
  asChild?: boolean
  /**
   * @default "div"
   */
  as?: AsTag
}
