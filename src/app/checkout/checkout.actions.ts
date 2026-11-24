"use server"
import { cookies } from "next/headers"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/orders"

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("userToken")?.value
}

interface ShippingAddress {
  details: string
  phone: string
  city: string
}

export async function createCashOrderAction(
  cartId: string,
  shippingAddress: ShippingAddress
) {
  const token = await getToken()
  if (!token) return { success: false, message: "Please sign in first" }

  try {
    const res = await fetch(`${BASE_URL}/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ shippingAddress }),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to place cash order",
      }
    }

    return {
      success: true,
      message: "Order placed successfully!",
      data: data.data,
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}

export async function createOnlineSessionAction(
  cartId: string,
  shippingAddress: ShippingAddress,
  originUrl: string
) {
  const token = await getToken()
  if (!token) return { success: false, message: "Please sign in first" }

  try {
    const res = await fetch(
      `${BASE_URL}/checkout-session/${cartId}?url=${originUrl}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ shippingAddress }),
      }
    )

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create payment session",
      }
    }

    return {
      success: true,
      url: data.session?.url,
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}