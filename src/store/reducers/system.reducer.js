export const SET_CURRENCY = "SET_CURRENCY";
export const SET_EXCHANGE_RATE = "SET_EXCHANGE_RATE";

// קריאת המטבע השמור, ברירת מחדל שקל
const savedCurrency = localStorage.getItem("currency") || "ILS";

const initialState = {
  currency: savedCurrency,
  exchangeRate: 1, // 1 כברירת מחדל עד שהשרת יחזיר את הערך האמיתי
};

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CURRENCY:
      return { ...state, currency: action.currency };
    case SET_EXCHANGE_RATE:
      return { ...state, exchangeRate: action.rate };
    default:
      return state;
  }
}