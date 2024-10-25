'use client'
import { createBrowserClient } from '@/utils/supabase'
import { useEffect, useState } from 'react'

interface StockItem {
  item_id: number
  name: string
  quantity_in_stock: number
  average_price: number
}

export default function Stock() {
  const supabase = createBrowserClient()
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchItemsInStock = async () => {
      const { data, error } = await supabase.rpc('get_items_in_stock')

      if (error) {
        console.error('Error fetching items in stock:', error)
      } else {
        setItems(data || [])
      }

      setLoading(false)
    }

    fetchItemsInStock()
  }, [])

  if (loading) {
    return <div className="mt-10 text-center">Carregando estoque...</div>
  }

  if (items.length === 0) {
    return <div className="mt-10 text-center">Nenhum item em estoque</div>
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-center text-lg font-semibold">
        Estoque Disponível
      </h1>

      {/* Table for larger screens */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-4 text-left">Item</th>
              <th className="border border-gray-300 p-4 text-left">
                Quantidade em estoque
              </th>
              <th className="border border-gray-300 p-4 text-left">
                Preço médio
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id}>
                <td className="border border-gray-300 p-4">{item.name}</td>
                <td className="border border-gray-300 p-4">
                  {item.quantity_in_stock}
                </td>
                <td className="border border-gray-300 p-4">
                  R${item.average_price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="block w-full space-y-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.item_id}
            className="rounded-lg border bg-white p-4 shadow-md"
          >
            <div className="text-lg font-bold">{item.name}</div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Quantidade em estoque: </span>
              {item.quantity_in_stock}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Preço médio: </span>
              R${item.average_price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
