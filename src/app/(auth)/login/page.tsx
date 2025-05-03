'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginFormValues, loginSchema } from '@/types/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, action: 'login' }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 min-h-screen bg-cover bg-center">
      {/* Left panel */}
      <div className="flex min-h-screen relative items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-10 gap-8">
          <img src="/images/logo_white.png" alt="Finotiq Logo" className="absolute top-12 left-8 bot-10 z-30 h-80 w-auto" />
          <div className="text-white space-y-10 text-left">
            <h1 className="text-5xl font-extrabold">Ghi nhanh - Chi đúng</h1>
            <p className="text-xl max-w-xl">
              Finotiq giúp bạn theo dõi chi tiêu hằng ngày một cách dễ dàng, trực quan và thông minh. Ghi chú nhanh – Chi tiêu hợp lý – Báo cáo trực quan.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[40%] h-9/10 bg-white rounded-t-2xl flex items-center justify-center px-6 absolute bottom-0 left-[50%]">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-teal-900">Đăng nhập</h1>
            <p className="text-gray-500">Dùng tài khoản đã đăng ký để đăng nhập vào hệ thống</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">Email</Label>
              <Input id="email" placeholder="example@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">Mật khẩu</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button className="w-full bg-[#003C45] hover:bg-[#00262c] text-[#F4FAB9] font-bold border-none" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-[#F4FAB9]">Đang đăng nhập...</span>
                </>
              ) : (
                <span className="text-[#F4FAB9]">Đăng nhập</span>
              )}
            </Button>
          </form>
          <div className="text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="underline font-bold text-[#003C45]">
              ĐĂNG KÝ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
