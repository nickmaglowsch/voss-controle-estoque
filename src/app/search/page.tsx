'use client'
import { ItemSearch } from '@/components/ItemSearch'
import { ItemStockCardView } from '@/components/ItemStockCardView'
import { createBrowserClient } from '@/utils/supabase'
import * as React from 'react'

// Item interface to represent a cart item
interface CartItem {
  id: number
  name: string
  quantity: number
  price: number
  type: string // New field to track "sell" or "buy"
}

export default function Search() {
  const [inputValue, setInputValue] = React.useState<{
    id: number
    name: string
  }>({ id: 0, name: '' })

  const [cart, setCart] = React.useState<CartItem[]>([])
  const supabase = createBrowserClient()
  // Function to add an item to the cart
  const addToCart = (
    id: number,
    name: string,
    quantity: number,
    price: number,
    type: string,
  ) => {
    setCart((prevCart) => [...prevCart, { id, name, quantity, price, type }])
  }

  // Function to remove an item from the cart
  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index))
  }

  // Function to handle saving the cart
  const saveCart = async () => {
    const transactions = cart.map((item) => ({
      item_id: item.id,
      transaction_type: item.type,
      quantity: item.quantity,
      price: item.price * 100, // Multiply price by 100
    }))

    const { error } = await supabase.from('transactions').insert(transactions)

    if (error) {
      console.error('Error saving cart:', error)
    } else {
      console.log('Cart saved:', transactions)
      // Clear the cart after saving if needed
      setCart([])
      setInputValue({ id: 0, name: '' })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-center text-lg font-semibold">
        Achar item por nome ou id
      </h1>

      {/* Search and select item */}
      <ItemSearch
        onSelect={(v) => setInputValue({ id: Number(v.value), name: v.label })}
      />

      {/* Display selected item */}
      <ItemStockCardView
        itemId={inputValue.id}
        itemName={inputValue.name}
        addToCart={addToCart}
      />

      {/* Display the shopping cart */}
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-center text-lg font-semibold">
          Carrinho de Compras
        </h2>
        {cart.length === 0 ? (
          <p className="text-center">Carrinho vazio</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col rounded-lg border p-4 ${
                  item.type === 'sell' ? 'bg-red-100' : 'bg-green-100'
                }`} // Set card color based on type
              >
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-sm">
                  Quantidade: {item.quantity} x R$ {item.price.toFixed(2)}
                </span>
                <span className="text-sm">
                  Total: R$ {(item.quantity * item.price).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="mt-2 rounded bg-red-500 px-2 py-1 text-xs text-white"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={saveCart}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Salvar Carrinho
        </button>
      )}
    </div>
  )
}
