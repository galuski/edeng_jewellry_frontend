// jewel.actions.js
import { jewelService } from "../../services/jewel.service.js";
import { 
  ADD_JEWEL, 
  JEWEL_UNDO, 
  REMOVE_JEWEL, 
  SET_JEWELRY, 
  SET_IS_LOADING, 
  UPDATE_JEWEL,
  ADD_JEWEL_TO_CART,
  REMOVE_JEWEL_FROM_CART,
  CLEAR_CART,
  SET_CART
} from "../reducers/jewel.reducer.js";
import { store } from "../store.js";

// --- Jewelry CRUD ---
export function loadJewelry() {
  const { filterBy } = store.getState().jewelModule

  store.dispatch({ type: SET_IS_LOADING, isLoading: true })
  return jewelService.query(filterBy)
    .then(jewelry => {
      store.dispatch({ type: SET_JEWELRY, jewelry })
    })
    .catch(err => {
      console.log('jewel action -> Cannot load jewelry', err)
      throw err
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}

export function removeJewel(jewelId) {
  return jewelService.remove(jewelId)
    .then(() => {
      store.dispatch({ type: REMOVE_JEWEL, jewelId })
    })
    .catch(err => {
      console.log('jewel action -> Cannot remove jewel', err)
      throw err
    })
}

export function removeJewelOptimistic(jewelId) {
  store.dispatch({ type: REMOVE_JEWEL, jewelId })
  return jewelService.remove(jewelId)
    .catch(err => {
      store.dispatch({ type: JEWEL_UNDO })
      console.log('jewel action -> Cannot remove jewel', err)
      throw err
    })
}

export function saveJewel(jewel) {
  const type = jewel._id ? UPDATE_JEWEL : ADD_JEWEL
  return jewelService.save(jewel)
    .then(jewelToSave => {
      store.dispatch({ type, jewel: jewelToSave })
      return jewelToSave
    })
    .catch(err => {
      console.log('jewel action -> Cannot save jewel', err)
      throw err
    })
}

// --- Shopping Cart ---
export function addToCart(jewel) {
  store.dispatch({ type: ADD_JEWEL_TO_CART, jewel })
}

export function removeFromCart(jewelId) {
  store.dispatch({ type: REMOVE_JEWEL_FROM_CART, jewelId })
}

export function clearCart() {
  store.dispatch({ type: CLEAR_CART })
}

export function setCart(cart) {
  store.dispatch({ type: SET_CART, cart })
}