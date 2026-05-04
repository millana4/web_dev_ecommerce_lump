import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

// Асинхронный thunk для загрузки товаров
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await api.getGoods()
    return response
  }
)

// Начальное состояние
const initialState = {
  items: [],
  loading: false,
  error: null,
}

// Создаём слайс
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Когда запрос начался
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Когда запрос успешно завершился
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      // Когда запрос завершился с ошибкой
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default productsSlice.reducer