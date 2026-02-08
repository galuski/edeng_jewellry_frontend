import { jewelService } from "../../services/jewel.service.js";

export const SET_JEWELRY = "SET_JEWELRY";
export const REMOVE_JEWEL = "REMOVE_JEWEL";
export const ADD_JEWEL = "ADD_JEWEL";
export const UPDATE_JEWEL = "UPDATE_JEWEL";

export const SET_CART_IS_SHOWN = "SET_CART_IS_SHOWN";
export const REMOVE_JEWEL_FROM_CART = "REMOVE_JEWEL_FROM_CART";

export const ADD_JEWEL_TO_CART = "ADD_JEWEL_TO_CART";
export const CLEAR_CART = "CLEAR_CART";

export const SET_FILTER_BY = "SET_FILTER_BY";
export const SET_IS_LOADING = "SET_IS_LOADING";

export const JEWEL_UNDO = "JEWEL_UNDO";

export const SET_CART = "SET_CART";

// ✅ קריאת סל שמור מה-localStorage בעת אתחול
const savedCart = (() => {
  try {
    const data = localStorage.getItem("shoppingCart")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
})()

const initialState = {
  jewelry: [],
  lastJewelry: [],
  isCartShown: false,
  shoppingCart: savedCart,
  filterBy: jewelService.getDefaultFilter(),
  isLoading: false,
}

// ✅ פונקציה לשמירת סל בלוקל סטורג'
function saveCart(cart) {
  try {
    localStorage.setItem("shoppingCart", JSON.stringify(cart))
  } catch (err) {
    console.error("❌ Failed to save shoppingCart to localStorage", err)
  }
}

export function jewelReducer(state = initialState, action = {}) {
  let jewelry
  let shoppingCart
  let lastJewelry

  switch (action.type) {
    // --- Jewelry ---
    case SET_JEWELRY:
      lastJewelry = [...action.jewelry]
      return { ...state, jewelry: action.jewelry, lastJewelry }

    case REMOVE_JEWEL:
      lastJewelry = [...state.jewelry]
      jewelry = state.jewelry.filter((jewel) => jewel._id !== action.jewelId)
      return { ...state, jewelry, lastJewelry }

    case ADD_JEWEL:
      jewelry = [...state.jewelry, action.jewel]
      return { ...state, jewelry }

    case UPDATE_JEWEL:
      jewelry = state.jewelry.map((jewel) =>
        jewel._id === action.jewel._id ? action.jewel : jewel
      )
      return { ...state, jewelry }

    case JEWEL_UNDO:
      jewelry = [...state.lastJewelry]
      return { ...state, jewelry }

    // --- Shopping Cart ---
    case SET_CART_IS_SHOWN:
      return { ...state, isCartShown: action.isCartShown }

    case ADD_JEWEL_TO_CART:
      shoppingCart = [...state.shoppingCart, action.jewel]
      saveCart(shoppingCart)
      return { ...state, shoppingCart }

    case REMOVE_JEWEL_FROM_CART:
      shoppingCart = state.shoppingCart.filter(
        (jewel) => jewel._id !== action.jewelId
      )
      saveCart(shoppingCart)
      return { ...state, shoppingCart }

    case SET_CART:
      shoppingCart = action.cart
      saveCart(shoppingCart)
      return { ...state, shoppingCart }

    case CLEAR_CART:
      shoppingCart = []
      saveCart(shoppingCart)
      return { ...state, shoppingCart }

    // --- Filters & Loading ---
    case SET_FILTER_BY:
      return { ...state, filterBy: { ...action.filterBy } }

    case SET_IS_LOADING:
      return { ...state, isLoading: action.isLoading }

    default:
      return state
  }
}