'use client'

import TransactionForm from '@/components/forms/transaction-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NewTransactionPage() {
  const router = useRouter()
  return (
    <div className="w-full max-w-none mx-auto my-2">
      {/* Header trên cùng */}
      <div className="flex items-center justify-between px-2 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-[#003C45]">GIAO DỊCH</h1>
        <Button
          type="button"
          variant="outline"
          className="border-[#003C45] bg-[#003C45] text-white hover:bg-[#E6F2F3] hover:text-[#003C45]"
          onClick={() => router.back()}
        >
          <span className="mr-2">←</span> Quay lại
        </Button>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <TransactionForm />
      </Suspense>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4 border rounded-lg p-6">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="pt-4 space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  )
}
