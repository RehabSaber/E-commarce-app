"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaTrashAlt,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa"
import {
  getWishlistAction,
  removeFromWishlistAction,
} from "./wishlist.actions"
import { addToCartAction } from "../cart/cart.actions"

interface WishlistProduct {
  _id: string
  id: string
  title: string
  imageCover: string
  price: number
  priceAfterDiscount?: number
  quantity: number
  category: {
    name: string
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  async function loadWishlist() {
    setLoading(true)
    const res = await getWishlistAction()
    if (res.success && res.data) {
      setItems(res.data)
    } else {
      setItems([])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  async function handleRemove(productId: string) {
    setActionLoadingId(productId)
    const res = await removeFromWishlistAction(productId)
    if (res.success) {
      setItems(items.filter((item) => item._id !== productId))
      toast.success("Removed from wishlist")
      window.dispatchEvent(new Event("wishlist-change"))
    } else {
      toast.error("Failed to remove item")
    }
    setActionLoadingId(null)
  }

  async function handleAddToCart(productId: string) {
    setActionLoadingId(productId)
    const res = await addToCartAction(productId)
    if (res.success) {
      toast.success(res.message)
      window.dispatchEvent(new Event("cart-change"))
    } else {
      toast.error(res.message)
    }
    setActionLoadingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Wishlist</span>
        </div>


        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-xs border border-red-100">
            <FaHeart size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Wishlist
            </h1>
            <p className="text-sm text-slate-500">{items.length} items saved</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 mb-4 transition-colors"
            >
              <FaArrowLeft size={12} />
              <span>Continue Shopping</span>
            </Link>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs py-20 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-400 flex items-center justify-center mb-5">
                <FaRegHeart size={32} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-slate-500 text-sm max-w-sm mb-7 leading-relaxed">
                Tap the heart icon on any product to save it here and come back
                to it later.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
              >
                <FaShoppingBag size={15} />
                <span>Explore Products</span>
              </Link>
            </div>
          </div>
        ) : (

          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">

              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((product) => {
                  const isBusy = actionLoadingId === product._id
                  const hasDiscount =
                    product.priceAfterDiscount !== undefined &&
                    product.priceAfterDiscount < product.price

                  return (
                    <div
                      key={product._id}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 sm:px-6 py-5 transition-opacity ${
                        isBusy ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >

                      <div className="md:col-span-6 flex items-center gap-4">
                        <Link
                          href={`/productdetails/${product._id}`}
                          className="w-20 h-20 rounded-xl border border-gray-100 bg-white p-2 flex items-center justify-center shrink-0"
                        >
                          <img
                            src={product.imageCover}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </Link>
                        <div>
                          <Link
                            href={`/productdetails/${product._id}`}
                            className="font-bold text-slate-900 hover:text-green-600 transition-colors line-clamp-1 text-base"
                          >
                            {product.title}
                          </Link>
                          <span className="text-xs text-slate-400 mt-1 block">
                            {product.category?.name}
                          </span>
                        </div>
                      </div>

 
                      <div className="md:col-span-2 flex md:flex-col items-center justify-between md:justify-center">
                        <span className="md:hidden text-xs text-slate-400">
                          Price:
                        </span>
                        {hasDiscount ? (
                          <div className="text-center">
                            <span className="font-bold text-slate-900 block">
                              {product.priceAfterDiscount} EGP
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              {product.price} EGP
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900">
                            {product.price} EGP
                          </span>
                        )}
                      </div>


                      <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-xs text-slate-400">
                          Status:
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-[#0aad0a] text-xs font-semibold px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0aad0a]"></span>
                          In Stock
                        </span>
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => handleRemove(product._id)}
                          title="Remove from wishlist"
                          className="w-9 h-9 rounded-lg border border-gray-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <FaTrashAlt size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 mt-6 transition-colors"
            >
              <FaArrowLeft size={12} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}