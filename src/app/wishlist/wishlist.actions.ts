"use server"
import { cookies } from "next/headers"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist"

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("userToken")?.value
}


export async function addToWishlistAction(productId: string) {
  const token = await getToken()
  if (!token) {
    return { success: false, message: "Please sign in first to add to wishlist" }
  }

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ productId }),
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to add to wishlist" }
    }

    return {
      success: true,
      message: data.message || "Product added successfully to your wishlist",
      data: data.data,
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}


export async function getWishlistAction() {
  const token = await getToken()
  if (!token) {
    return { success: false, data: [] }
  }

  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: { token: token },
      cache: "no-store",
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, data: [] }
    }

    return { success: true, data: data.data || [] }
  } catch (error) {
    return { success: false, data: [] }
  }
}


export async function removeFromWishlistAction(productId: string) {
  const token = await getToken()
  if (!token) return { success: false }

  try {
    const res = await fetch(`${BASE_URL}/${productId}`, {
      method: "DELETE",
      headers: { token: token },
    })

    const data = await res.json()
    if (!res.ok) return { success: false }

    return { success: true, data: data.data }
  } catch (error) {
    return { success: false }
  }
}