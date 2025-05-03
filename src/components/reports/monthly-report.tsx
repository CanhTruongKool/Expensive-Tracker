'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface MonthlyData {
  summary: {
    income: number
    expense: number
    balance: number
  }
  expenseByCategory: Array<{
    categoryId: string
    name: string
    color: string
    amount: number
    percentage: number
  }>
  budgets: Array<{
    id: string
    categoryId: string
    categoryName: string
    color: string
    budgetAmount: number
    spentAmount: number
    percentage: number
    remaining: number
  }>
}

export default function MonthlyReport() {
  const [data, setData] = useState<MonthlyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch monthly report data')
        }

        setData(result.data)
      } catch (err) {
        console.error('Error fetching monthly report data:', err)
        setError('Không thể tải dữ liệu báo cáo tháng')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Đang tải dữ liệu...</div>
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003C45]">Thu nhập</CardTitle>
            <CardDescription className="italic">Tổng thu nhập tháng này</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(data.summary.income)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#003C45]">Chi tiêu</CardTitle>
            <CardDescription className="italic">Tổng chi tiêu tháng này</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.summary.expense)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#003C45]">Số dư</CardTitle>
            <CardDescription className="italic">Số dư cuối tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#003C45]">{formatCurrency(data.summary.balance)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003C45]">Chi tiêu theo danh mục</CardTitle>
            <CardDescription className="italic">Phân bổ chi tiêu tháng này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.expenseByCategory.map((category) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span>{category.name}</span>
                  </div>
                  <span>{formatCurrency(category.amount)}</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#003C45]">Ngân sách</CardTitle>
            <CardDescription className="italic">Theo dõi ngân sách tháng này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }} />
                    <span>{budget.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(budget.spentAmount)} / {formatCurrency(budget.budgetAmount)}</div>
                    <div className="text-xs text-muted-foreground">Còn lại: {formatCurrency(budget.remaining)}</div>
                  </div>
                </div>
                <Progress value={budget.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
