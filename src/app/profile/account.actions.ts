"use server"
import { cookies } from "next/headers"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1"

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("userToken")?.value
}

export async function updateProfileAction(values: {
  name: string
  email: string
  phone: string
}) {
  const token = await getToken()
  if (!token) return { success: false, message: "Please sign in first" }

  try {
    const res = await fetch(`${BASE_URL}/users/updateMe/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(values),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.errors?.msg || data.message || "Failed to update profile",
      }
    }

    return { success: true, message: "Profile updated successfully!", user: data.user }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}

export async function changePasswordAction(values: {
  currentPassword: string
  password: string
  rePassword: string
}) {
  const token = await getToken()
  if (!token) return { success: false, message: "Please sign in first" }

  try {
    const res = await fetch(`${BASE_URL}/users/changeMyPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(values),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.errors?.msg || data.message || "Failed to change password",
      }
    }

    if (data.token) {
      const cookieStore = await cookies()
      cookieStore.set("userToken", data.token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return {
      success: true,
      message: "Password changed successfully!",
      token: data.token,
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}

export async function getAddressesAction() {
  const token = await getToken()
  if (!token) return { success: false, data: [] }

  try {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: "GET",
      headers: { token: token },
      cache: "no-store",
    })
    const data = await res.json()
    if (!res.ok) return { success: false, data: [] }
    return { success: true, data: data.data || [] }
  } catch (error) {
    return { success: false, data: [] }
  }
}

export async function addAddressAction(values: {
  name: string
  details: string
  phone: string
  city: string
}) {
  const token = await getToken()
  if (!token) return { success: false, message: "Please sign in first" }

  try {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(values),
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to add address" }
    }
    return {
      success: true,
      message: "Address saved successfully!",
      data: data.data || [],
    }
  } catch (error) {
    return { success: false, message: "Network error" }
  }
}

export async function removeAddressAction(addressId: string) {
  const token = await getToken()
  if (!token) return { success: false }

  try {
    const res = await fetch(`${BASE_URL}/addresses/${addressId}`, {
      method: "DELETE",
      headers: { token: token },
    })
    const data = await res.json()
    if (!res.ok) return { success: false }
    return { success: true, data: data.data || [] }
  } catch (error) {
    return { success: false }
  }
}

export async function getUserOrdersAction(userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      cache: "no-store",
    })
    const data = await res.json()
    if (!res.ok) return { success: false, data: [] }
    return { success: true, data: Array.isArray(data) ? data : [] }
  } catch (error) {
    return { success: false, data: [] }
  }
}