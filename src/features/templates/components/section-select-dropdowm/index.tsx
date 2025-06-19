'use client'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import { cn } from '@/utils/cn'
import { RiArrowDownSLine } from '@remixicon/react'
import { useState } from 'react'

interface SectionOption {
  id: string
  label: string
  value: string
}

interface SectionSelectDropdownProps {
  options: SectionOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  defaultValue?: string
}

export const SectionSelectDropdown = ({
  options,
  value,
  onValueChange,
  placeholder = 'セクションを選択してください',
  className,
  defaultValue,
}: SectionSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dropdown.Trigger asChild className="justify-between">
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="medium"
          className={className}
        >
          {selectedOption
            ? selectedOption.label
            : (defaultValue ?? placeholder)}
          <Button.Icon>
            <RiArrowDownSLine
              className={cn(
                'transition-transform duration-200',
                isOpen ? 'rotate-180' : ''
              )}
            />
          </Button.Icon>
        </Button.Root>
      </Dropdown.Trigger>

      <Dropdown.Content align="start">
        <Dropdown.Group>
          {options.map((option) => (
            <Dropdown.Item
              key={option.id}
              onSelect={() => handleSelect(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
