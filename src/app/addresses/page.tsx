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
  FaPlus,
  FaTimes,
  FaTrashAlt,
  FaPhone,
  FaHome,
  FaBriefcase,
} from "react-icons/fa"
import {
  getAddressesAction,
  addAddressAction,
  removeAddressAction,
} from "../profile/account.actions"

interface AddressItem {
  _id: string
  name: string
  details: string
  phone: string
  city: string
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [label, setLabel] = useState("Home")
  const [city, setCity] = useState("")
  const [details, setDetails] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  async function loadAddresses() {
    setLoading(true)
    const res = await getAddressesAction()
    if (res.success) {
      setAddresses(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await addAddressAction({
      name: label,
      city,
      details,
      phone,
    })

    if (res.success) {
      setAddresses(res.data)
      setIsModalOpen(false)
      setCity("")
      setDetails("")
      setPhone("")
      setLabel("Home")
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  async function handleDeleteAddress(id: string) {
    const res = await removeAddressAction(id)
    if (res.success) {
      setAddresses(res.data)
      toast.success("Address removed")
    } else {
      toast.error("Failed to remove address")
    }
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
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold bg-green-50 text-[#0aad0a]"
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#0aad0a] text-white flex items-center justify-center">
                    <FaMapMarkerAlt size={12} />
                  </span>
                  My Addresses
                </span>
                <FaChevronRight size={11} />
              </Link>

              <Link
                href="/profile"
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FaCog className="text-slate-400" />
                  Settings
                </span>
                <FaChevronRight size={11} className="text-slate-400" />
              </Link>
            </nav>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  My Addresses
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your saved delivery addresses for faster checkout
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <FaPlus size={12} />
                <span>Add Address</span>
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 px-4 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-green-50 text-[#0aad0a] flex items-center justify-center mb-4">
                  <FaMapMarkerAlt size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No saved addresses yet
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Add a delivery address so we know where to ship your orders.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <FaPlus size={12} />
                  <span>Add Your First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-[#0aad0a] text-xs font-bold px-3 py-1 rounded-full">
                          {addr.name === "Work" ? (
                            <FaBriefcase size={11} />
                          ) : (
                            <FaHome size={11} />
                          )}
                          {addr.name}
                        </span>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <FaTrashAlt size={13} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">
                        {addr.city}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {addr.details}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-slate-500">
                      <FaPhone size={11} className="text-green-600" />
                      <span>{addr.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Add New Delivery Address
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-slate-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Address Label
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {["Home", "Work", "Other"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setLabel(item)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        label === item
                          ? "border-[#0aad0a] bg-green-50 text-[#0aad0a]"
                          : "border-gray-200 text-slate-600 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Cairo, Giza, Alexandria"
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street & Building Details{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Street name, building number, apartment/floor..."
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01010700700"
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}