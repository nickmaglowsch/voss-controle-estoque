'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserClient } from '@/utils/supabase'
import { useEffect, useState } from 'react'

interface ItemStock {
  item_id: number
  name: string
  quantity_in_stock: number
  average_price: number
}

interface ItemStockCardViewProps {
  itemId: number
  addToCart: (
    id: number,
    name: string,
    quantity: number,
    price: number,
    type: string,
  ) => void
  itemName: string
}

export function ItemStockCardView({
  itemId,
  addToCart,
  itemName,
}: ItemStockCardViewProps) {
  const [itemStock, setItemStock] = useState<ItemStock | null>(null)
  const supabase = createBrowserClient()
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')
  const [operationType, setOperationType] = useState('sell') // Default to 'sell'
  const [errorMessages, setErrorMessages] = useState({
    quantity: '',
    price: '',
  })

  // Fetch item stock information from Supabase using the function
  const fetchItemStock = async () => {
    const { data, error } = await supabase
      .rpc('get_item_stock_by_id', { searchid: itemId }) // Call the RPC function
      .single() // Fetch a single result

    if (error) {
      console.error('Error fetching item stock:', error)
      return
    }

    setItemStock(data as ItemStock)
  }

  useEffect(() => {
    fetchItemStock()
  }, [itemId]) // Fetch stock info when itemId changes

  if (!itemStock) {
    return <div>carregando...</div> // Loading state
  }

  // Validate inputs
  const validateInputs = () => {
    const errors = { quantity: '', price: '' }
    let valid = true

    // Check quantity
    if (quantity < 1) {
      errors.quantity = 'A quantidade deve ser pelo menos 1.'
      valid = false
    } else if (
      operationType === 'sell' &&
      quantity > itemStock.quantity_in_stock
    ) {
      errors.quantity = `Quantidade disponível: ${itemStock.quantity_in_stock}.`
      valid = false
    }

    // Check price
    if (parseFloat(price) <= 0) {
      errors.price = 'O preço deve ser maior que zero.'
      valid = false
    }

    setErrorMessages(errors)
    return valid
  }

  // Remove leading zeros from quantity
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+(?!$)/, '') // Remove leading zeros
    setQuantity(Number(value) || 1) // Default to 1 if input is empty or invalid
  }

  // Handle price change and allow decimal values
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Regular expression to allow only numbers and up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/

    if (value === '' || regex.test(value)) {
      setPrice(value)
    }
  }

  // Handle Add to Cart button click
  const handleAddToCart = () => {
    if (validateInputs()) {
      addToCart(itemId, itemName, quantity, parseFloat(price), operationType)
    }
  }

  // Disable button conditionally
  const isButtonDisabled =
    parseFloat(price) <= 0 ||
    quantity < 1 ||
    (operationType === 'sell' && quantity > itemStock.quantity_in_stock)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{itemStock.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Quantidade em estoque:</strong> {itemStock.quantity_in_stock}
        </p>
        <p>
          <strong>Preço médio:</strong> R${' '}
          {(itemStock.average_price / 100).toFixed(2)}
        </p>

        {/* Operation type select */}
        <div className="mt-4 flex w-full flex-col">
          <label htmlFor="operationType" className="mb-1">
            Tipo da Operação
          </label>
          <select
            id="operationType"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="rounded border p-2"
          >
            <option value="sell">Venda</option>
            <option value="buy">Compra</option>
          </select>
        </div>

        {/* Quantity and price inputs with labels */}
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="quantity" className="mb-1">
              Quantidade
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              placeholder="Quantidade"
              value={quantity}
              onChange={handleQuantityChange}
              className={`w-full rounded border p-2 ${
                errorMessages.quantity ? 'border-red-500' : ''
              }`}
            />
            {errorMessages.quantity && (
              <p className="text-sm text-red-500">{errorMessages.quantity}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-1">
              Preço
            </label>
            <input
              id="price"
              type="text" // Text input to handle custom decimal validation
              placeholder="Preço"
              value={price}
              onChange={handlePriceChange}
              className={`w-full rounded border p-2 ${
                errorMessages.price ? 'border-red-500' : ''
              }`}
            />
            {errorMessages.price && (
              <p className="text-sm text-red-500">{errorMessages.price}</p>
            )}
          </div>
        </div>

        {/* Button to add item to cart */}
        <button
          disabled={isButtonDisabled}
          onClick={handleAddToCart}
          className={`mt-4 w-full rounded p-2 text-white ${
            isButtonDisabled
              ? 'cursor-not-allowed bg-gray-400' // Gray-out and disable click if disabled
              : 'cursor-pointer bg-blue-500' // Normal button style
          }`}
        >
          Adicionar ao Carrinho
        </button>
      </CardContent>
    </Card>
  )
}
