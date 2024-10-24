'use client'

import { useState } from 'react'
import ItemCreationForm, { Item } from './ItemCreationForm'
import ResponsivePopup from './ResponsivePopup'

interface ItemCreationFormProps {
  onSave: (item: Item) => void
}

const ItemCreationPopup: React.FC<ItemCreationFormProps> = ({ onSave }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleSave = (item: Item) => {
    console.log('Saving item:', item)
    // Here you would typically save the item to your state or send it to an API
    onSave(item)
    setIsPopupOpen(false) // Close the popup after saving
  }

  const handleCancel = () => {
    setIsPopupOpen(false)
  }

  return (
    <ResponsivePopup
      triggerLabel="Criar Produto"
      title="Criar Produto"
      isOpen={isPopupOpen}
      handleOpen={() => {
        setIsPopupOpen(true)
      }}
      openOnChange={setIsPopupOpen}
    >
      <ItemCreationForm onSave={handleSave} onCancel={handleCancel} />
    </ResponsivePopup>
  )
}

export default ItemCreationPopup
