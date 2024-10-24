'use client'

import { Combobox } from '@/components/Combobox'
import { createBrowserClient } from '@/utils/supabase'
import { useEffect, useState } from 'react'

interface ItemSearchProps {
  onSelect: (selectedOption: { value: string; label: string }) => void
}

export function ItemSearch({ onSelect }: ItemSearchProps) {
  const [items, setItems] = useState<{ value: string; label: string }[]>([])
  const supabase = createBrowserClient()

  // Fetch items from Supabase by name or id
  const fetchItems = async (query: string = '') => {
    let data, error

    // Check if the input is a number for id search
    if (!isNaN(Number(query)) && query.trim() !== '') {
      // Search by id if the query is numeric
      const { data: idData, error: idError } = await supabase
        .from('items')
        .select('id, name')
        .eq('id', query) // Search by exact id
        .limit(10)

      data = idData
      error = idError
    } else {
      // Search by name for non-numeric queries
      const { data: nameData, error: nameError } = await supabase
        .from('items')
        .select('id, name')
        .ilike('name', `%${query}%`) // Search by name with a case-insensitive match
        .limit(10)

      data = nameData
      error = nameError
    }

    if (error) {
      console.error('Error fetching items:', error)
      return
    }

    // Map data to match the Combobox format
    const formattedItems = data?.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }))
    setItems(formattedItems || [])
  }

  // Handle selection of an item
  const handleSelect = (selectedOption: { value: string; label: string }) => {
    console.log('Selected item ID:', selectedOption)
    onSelect(selectedOption)
  }

  // Handle typed input
  const handleInput = (inputValue: string) => {
    fetchItems(inputValue) // Fetch items based on the search query (by name or id)
  }

  // Initial load (fetch all items)
  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <Combobox
      options={items}
      placeholder="Search items by name or ID..."
      onSelect={handleSelect}
      onInput={handleInput}
    />
  )
}
