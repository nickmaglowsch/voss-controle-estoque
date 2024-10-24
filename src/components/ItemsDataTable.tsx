'use client'

import { createBrowserClient } from '@/utils/supabase'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import ItemCreationForm from './ItemCreationForm'
import ResponsivePopup from './ResponsivePopup'
import { DataTable } from './ui/data-table'

// Define the shape of your item data
interface Item {
  id: string
  name: string
  category: string
  // Add any other fields from your items table
}

// Define your columns
const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  // Add more columns as needed
]

export function ItemsDataTable() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createBrowserClient()

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              setEditingItem(row.original)
              setIsDialogOpen(true)
            }}
          >
            {row.getValue('name')}
          </div>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsDialogOpen(true)
            }}
          >
            {row.getValue('category')}
          </div>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Editar',
      cell: ({ row }) => {
        return (
          <ResponsivePopup
            triggerLabel="editar"
            title="editar"
            isOpen={isDialogOpen}
            handleOpen={() => {
              setEditingItem(row.original)
              setIsDialogOpen(true)
            }}
            openOnChange={setIsDialogOpen}
          >
            <ItemCreationForm
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
              item={{
                name: editingItem?.name || '',
                category: editingItem?.category || '',
              }}
            />
          </ResponsivePopup>
        )
      },
    },
    // Add more columns as needed
  ]

  useEffect(() => {
    async function fetchItems() {
      setLoading(true)
      const { data, error } = await supabase.from('items').select('*')

      if (error) {
        setError('Could not fetch items')
        console.error('Error fetching items:', error)
      } else {
        setItems(data)
      }
      setLoading(false)
    }

    fetchItems()

    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
        },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT') {
            setItems((prevItems) => [...prevItems, payload.new as Item])
          } else if (payload.eventType === 'UPDATE') {
            setItems((prevItems) =>
              prevItems.map((item) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item,
              ),
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prevItems) =>
              prevItems.filter((item) => item.id !== payload.old.id),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleSave = async () => {
    if (!editingItem) return

    const { error } = await supabase
      .from('items')
      .update({ name: editingItem.name, category: editingItem.category })
      .eq('id', editingItem.id)

    if (error) {
      console.error('Error updating item:', error)
      // Handle error (e.g., show error message to user)
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? editingItem : item,
        ),
      )
      setIsDialogOpen(false)
      setEditingItem(null)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <DataTable columns={columns} data={items} />
}
