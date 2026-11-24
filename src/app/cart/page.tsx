"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  FaShoppingCart,
  FaShoppingBag,
  FaCheck,
  FaTrashAlt,
  FaArrowLeft,
  FaTruck,
  FaTag,
  FaLock,
  FaPlus,
  FaMinus,
} from "react-icons/fa"
import {
  getCartAction,
  updateCartQuantityAction,
  removeCartItemAction,
  clearCartAction,
} from "./cart.actions"

interface CartProduct {
  count: number
  _id: string
  price: number
  product: {
    _id: string
    title: string
    imageCover: string
    category: {
      name: string
    }
    id: string
  }
}

interface CartData {
  numOfCartItems: number
  data: {
    _id: string
    totalCartPrice: number
    products: CartProduct[]
  }
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadCart() {
    setLoading(true)
    const res = await getCartAction()
    if (res.success && res.data) {
      setCart(res.data)
    } else {
      setCart(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCart()
  }, [])

  async function handleUpdateCount(productId: string, newCount: number) {
    if (newCount < 1) return
    setUpdatingId(productId)
    const res = await updateCartQuantityAction(productId, newCount)
    if (res.success && res.data) {
      setCart(res.data)
      window.dispatchEvent(new Event("cart-change"))
    } else {
      toast.error("Could not update quantity")
    }
    setUpdatingId(null)
  }

  async function handleRemoveItem(productId: string) {
    setUpdatingId(productId)
    const res = await removeCartItemAction(productId)
    if (res.success && res.data) {
      setCart(res.data)
      toast.success("Item removed from cart")
      window.dispatchEvent(new Event("cart-change"))
    } else {
      toast.error("Failed to remove item")
    }
    setUpdatingId(null)
  }

  async function handleClearCart() {
    setLoading(true)
    const res = await clearCartAction()
    if (res.success) {
      setCart(null)
      toast.success("Cart cleared successfully")
      window.dispatchEvent(new Event("cart-change"))
    } else {
      toast.error("Failed to clear cart")
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const products = cart?.data?.products || []
  const totalPrice = cart?.data?.totalCartPrice || 0
  const itemsCount = cart?.numOfCartItems || 0

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-16">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-[#0aad0a] mb-6">
          <FaShoppingCart size={38} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Your cart is empty
        </h1>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed text-sm sm:text-base">
          Looks like you haven't added anything to your cart yet. Start
          shopping and find something you love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2.5 bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FaShoppingBag size={16} />
          <span>Start Shopping</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Shopping Cart</span>
        </div>

        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center shadow-sm">
            <FaShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500">
              You have{" "}
              <span className="text-[#0aad0a] font-semibold">
                {itemsCount} items
              </span>{" "}
              in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
   
          <div className="lg:col-span-2 space-y-4">
            {products.map((item) => {
              const isUpdating = updatingId === item.product._id
              return (
                <div
                  key={item._id}
                  className={`bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity ${
                    isUpdating ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
     
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-24 h-24 rounded-xl border border-gray-100 bg-white p-2 flex items-center justify-center">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className="inline-flex items-center gap-1 bg-[#0aad0a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        <FaCheck size={9} /> In Stock
                      </span>
                    </div>

                    <div>
                      <Link
                        href={`/productdetails/${item.product._id}`}
                        className="text-lg font-bold text-slate-900 hover:text-green-600 transition-colors line-clamp-1"
                      >
                        {item.product.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 mb-2.5">
                        <span className="bg-green-50 text-[#0aad0a] text-xs font-medium px-2.5 py-0.5 rounded-md">
                          {item.product.category?.name || "Category"}
                        </span>
                        <span className="text-xs text-slate-400">
                          • SKU: {item.product._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="text-base font-bold text-[#0aad0a]">
                        {item.price} EGP{" "}
                        <span className="text-xs font-normal text-slate-400">
                          per unit
                        </span>
                      </div>

              
                      <div className="inline-flex items-center gap-3 border border-gray-200 rounded-xl p-1 mt-3 bg-gray-50/50">
                        <button
                          onClick={() =>
                            handleUpdateCount(item.product._id, item.count - 1)
                          }
                          disabled={item.count <= 1}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                        >
                          <FaMinus size={11} />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800 text-sm">
                          {item.count}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateCount(item.product._id, item.count + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-[#0aad0a] text-white flex items-center justify-center hover:bg-[#088f08] transition-colors cursor-pointer"
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-4">
                    <div className="text-right">
                      <span className="block text-xs text-slate-400">Total</span>
                      <span className="text-xl font-bold text-slate-900">
                        {item.price * item.count}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          EGP
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      title="Remove item"
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FaTrashAlt size={15} />
                    </button>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center justify-between pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0aad0a] hover:text-[#088f08] transition-colors"
              >
                <FaArrowLeft size={13} />
                <span>Continue Shopping</span>
              </Link>

              <button
                onClick={handleClearCart}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <FaTrashAlt size={13} />
                <span>Clear all items</span>
              </button>
            </div>
          </div>


          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">

            <div className="bg-[#0aad0a] text-white p-5">
              <div className="flex items-center gap-2.5 text-lg font-bold">
                <FaShoppingBag size={18} />
                <h2>Order Summary</h2>
              </div>
              <p className="text-xs text-white/85 mt-1">
                {itemsCount} items in your cart
              </p>
            </div>

            <div className="p-5 space-y-5">
     
              <div className="bg-green-50/80 border border-green-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-[#0aad0a] flex items-center justify-center shrink-0">
                  <FaTruck size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0aad0a]">
                    {totalPrice >= 500
                      ? "Free Shipping!"
                      : `Add ${500 - totalPrice} EGP more for Free Shipping`}
                  </h4>
                  <p className="text-xs text-green-700">
                    {totalPrice >= 500
                      ? "You qualify for free delivery"
                      : "Free delivery on orders over 500 EGP"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {totalPrice} EGP
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#0aad0a]">
                    {totalPrice >= 500 ? "FREE" : "50 EGP"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-slate-900">
                  {totalPrice >= 500 ? totalPrice : totalPrice + 50}{" "}
                  <span className="text-xs font-normal text-slate-500">EGP</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Promo codes coming soon!")}
                className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-slate-600 hover:border-green-500 hover:text-green-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FaTag size={13} />
                <span>Apply Promo Code</span>
              </button>

     
              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-xl bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <FaLock size={13} />
                <span>Proceed to Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}