
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item.good_id === product.good_id)
      
      if (existingItem) {
        if (existingItem.quantity + 1 > product.quantity) {
          alert(`Нельзя добавить больше ${product.quantity} шт. (остаток на складе)`)
          return
        }
        existingItem.quantity += 1
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          maxStock: product.quantity,
        })
      }
    },
    
    removeFromCart: (state, action) => {
      const good_id = action.payload
      state.items = state.items.filter(item => item.good_id !== good_id)
    },
    
    updateQuantity: (state, action) => {
      const { good_id, quantity } = action.payload
      const item = state.items.find(item => item.good_id === good_id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.good_id !== good_id)
        } else if (quantity > item.maxStock) {
          alert(`Нельзя добавить больше ${item.maxStock} шт. (остаток на складе)`)
        } else {
          item.quantity = quantity
        }
      }
    },
    
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items

export const selectCartTotalWithoutDiscount = (state) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)

export const selectCartTotalWithDiscount = (state, discountPercent) =>
  selectCartTotalWithoutDiscount(state) * (100 - discountPercent) / 100

export const selectCartTotalItems = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export default cartSlice.reducer