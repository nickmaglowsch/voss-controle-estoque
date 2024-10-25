'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/tailwind'
import { useEffect } from 'react'

interface DatePickerProps {
  onChange: (item: Date) => void
  selected: Date
}

const DatePicker: React.FC<DatePickerProps> = ({ onChange, selected }) => {
  const [date, setDate] = React.useState<Date>(selected)

  useEffect(() => {
    onChange(date || selected)
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || selected}
          onSelect={(value) => setDate(value || selected)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
