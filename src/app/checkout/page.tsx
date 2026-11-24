"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaTag,
} from "react-icons/fa"
import { getCartAction } from "../cart/cart.actions"
import { getAddressesAction } from "../profile/account.actions"
import {
  createCashOrderAction,
  createOnlineSessionAction,
} from "./checkout.actions"

interface CartProduct {
  count: number
  _id: string
  price: number
  product: {
    _id: string
    title: string
    imageCover: string
  }
}

interface SavedAddress {
  _id: string
  name: string
  city: string
  details: string
  phone: string
}

export default function CheckoutPage() {
  const router = useRouter()

  const [cartId, setCartId] = useState("")
  const [products, setProducts] = useState<CartProduct[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [itemsCount, setItemsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [details, setDetails] = useState("")
  const [postalCode, setPostalCode] = useState("")

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
  const [coupon, setCoupon] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function initCheckout() {
      setLoading(true)
      const [cartRes, addrRes] = await Promise.all([
        getCartAction(),
        getAddressesAction(),
      ])

      if (cartRes.success && cartRes.data?.data) {
        setCartId(cartRes.data.data._id)
        setProducts(cartRes.data.data.products || [])
        setTotalPrice(cartRes.data.data.totalCartPrice || 0)
        setItemsCount(cartRes.data.numOfCartItems || 0)
      }

      if (addrRes.success && addrRes.data) {
        setSavedAddresses(addrRes.data)
      }
      setLoading(false)
    }

    initCheckout()
  }, [])

  function handleSelectSavedAddress(addr: SavedAddress) {
    setCity(addr.city)
    setPhone(addr.phone)
    setDetails(addr.details)
    toast.info(`Filled address: ${addr.name}`)
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()

    if (!cartId) {
      toast.error("Your cart is empty")
      return
    }
    if (!city.trim() || !phone.trim() || !details.trim()) {
      toast.error("Please fill all required shipping fields")
      return
    }

    setSubmitting(true)
    const shippingAddress = {
      city,
      phone,
      details: postalCode ? `${details} (Postal: ${postalCode})` : details,
    }

    if (paymentMethod === "cash") {
      const res = await createCashOrderAction(cartId, shippingAddress)
      if (res.success) {
        toast.success(res.message)
        window.dispatchEvent(new Event("cart-change"))
        router.push("/allorders")
      } else {
        toast.error(res.message)
      }
    } else {
      const originUrl = window.location.origin
      const res = await createOnlineSessionAction(
        cartId,
        shippingAddress,
        originUrl
      )
      if (res.success && res.url) {
        window.location.href = res.url
      } else {
        toast.error(res.message || "Could not start online payment")
      }
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          No items to checkout
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Add some products to your cart first before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Go to Shop
        </Link>
      </div>
    )
  }

  const shippingCost = totalPrice >= 500 ? 0 : 50
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-green-600 transition-colors">
            Cart
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Checkout</span>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
        
          <div className="lg:col-span-2 space-y-6">
        
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-[#0aad0a] flex items-center justify-center">
                    <FaBuilding size={16} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Shipping Details
                  </h2>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Saved:</span>
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-[#0aad0a] hover:bg-green-100 transition-colors cursor-pointer"
                      >
                        {addr.name} ({addr.city})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City / Governorate <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt
                      size={13}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Cairo, Giza, Alexandria"
                      required
                      className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone
                      size={13}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      required
                      className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street Address & Building Details{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Street name, building number, apartment, landmark"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Postal Code (Optional)
                </label>
                <div className="relative">
                  <FaEnvelope
                    size={13}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 11511"
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>

      
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-[#0aad0a] flex items-center justify-center">
                  <FaCreditCard size={16} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-[#0aad0a] bg-green-50/40"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-green-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                      <FaMoneyBillWave size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Cash on Delivery
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pay with cash when delivered
                      </p>
                    </div>
                  </div>

                  {paymentMethod === "cash" && (
                    <FaCheckCircle
                      size={18}
                      className="text-[#0aad0a] shrink-0"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    paymentMethod === "online"
                      ? "border-[#0aad0a] bg-green-50/40"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FaCreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Online Card
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Visa / Mastercard / Stripe
                      </p>
                    </div>
                  </div>

                  {paymentMethod === "online" && (
                    <FaCheckCircle
                      size={18}
                      className="text-[#0aad0a] shrink-0"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs sticky top-24">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Order Summary ({itemsCount} items)
            </h3>

        
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1 mb-5">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-lg border border-gray-100 object-contain p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {item.count} × {item.price} EGP
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {item.price * item.count} EGP
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {totalPrice.toLocaleString()} EGP
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-[#0aad0a]">
                  {shippingCost === 0 ? "Free" : `${shippingCost} EGP`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-5">
              <span className="text-base font-bold text-slate-900">
                Total Amount
              </span>
              <span className="text-xl font-bold text-[#0aad0a]">
                {finalTotal.toLocaleString()} EGP
              </span>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="relative flex-1">
                <FaTag
                  size={12}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="COUPON CODE"
                  className="w-full rounded-xl border border-gray-200 pl-8 pr-3 py-2 text-xs uppercase outline-none focus:border-green-500"
                />
              </div>
              <button
                type="button"
                onClick={() => toast.info("Invalid or expired coupon code")}
                className="px-4 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              <span>
                {submitting
                  ? "Processing..."
                  : paymentMethod === "cash"
                  ? "Place Cash Order"
                  : "Proceed to Online Payment"}
              </span>
              <FaArrowRight size={13} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3.5">
              <FaShieldAlt className="text-[#0aad0a]" />
              <span>100% Secure Checkout Guaranteed</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}