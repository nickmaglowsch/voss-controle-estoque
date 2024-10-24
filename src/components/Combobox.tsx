'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/tailwind'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

interface ComboboxProps {
  options: Array<{ value: string; label: string }>
  placeholder?: string
  onSelect: (selectedOption: { value: string; label: string }) => void
  onInput?: (inputValue: string) => void
  buttonClassName?: string
  inputPlaceholder?: string
  selected?: string
}

export function Combobox({
  options,
  placeholder = 'Select option...',
  onSelect,
  onInput,
  buttonClassName = 'w-[300px] justify-between',
  inputPlaceholder = 'Search...',
  selected = '',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(selected)

  const handleSelect = (value: { value: string; label: string }) => {
    const newValue = value.value === selectedValue ? '' : value.value
    setSelectedValue(newValue)
    setOpen(false)
    onSelect(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(buttonClassName)}
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={inputPlaceholder}
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value)
              onInput?.(value)
            }}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option)} // Ensure the value is passed correctly
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === option.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
