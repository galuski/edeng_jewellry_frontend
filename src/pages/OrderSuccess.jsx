// src/pages/OrderSuccess.jsx
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { SET_CART } from "../store/reducers/jewel.reducer.js"
import { Loader } from "./../cmps/Loader.jsx"

export function OrderSuccess() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function finalizeOrder() {
      try {
        const items = JSON.parse(localStorage.getItem("lastItems") || "[]")

        // ✅ מנקה את העגלה
        dispatch({ type: SET_CART, cart: [] })
        localStorage.removeItem("shoppingCart")

        // ✅ מוריד מלאי בפריטים שנקנו
        for (const item of items) {
          if (item._id) {
            try {
              await fetch("/api/jewel/decrease", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jewelId: item._id,
                  amount: item.quantity || 1,
                }),
              })
            } catch (err) {
              console.error("❌ Failed to decrease jewel quantity:", err)
            }
          }
        }

        // ✅ מנקה גם פרטים ששמרנו ל־localStorage
        localStorage.removeItem("lastContact")
        localStorage.removeItem("lastItems")
        localStorage.removeItem("lastAmount")
      } catch (err) {
        console.error("❌ Error finalizing order:", err)
      }
    }

    finalizeOrder()
  }, [dispatch])

  return (
    <section className="order-success">
      <h2>✅ התשלום הצליח</h2>
      <p>תודה על הרכישה שלך! קבלה נשלחה למייל שסיפקת.</p>
    </section>
  )
}