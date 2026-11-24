"use server"

import { cookies } from "next/headers"

export async function loginAction(data: { email: string; password: string; keepSignedIn?: boolean }) {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Incorrect email or password" }
    }

    const cookieStore = await cookies()
    cookieStore.set("userToken", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return { success: true, token: result.token }
  } catch (error) {
    return { success: false, message: "Network error, check your connection" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("userToken")
}