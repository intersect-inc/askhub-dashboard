import { cn } from '@/utils/cn'
import { ComponentPropsWithoutRef } from 'react'

type Size = 'lg' | 'md' | '2xl'
type kStyle = 'stroke' | 'lighter'
type Color = 'gray'

export type KeyIconsProps = {
  size: Size
  kStyle: kStyle
  color: Color
}

const getColorStyle = (style: kStyle, color: Color) => {
  switch (style) {
    case 'stroke':
      switch (color) {
        case 'gray':
          return cn(
            'shadow-regular-shadow-xs border-stroke-soft-200 text-text-sub-600'
          )
        default:
          color satisfies never
          return ''
      }
    case 'lighter':
      switch (color) {
        case 'gray':
          return cn('border-weak-50 bg-weak-50 shadow-regular-shadow-xs')
        default:
          color satisfies never
          return ''
      }
    default:
      style satisfies never
      return ''
  }
}

const SIZE_STYLES = {
  lg: 'size-12',
  md: 'size-10',
  '2xl': 'size-16',
} satisfies Record<Size, string>

export const KeyIcons = (
  props: KeyIconsProps & ComponentPropsWithoutRef<'span'>
) => {
  const { children, size, kStyle, color, className, ...rest } = props
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border',
        getColorStyle(kStyle, color),
        SIZE_STYLES[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export const KeyIconsLoader = ({
  size,
  className,
}: {
  size: Size
  className?: string
}) => {
  return (
    <span
      className={cn(
        'inline-block animate-pulse rounded-full',
        SIZE_STYLES[size],
        className
      )}
    />
  )
}
