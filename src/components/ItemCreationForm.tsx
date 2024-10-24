import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

export interface Item {
  name: string
  category: string
}

interface ItemCreationFormProps {
  onSave: (item: Item) => void
  onCancel: () => void
  item?: Item
}

const ItemCreationForm: React.FC<ItemCreationFormProps> = ({
  onSave,
  onCancel,
  item,
}) => {
  const [itemName, setItemName] = useState(item?.name || '')
  const [itemCategory, setItemCategory] = useState(item?.category || '')

  const handleSave = (closeAfterSave: boolean) => {
    if (itemName.trim() && itemCategory.trim()) {
      onSave({ name: itemName, category: itemCategory })
      if (!closeAfterSave) {
        setItemName('')
        setItemCategory('')
      }
    } else {
      alert('Preencha ambos os dados')
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <Label htmlFor="itemName">Nome do Produto</Label>
        <Input
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Escreva o nome"
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="itemCategory">Categoria</Label>
        <Input
          id="itemCategory"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
          placeholder="Escreva categoria"
          className="w-full"
        />
      </div>
      <div className="flex space-x-2">
        <div className="flex flex-1 flex-col space-y-2">
          <Button onClick={() => handleSave(true)} className="w-full">
            Salvar & Fechar
          </Button>
          {!item && (
            <Button onClick={() => handleSave(false)} className="w-full">
              Salvar & Novo
            </Button>
          )}
        </div>
        <Button onClick={onCancel} variant="outline" className="flex-shrink-0">
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ItemCreationForm
