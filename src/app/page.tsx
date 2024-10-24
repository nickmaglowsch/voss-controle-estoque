'use client'

import { Item } from '@/components/ItemCreationForm'
import ItemCreationPopup from '@/components/ItemCreationPopup'
import { ItemsDataTable } from '@/components/ItemsDataTable'
import { createBrowserClient } from '@/utils/supabase'

export default async function Index() {
  const supabase = createBrowserClient()

  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-1 flex-col items-center gap-8 p-4">
      <h1 className="text-center text-2xl font-semibold">Cadastro de Itens</h1>
      <ItemCreationPopup
        onSave={async (item: Item) => {
          const { name, category } = item
          const { error } = await supabase
            .from('items')
            .insert({ name, category })
        }}
      />
      <ItemsDataTable />
    </div>
  )
}
