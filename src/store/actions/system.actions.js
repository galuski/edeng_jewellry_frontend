import { store } from "../store.js";
import { SET_CURRENCY, SET_EXCHANGE_RATE } from "../reducers/system.reducer.js";

export async function loadExchangeRate() {
  try {
    // קריאה ל-Endpoint החדש שיצרנו ב-Node.js
    const response = await fetch("/api/exchange/rate"); 
    const data = await response.json();
    
    if (data.success && data.rate) {
      store.dispatch({ type: SET_EXCHANGE_RATE, rate: data.rate });
    }
  } catch (err) {
    console.error("system action -> Cannot load exchange rate", err);
  }
}

export function setCurrency(currency) {
  // שמירה בלוקל סטורג' ועדכון ה-Store
  localStorage.setItem("currency", currency);
  store.dispatch({ type: SET_CURRENCY, currency });
}