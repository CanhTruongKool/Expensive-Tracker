'use client'

import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionWithCategory } from '@/types/index'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DashboardData {
  recentTransactions: TransactionWithCategory[]
}

export default function RecentTransactions() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard')

        if (!response.ok) {
          setError('Không thể tải dữ liệu giao dịch gần đây')
          return
        }

        const result = await response.json()

        if (!result.success) {
          setError(result.error || 'Không thể tải dữ liệu giao dịch gần đây')
          return
        }

        setData(result.data)
      } catch (err) {
        setError('Không thể tải dữ liệu giao dịch gần đây')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return null
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return null
  }

  const { recentTransactions } = data

  if (recentTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground mb-4">Bạn chưa có giao dịch nào. Hãy bắt đầu theo dõi chi tiêu của bạn.</p>
        <Button asChild>
          <Link href="/transactions/new">Thêm giao dịch đầu tiên</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-[#003C45] uppercase">Nội dung</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-[#003C45] uppercase">Loại</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-[#003C45] uppercase">Ngày</th>
            <th className="px-4 py-2 text-right text-xs font-bold text-[#003C45] uppercase">Giá trị</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {recentTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-2 whitespace-nowrap">
                <Link href={`/transactions/${transaction.id}`} className="font-medium text-[#003C45] hover:underline text-sm">
                  {transaction.description || transaction.category.name}
                </Link>
              </td>
              <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                {transaction.type === 'income' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className="text-[#003C45] text-sm">{transaction.category.name}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(new Date(transaction.date))}
              </td>
              <td className={`px-4 py-2 whitespace-nowrap text-right font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Button asChild variant="outline">
          <Link href="/transactions">Xem tất cả giao dịch</Link>
        </Button>
      </div>
    </div>
  )
}
