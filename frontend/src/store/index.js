import { configureStore, combineReducers } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import filtersReducer from './slices/filtersSlice'
import authReducer from './slices/authSlice'

// Сохраняем корзину и авторизацию в localStorage при каждом действии
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  const state = store.getState()
  localStorage.setItem('cart', JSON.stringify(state.cart.items))
  localStorage.setItem('auth', JSON.stringify({
    token: state.auth.token,
    user: state.auth.user,
  }))
  return result
}

const loadCartFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('cart')
    if (saved) return { items: JSON.parse(saved) }
  } catch (e) {
    console.error('Cart load error:', e)
  }
  return { items: [] }
}

const loadAuthFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('auth')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Auth load error:', e)
  }
  return { token: null, user: null }
}

const preloadedState = {
  cart: loadCartFromLocalStorage(),
  auth: loadAuthFromLocalStorage(),
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  filters: filtersReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(localStorageMiddleware),
})