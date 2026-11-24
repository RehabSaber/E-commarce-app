"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaCog,
  FaChevronRight,
  FaSave,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import {
  updateProfileAction,
  changePasswordAction,
} from "./account.actions"

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(window.atob(base64))
  } catch {
    return null
  }
}

export default function ProfilePage() {
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("user")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPass, setSavingPass] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token) {
      const decoded = decodeToken(token)
      if (decoded) {
        setUserId(decoded.id || "")
        setRole(decoded.role || "user")
        setName(decoded.name || "")
      }
    }
    const savedEmail = localStorage.getItem("userEmail")
    const savedName = localStorage.getItem("userName")
    if (savedEmail) setEmail(savedEmail)
    if (savedName) setName(savedName)
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    const res = await updateProfileAction({ name, email, phone })
    if (res.success) {
      localStorage.setItem("userName", name)
      localStorage.setItem("userEmail", email)
      window.dispatchEvent(new Event("auth-change"))
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
    setSavingProfile(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setSavingPass(true)
    const res = await changePasswordAction({
      currentPassword,
      password: newPassword,
      rePassword: confirmPassword,
    })

    if (res.success) {
      if (res.token) {
        localStorage.setItem("userToken", res.token)
      }
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
    setSavingPass(false)
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">

      <div className="bg-linear-to-r from-[#0aad0a] to-[#00c853] text-white py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">My Account</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0aad0a] shadow-sm shrink-0">
              <FaUser size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">My Account</h1>
              <p className="text-sm text-white/90">
                Manage your addresses and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 px-3 mb-3">
              My Account
            </h3>
            <nav className="space-y-1.5">
              <Link
                href="/allorders"
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FaBox className="text-slate-400" />
                  My Orders
                </span>
                <FaChevronRight size={11} className="text-slate-400" />
              </Link>

              <Link
                href="/addresses"
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-slate-400" />
                  My Addresses
                </span>
                <FaChevronRight size={11} className="text-slate-400" />
              </Link>

              <Link
                href="/profile"
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold bg-green-50 text-[#0aad0a]"
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#0aad0a] text-white flex items-center justify-center">
                    <FaCog size={12} />
                  </span>
                  Settings
                </span>
                <FaChevronRight size={11} />
              </Link>
            </nav>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-[#0aad0a] flex items-center justify-center">
                  <FaUser size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your personal details
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  <FaSave size={14} />
                  <span>{savingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">User ID</span>
                    <span className="font-mono text-slate-700 bg-gray-50 px-2.5 py-1 rounded">
                      {userId || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Role</span>
                    <span className="bg-green-50 text-[#0aad0a] font-semibold px-3 py-1 rounded-full">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <FaLock size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your account password
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrent ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNew ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Must be at least 6 characters
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirm ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPass}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  <FaLock size={13} />
                  <span>{savingPass ? "Updating..." : "Update Password"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}