'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestSupabaseConnection() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Kiểm tra danh sách bảng
        const { data: tables, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')

        if (tablesError) {
          console.error('❌ Error fetching tables:', tablesError)
        }

        // Lấy danh sách transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .limit(5)

        if (transactionsError) {
          console.error('❌ Error fetching transactions:', transactionsError)
          setError(transactionsError.message)
        } else {
          setData(transactions)
        }

        // Kiểm tra schema của bảng transactions
        const { data: schema, error: schemaError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type')
          .eq('table_name', 'transactions')

        if (schemaError) {
          console.error('❌ Error fetching schema:', schemaError)
        }

      } catch (err) {
        console.error('❌ Error testing connection:', err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return <div className="p-4">Đang kiểm tra kết nối...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-xl font-bold mb-2">❌ Lỗi kết nối</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">✅ Kết nối thành công!</h2>
      <h3 className="text-lg font-semibold mb-2">5 giao dịch gần nhất:</h3>
      <div className="space-y-4">
        {data.map((transaction) => (
          <div key={transaction.id} className="border p-4 rounded-lg">
            <p><strong>ID:</strong> {transaction.id}</p>
            <p><strong>Số tiền:</strong> {transaction.amount}</p>
            <p><strong>Loại:</strong> {transaction.type}</p>
            <p><strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><strong>Mô tả:</strong> {transaction.description || 'Không có'}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 