"use client"
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FaStar, FaTruckFast, FaShieldHalved, FaUserPlus, FaFacebook, FaUser } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Must be at least 8 characters")
    .regex(/\d/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),

  rePassword: z
    .string()
    .min(1, "Please confirm your password"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),

  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms to continue",
    }),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm<RegisterForm>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false
    }
  })

  const { handleSubmit, control, watch } = form

  const password = watch("password") || ""
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const strengthLabel = password === "" ? "Weak" : ["Weak", "Weak", "Fair", "Good", "Strong"][score]
  const strengthColor = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-600"][score]

  async function mySubmit(data: RegisterForm) {
    setServerError("")
    setLoading(true)
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          rePassword: data.rePassword,
          phone: data.phone
        })
      })
      const result = await res.json()

      if (res.ok) {
        toast.success("Account created successfully! Please sign in")
        router.push("/login")
      } else {
        const errorMsg = result.message || "Something went wrong, try again"
        setServerError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMsg = "Network error, check your connection"
      setServerError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (invalid: boolean) =>
    `h-11 text-sm ${invalid ? "border-red-500" : "border-gray-200 focus-visible:border-green-600"}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        <div className="hidden lg:block">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome to <span className="text-green-600">FreshCart</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-green-200 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <FaStar className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Premium Quality</h3>
                <p className="text-base text-gray-700">Premium quality products sourced from trusted suppliers.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-green-200 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <FaTruckFast className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Fast Delivery</h3>
                <p className="text-base text-gray-700">Same-day delivery available in most areas</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-green-200 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <FaShieldHalved className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Secure Shopping</h3>
                <p className="text-base text-gray-700">Your data and payments are completely secure</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h4 className="text-base text-gray-800">Sarah Johnson</h4>
                <div className="flex gap-0.5 text-yellow-400 text-base mt-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
            </div>
            <p className="text-base italic text-gray-600">
              "FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!"
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mt-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-base text-gray-700">Start your fresh journey with us today</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 h-11 text-base font-medium bg-white">
              <FcGoogle className="text-xl" /> Google
            </Button>
            <Button type="button" variant="outline" className="flex-1 h-11 text-base font-medium bg-white">
              <FaFacebook className="text-xl text-blue-600" /> Facebook
            </Button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-base text-gray-700">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit(mySubmit)} className="space-y-5">

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {serverError}
              </div>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm text-gray-800">Name<span className="text-gray-400">*</span></Label>
                  <Input {...field} id="name" placeholder="Ali" className={inputClass(fieldState.invalid)} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm text-gray-800">Email<span className="text-gray-400">*</span></Label>
                  <Input {...field} id="email" type="email" placeholder="ali@example.com" className={inputClass(fieldState.invalid)} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-sm text-gray-800">Password<span className="text-gray-400">*</span></Label>
                  <Input {...field} id="password" type="password" placeholder="create a strong password" className={inputClass(fieldState.invalid)} />
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${strengthColor}`}
                        style={{ width: `${(score / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 w-12 text-right">{strengthLabel}</span>
                  </div>
                  {fieldState.error
                    ? <p className="text-xs text-red-500">{fieldState.error.message}</p>
                    : <p className="text-xs text-gray-500">Must be at least 8 characters with numbers and symbols</p>}
                </div>
              )}
            />

            <Controller
              name="rePassword"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rePassword" className="text-sm text-gray-800">Confirm Password<span className="text-gray-400">*</span></Label>
                  <Input {...field} id="rePassword" type="password" placeholder="confirm your password" className={inputClass(fieldState.invalid)} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-sm text-gray-800">Phone Number<span className="text-gray-400">*</span></Label>
                  <Input {...field} id="phone" type="tel" placeholder="01012345678" className={inputClass(fieldState.invalid)} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Controller
              name="terms"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-800 font-normal">
                      I agree to the <span className="text-green-600">Terms of Service</span> and <span className="text-green-600">Privacy Policy</span> <span className="text-gray-400">*</span>
                    </Label>
                  </div>
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full h-11 bg-green-600 hover:bg-green-700 text-white text-base font-semibold">
              <FaUserPlus /> {loading ? "Creating account..." : "Create My Account"}
            </Button>

            <div className="border-t border-gray-100 pt-6 pb-2 text-center">
              <p className="text-base text-gray-800">
                Already have an account? <Link href="/login" className="text-green-600">Sign In</Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}