"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  FaBox,
  FaSyncAlt,
  FaArrowRight,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaReceipt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa"
import { getUserOrdersAction } from "../profile/account.actions"

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(window.atob(base64))
  } catch {
    return null
  }
}

interface OrderItem {
  _id: string
  id: number
  totalOrderPrice: number
  shippingPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  createdAt: string
  shippingAddress?: {
    details: string
    phone: string
    city: string
  }
  cartItems: {
    _id: string
    count: number
    price: number
    product: {
      title: string
      imageCover: string
    }
  }[]
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  async function loadOrders() {
    setLoading(true)
    const token = localStorage.getItem("userToken")
    if (token) {
      const decoded = decodeToken(token)
      if (decoded?.id) {
        const res = await getUserOrdersAction(decoded.id)
        if (res.success) {
          const sorted = [...res.data].reverse()
          setOrders(sorted)
          if (sorted.length > 0) {
            setExpandedOrderId(sorted[0]._id)
          }
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">My Orders</span>
        </div>

  
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center shadow-xs">
              <FaBox size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                My Orders
              </h1>
              <p className="text-sm text-slate-500">
                {orders.length > 0
                  ? `Track and manage your ${orders.length} order${
                      orders.length > 1 ? "s" : ""
                    }`
                  : "Track and manage your orders"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadOrders}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-green-500 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <FaSyncAlt size={12} />
              <span>Refresh</span>
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0aad0a] hover:text-[#088f08]"
            >
              <span>Continue Shopping</span>
              <FaArrowRight size={12} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-24 px-4 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-20 h-20 rounded-full bg-green-50 text-[#0aad0a] flex items-center justify-center mb-5">
              <FaShoppingBag size={30} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-slate-500 text-sm max-w-md mb-7 leading-relaxed">
              You haven't placed any orders yet. When you buy products, all
              your orders and live tracking will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-colors"
            >
              <span>Start Shopping</span>
              <FaArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id
              const totalItems = order.cartItems?.reduce(
                (acc, item) => acc + item.count,
                0
              )
              const firstImage = order.cartItems?.[0]?.product?.imageCover

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden"
                >
                  <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 p-1.5 flex items-center justify-center shrink-0">
                        {firstImage && (
                          <img
                            src={firstImage}
                            alt="Order cover"
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                        {order.cartItems.length > 1 && (
                          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            +{order.cartItems.length - 1}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            ● {order.isDelivered ? "Delivered" : "Processing"}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            # {order.id}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <FaCalendarAlt size={11} />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span>• {totalItems} items</span>
                          {order.shippingAddress?.city && (
                            <span className="inline-flex items-center gap-1">
                              • <FaMapMarkerAlt size={11} />
                              {order.shippingAddress.city}
                            </span>
                          )}
                        </div>

                        <div className="text-lg font-bold text-slate-900 mt-1.5">
                          {order.totalOrderPrice.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            EGP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-gray-50 text-slate-500 flex items-center justify-center">
                        {order.paymentMethodType === "card" ? (
                          <FaCreditCard size={14} />
                        ) : (
                          <FaMoneyBillWave size={14} />
                        )}
                      </span>

                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order._id)
                        }
                        className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide" : "Show Details"}</span>
                        {isExpanded ? (
                          <FaChevronUp size={11} />
                        ) : (
                          <FaChevronDown size={11} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/40 p-5 sm:p-6 space-y-6">
                 
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3">
                          <FaBox className="text-[#0aad0a]" />
                          <span>Order Items</span>
                        </h4>

                        <div className="space-y-2.5">
                          {order.cartItems?.map((item) => (
                            <div
                              key={item._id}
                              className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <img
                                  src={item.product?.imageCover}
                                  alt={item.product?.title}
                                  className="w-12 h-12 rounded-lg border border-gray-100 object-contain p-1 shrink-0"
                                />
                                <div className="min-w-0">
                                  <h5 className="text-sm font-bold text-slate-800 line-clamp-1">
                                    {item.product?.title}
                                  </h5>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {item.count} × {item.price} EGP
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-slate-900 block">
                                  {(item.count * item.price).toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  EGP
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                          <h5 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2.5">
                            <FaMapMarkerAlt className="text-[#0aad0a]" />
                            <span>Delivery Address</span>
                          </h5>
                          <p className="text-sm font-bold text-slate-900">
                            {order.shippingAddress?.city || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {order.shippingAddress?.details || ""}
                          </p>
                          {order.shippingAddress?.phone && (
                            <p className="text-xs text-slate-500 mt-1">
                              Phone: {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>

                        <div className="bg-amber-50/60 rounded-xl border border-amber-100 p-4">
                          <h5 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2.5">
                            <FaReceipt className="text-amber-600" />
                            <span>Order Summary</span>
                          </h5>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span>Subtotal</span>
                              <span className="font-semibold">
                                {order.totalOrderPrice.toLocaleString()} EGP
                              </span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Shipping</span>
                              <span className="font-semibold text-[#0aad0a]">
                                {order.shippingPrice === 0
                                  ? "Free"
                                  : `${order.shippingPrice} EGP`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-amber-200/60">
                              <span>Total</span>
                              <span>
                                {order.totalOrderPrice.toLocaleString()} EGP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}