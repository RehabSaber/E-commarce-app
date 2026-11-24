"use server"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/auth"

export async function forgotPasswordAction(email: string) {
  try {
    const res = await fetch(`${BASE_URL}/forgotPasswords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Email not found, please check your email",
      }
    }

    return {
      success: true,
      message: data.message || "Reset code sent to your email",
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}

export async function verifyResetCodeAction(resetCode: string) {
  try {
    const res = await fetch(`${BASE_URL}/verifyResetCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetCode }),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Invalid or expired reset code",
      }
    }

    return {
      success: true,
      message: "Code verified successfully",
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}

export async function resetPasswordAction(email: string, newPassword: string) {
  try {
    const res = await fetch(`${BASE_URL}/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    })

    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to reset password",
      }
    }

    return {
      success: true,
      message: "Password reset successfully! Please sign in.",
    }
  } catch (error) {
    return { success: false, message: "Network error, try again" }
  }
}