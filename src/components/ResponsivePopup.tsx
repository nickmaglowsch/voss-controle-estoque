import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'

interface ResponsivePopupProps {
  children: ReactNode
  triggerLabel: string
  title?: string
  isOpen: boolean
  handleOpen: () => void
  openOnChange: Dispatch<SetStateAction<boolean>>
}

const ResponsivePopup: React.FC<ResponsivePopupProps> = ({
  children,
  triggerLabel,
  title = 'Popup',
  isOpen,
  handleOpen,
  openOnChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={openOnChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[100vh] w-full sm:h-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default ResponsivePopup
