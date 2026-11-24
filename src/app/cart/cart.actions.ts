"use server"
import { cookies } from "next/headers"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/cart"

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("userToken")?.value
}

export async function addToCartAction(productId: string) {
  const token = await getToken()
  if (!token) {
    return { success: false, message: "Please sign in first to add items to cart" }
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
      return { success: false, message: data.message || "Failed to add product" }
    }

    return { success: true, message: data.message || "Product added to cart", numOfCartItems: data.numOfCartItems }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}


export async function getCartAction() {
  const token = await getToken()
  if (!token) {
    return { success: false, data: null }
  }

  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: { token: token },
      cache: "no-store",
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, data: null }
    }

    return { success: true, data: data }
  } catch (error) {
    return { success: false, data: null }
  }
}

export async function updateCartQuantityAction(productId: string, count: number) {
  const token = await getToken()
  if (!token) return { success: false }

  try {
    const res = await fetch(`${BASE_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ count }),
    })

    const data = await res.json()
    if (!res.ok) return { success: false }

    return { success: true, data: data }
  } catch (error) {
    return { success: false }
  }
}

export async function removeCartItemAction(productId: string) {
  const token = await getToken()
  if (!token) return { success: false }

  try {
    const res = await fetch(`${BASE_URL}/${productId}`, {
      method: "DELETE",
      headers: { token: token },
    })

    const data = await res.json()
    if (!res.ok) return { success: false }

    return { success: true, data: data }
  } catch (error) {
    return { success: false }
  }
}

export async function clearCartAction() {
  const token = await getToken()
  if (!token) return { success: false }

  try {
    const res = await fetch(BASE_URL, {
      method: "DELETE",
      headers: { token: token },
    })

    if (!res.ok) return { success: false }
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}