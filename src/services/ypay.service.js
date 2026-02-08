// src/services/ypay.service.js

export async function createPayment({ amount, contact, items, discount }) {
  try {
    const res = await fetch("/api/ypay/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, contact, items, discount }),
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      console.error("❌ createPayment error:", data)
      throw new Error(`Failed to create payment: ${JSON.stringify(data)}`)
    }

    return data // { url, chargeIdentifier }
  } catch (err) {
    console.error("❌ YPAY Payment Error:", err)
    throw err
  }
}

export async function generateReceipt({ contact, items, amount }) {
  try {
    const res = await fetch("/api/ypay/document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, items, amount }),
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      console.error("❌ generateReceipt error:", data)
      throw new Error(`Failed to generate receipt: ${JSON.stringify(data)}`)
    }

    return data // { url, serialNumber }
  } catch (err) {
    console.error("❌ YPAY Receipt Error:", err)
    throw err
  }
}
