import { KeyIcons } from '@/components/ui/key-icons'

type PageHeaderProps = {
  title: string
  description: string
  leftIcon?: React.ReactNode
  children?: React.ReactNode
}

export const PageHeader = ({
  title,
  description,
  leftIcon,
  children,
}: PageHeaderProps) => {
  return (
    <div className="mx-8 flex items-center justify-between gap-3 border-b border-stroke-soft-200 py-5">
      <div className="flex items-center gap-3">
        {leftIcon && (
          <KeyIcons size="lg" kStyle="stroke" color="gray">
            {leftIcon}
          </KeyIcons>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-label-md text-text-strong-950">{title}</h1>
          <p className="text-paragraph-sm text-text-sub-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
