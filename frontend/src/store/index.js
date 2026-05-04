import { configureStore, combineReducers } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import filtersReducer from './slices/filtersSlice'

// Middleware для сохранения корзины в localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  const state = store.getState()
  localStorage.setItem('cart', JSON.stringify(state.cart.items))
  return result
}

// Загрузка корзины из localStorage
const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      return { items: JSON.parse(savedCart) }
    }
  } catch (e) {
    console.error('Ошибка загрузки корзины из localStorage:', e)
  }
  return { items: [] }
}

const preloadedState = {
  cart: loadCartFromLocalStorage(),
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  filters: filtersReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware),
})