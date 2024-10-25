'use client'

import DatePicker from '@/components/DatePicker'
import { createBrowserClient } from '@/utils/supabase'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useEffect, useState } from 'react'

export default function SalesDashboard() {
  const [salesDataByItem, setSalesDataByItem] = useState<
    { item: string; total: number }[]
  >([])
  const [salesDataByCategory, setSalesDataByCategory] = useState<
    { id: string; label: string; value: number }[]
  >([])
  const [startDate, setStartDate] = useState(startOfMonth(new Date())) // Default: start of current month
  const [endDate, setEndDate] = useState(endOfMonth(new Date())) // Default: end of current month
  const [viewMode, setViewMode] = useState<'charts' | 'table'>('charts') // Toggle between charts and table view
  const supabase = createBrowserClient()

  // Call the PostgreSQL function for sales by item
  const getTotalSalesByItem = async (startDate: string, endDate: string) => {
    const { data, error } = await supabase.rpc('get_total_sales_by_name', {
      start_date: startDate,
      end_date: endDate,
    })

    if (error) {
      console.error('Error fetching total sales by item:', error)
      return []
    }

    return data
  }

  // Call the PostgreSQL function for sales by category
  const getTotalSalesByCategory = async (
    startDate: string,
    endDate: string,
  ) => {
    const { data, error } = await supabase.rpc(
      'get_total_sales_by_date_range',
      { start_date: startDate, end_date: endDate },
    )

    if (error) {
      console.error('Error fetching total sales by category:', error)
      return []
    }

    return data
  }

  // Fetch sales data by item
  useEffect(() => {
    const fetchSalesByItem = async () => {
      const data = await getTotalSalesByItem(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
      )
      const formattedData: { item: string; total: number }[] = data.map(
        (item: { name: string; total_sales: number }) => ({
          item: item.name,
          total: item.total_sales,
        }),
      )
      setSalesDataByItem(formattedData)
    }

    fetchSalesByItem()
  }, [startDate, endDate]) // Re-fetch when the date range changes

  // Fetch sales data by category
  useEffect(() => {
    const fetchSalesByCategory = async () => {
      const data = await getTotalSalesByCategory(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
      )
      const formattedData: { id: string; label: string; value: number }[] =
        data.map((category: { category: any; total_sales: any }) => ({
          id: category.category, // Use category as ID
          label: category.category, // Category label for the pie chart
          value: category.total_sales, // Total sales as value
        }))
      setSalesDataByCategory(formattedData)
    }

    fetchSalesByCategory()
  }, [startDate, endDate]) // Re-fetch when the date range changes

  return (
    <div className="mx-auto max-w-screen-xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Painel de Vendas</h1>

      {/* Date Picker */}
      <div className="mb-4 text-center">
        <h2 className="text-lg">Selecione o Período</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(startOfMonth(date))}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(endOfMonth(date))}
          />
        </div>
      </div>

      {/* Button to toggle between charts and tables */}
      <div className="mb-4 text-center">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          onClick={() =>
            setViewMode(viewMode === 'charts' ? 'table' : 'charts')
          }
        >
          {viewMode === 'charts' ? 'Ver em Tabelas' : 'Ver em Gráficos'}
        </button>
      </div>

      {/* Conditionally render either the charts or the table view */}
      {viewMode === 'charts' ? (
        <div className="grid grid-cols-1 gap-32 md:grid-cols-2">
          {/* Bar Chart for Total Sales by Item */}
          <div style={{ height: '30rem' }}>
            <h2 className="pb-2 text-center text-lg">Vendas Totais por Item</h2>
            <ResponsiveBar
              data={salesDataByItem}
              keys={['total']}
              indexBy="item"
              padding={0.3}
              margin={{ left: 100 }}
              layout="horizontal"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Vendas Totais',
                legendPosition: 'middle',
                legendOffset: -32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'items',
                legendPosition: 'middle',
                legendOffset: 60,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={true}
            />
          </div>

          {/* Pie Chart for Total Sales by Category */}
          <div style={{ height: '30rem' }}>
            <h2 className="pb-2 text-center text-lg">
              Vendas Totais por Categoria
            </h2>
            <ResponsivePie
              data={salesDataByCategory}
              innerRadius={0.5}
              padAngle={0.7}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              animate={true}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table View */}
          <h2 className="mb-2 mt-4 text-lg">Tabela de Vendas por Item</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Item</th>
                <th className="border border-gray-300 px-4 py-2">
                  Vendas Totais
                </th>
              </tr>
            </thead>
            <tbody>
              {salesDataByItem.map((item) => (
                <tr key={item.item} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.item}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mb-2 mt-4 text-lg">Tabela de Vendas por Categoria</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Categoria</th>
                <th className="border border-gray-300 px-4 py-2">
                  Vendas Totais
                </th>
              </tr>
            </thead>
            <tbody>
              {salesDataByCategory.map((category) => (
                <tr key={category.id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {category.label}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {category.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
