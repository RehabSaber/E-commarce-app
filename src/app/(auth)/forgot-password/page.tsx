"use client"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  FaEnvelope,
  FaKey,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import {
  forgotPasswordAction,
  verifyResetCodeAction,
  resetPasswordAction,
} from "./forgot.actions"

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await forgotPasswordAction(email)
    if (res.success) {
      toast.success(res.message)
      setStep(2)
    } else {
      toast.error(res.message)
    }

    setLoading(false)
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await verifyResetCodeAction(resetCode.trim())
    if (res.success) {
      toast.success(res.message)
      setStep(3)
    } else {
      toast.error(res.message)
    }

    setLoading(false)
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    const res = await resetPasswordAction(email, newPassword)

    if (res.success) {
      toast.success(res.message)
      router.push("/login")
    } else {
      toast.error(res.message)
    }

    setLoading(false)
  }

  let step1CircleClass = "bg-gray-100 text-slate-400"
  if (step >= 1) {
    step1CircleClass = "bg-[#0aad0a] text-white"
  }

  let step2CircleClass = "bg-gray-100 text-slate-400"
  if (step >= 2) {
    step2CircleClass = "bg-[#0aad0a] text-white"
  }

  let step3CircleClass = "bg-gray-100 text-slate-400"
  if (step >= 3) {
    step3CircleClass = "bg-[#0aad0a] text-white"
  }

  let line1Class = "bg-gray-200"
  if (step >= 2) {
    line1Class = "bg-[#0aad0a]"
  }

  let line2Class = "bg-gray-200"
  if (step >= 3) {
    line2Class = "bg-[#0aad0a]"
  }

  let passwordInputType = "password"
  if (showPassword) {
    passwordInputType = "text"
  }

  let step1BtnText = "Send Reset Code"
  if (loading) {
    step1BtnText = "Sending..."
  }

  let step2BtnText = "Verify Code"
  if (loading) {
    step2BtnText = "Verifying..."
  }

  let step3BtnText = "Reset Password"
  if (loading) {
    step3BtnText = "Updating..."
  }

  return (
    <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step1CircleClass}`}
            >
              {step > 1 ? <FaCheckCircle size={15} /> : "1"}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              Email
            </span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded-full ${line1Class}`} />

          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step2CircleClass}`}
            >
              {step > 2 ? <FaCheckCircle size={15} /> : "2"}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              Verify
            </span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded-full ${line2Class}`} />

          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step3CircleClass}`}
            >
              3
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              Reset
            </span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#0aad0a] flex items-center justify-center mb-4">
              <FaEnvelope size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Forgot Password?
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Enter your registered email address and we will send you a
              verification code to reset your password.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {step1BtnText}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#0aad0a] flex items-center justify-center mb-4">
              <FaKey size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Verify Reset Code
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-800">{email}</span>.
              Please enter it below.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter the code from your email"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm tracking-widest text-center font-bold outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {step2BtnText}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-medium text-slate-500 hover:text-green-600 transition-colors cursor-pointer"
              >
                Change email address
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#0aad0a] flex items-center justify-center mb-4">
              <FaLock size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Set New Password
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Create a strong new password for your account.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordInputType}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={15} />
                    ) : (
                      <FaEye size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={passwordInputType}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {step3BtnText}
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0aad0a] transition-colors"
          >
            <FaArrowLeft size={11} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}