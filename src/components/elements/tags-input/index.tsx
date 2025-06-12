import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

import { cn } from '@/utils/cn'

type Props = {
  rightNode?: ReactNode
  children?: ReactNode
} & ComponentPropsWithoutRef<'input'>

export const TagsInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, children, rightNode, ...rest } = props
  return (
    <div
      className={cn(
        'w-full rounded-10 border px-3 py-2',
        'inline-flex items-center gap-2 transition-all',
        'bg-white-0 has-[input:hover]:border-weak-50 has-[input:hover]:bg-weak-50 has-[input:focus-within]:border-strong-950 has-[input:focus-within]:shadow-buttons-important-focus shadow-regular-shadow-xs border border-stroke-soft-200',
        'disabled:border-weak-50 disabled:bg-weak-50 [&_path]:disabled::fill-disabled-300',
        className
      )}
    >
      <div className="flex flex-1 flex-col items-start gap-1.5">
        {children}
        <input
          {...rest}
          ref={ref}
          className="w-full flex-1 border-none bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400 focus:placeholder:text-text-strong-950 disabled:text-text-disabled-300 disabled:placeholder:text-text-disabled-300 group-hover:enabled:placeholder:text-text-sub-600"
        />
      </div>
      {rightNode && <div className="inline-flex shrink-0">{rightNode}</div>}
    </div>
  )
})

TagsInput.displayName = 'TagsInput'

export const TagsInputLoader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'bg-loading-gray box-content h-10 w-full animate-pulse rounded-10 border border-transparent text-paragraph-sm',
        className
      )}
    />
  )
}
