"use client"
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FaTruckFast, FaShieldHalved, FaHeadset, FaFacebook, FaRightToBracket } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { loginAction } from '../auth.actions'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  keepSignedIn: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginForm>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false
    }
  })

  const { handleSubmit, control } = form

  async function mySubmit(data: LoginForm) {
    setServerError("")
    setLoading(true)

    const res = await loginAction({
      email: data.email,
      password: data.password,
      keepSignedIn: data.keepSignedIn
    })

    if (res.success) {
      if (res.token) {
        localStorage.setItem("userToken", res.token)
        localStorage.setItem("userEmail", data.email)
        window.dispatchEvent(new Event("auth-change"))
      }
      toast.success("Welcome back! Signed in successfully")
      router.push("/")
      router.refresh()
    } else {
      const errorMsg = res.message || "Incorrect email or password"
      setServerError(errorMsg)
      toast.error(errorMsg)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <div className="hidden lg:flex flex-col items-center text-center">
          <div className="w-full max-w-140 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.08)] mb-8 bg-white">
            <img
              src="/auth-groceries.png"
              alt="FreshCart Groceries"
              className="w-full h-90 object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 leading-snug mb-3 max-w-lg">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h1>
          <p className="text-base text-gray-500 mb-6 max-w-lg leading-relaxed">
            Join thousands of happy customers who trust FreshCart for their daily grocery needs
          </p>

          <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <FaTruckFast className="text-[#16a34a] text-base" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldHalved className="text-[#16a34a] text-base" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeadset className="text-[#16a34a] text-base" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-11 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 max-w-135 w-full mx-auto">
          <div className="text-center mb-7">
            <h2 className="text-3xl font-bold text-[#16a34a] mb-2">FreshCart</h2>
            <h3 className="text-2xl font-bold text-gray-800 mb-1.5">Welcome Back!</h3>
            <p className="text-sm text-gray-500">Sign in to continue your fresh shopping experience</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full h-12 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
            <button
              type="button"
              className="w-full h-12 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <FaFacebook className="text-xl text-[#1877F2]" /> Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
              or continue with email
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit(mySubmit)} className="space-y-5">

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full h-12 px-4 rounded-lg border text-base bg-white outline-none transition ${
                      fieldState.invalid
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[#16a34a]"
                    }`}
                  />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm font-medium text-[#16a34a] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full h-12 px-4 rounded-lg border text-base bg-white outline-none transition ${
                      fieldState.invalid
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[#16a34a]"
                    }`}
                  />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="keepSignedIn"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id="keepSignedIn"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#16a34a] cursor-pointer"
                  />
                  <label htmlFor="keepSignedIn" className="text-sm text-gray-600 cursor-pointer">
                    Keep me signed in
                  </label>
                </div>
              )}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-base font-semibold flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-60 mt-2"
            >
              <FaRightToBracket /> {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="border-t border-gray-100 pt-6 mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to FreshCart?{" "}
                <Link href="/register" className="text-[#16a34a] font-semibold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}