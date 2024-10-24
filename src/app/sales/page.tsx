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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Painel de Vendas</h1>

      {/* Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Selecione o Período</h2>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
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

      {/* Bar Chart for Total Sales by Item */}
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <h2>Vendas Totais por Item</h2>
        <ResponsiveBar
          data={salesDataByItem}
          keys={['total']}
          indexBy="item"
          margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Item',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Vendas Totais',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
        />
      </div>

      {/* Pie Chart for Total Sales by Category */}
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <h2>Vendas Totais por Categoria</h2>
        <ResponsivePie
          data={salesDataByCategory}
          margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          animate={true}
        />
      </div>
    </div>
  )
}
