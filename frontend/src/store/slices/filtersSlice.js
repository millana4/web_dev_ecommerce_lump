import { createSlice } from '@reduxjs/toolkit'

// Начальное состояние фильтров
const initialState = {
  socle_id: '',
  shape_id: '',
  type_id: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Установить фильтр по цоколю
    setSocleFilter: (state, action) => {
      state.socle_id = action.payload
    },
    
    // Установить фильтр по форме
    setShapeFilter: (state, action) => {
      state.shape_id = action.payload
    },
    
    // Установить фильтр по типу
    setTypeFilter: (state, action) => {
      state.type_id = action.payload
    },
    
    // Сбросить все фильтры
    resetFilters: (state) => {
      state.socle_id = ''
      state.shape_id = ''
      state.type_id = ''
    },
  },
})

// Экспортируем actions
export const { setSocleFilter, setShapeFilter, setTypeFilter, resetFilters } = filtersSlice.actions

// Селекторы для использования в компонентах
export const selectFilters = (state) => state.filters
export const selectSocleFilter = (state) => state.filters.socle_id
export const selectShapeFilter = (state) => state.filters.shape_id
export const selectTypeFilter = (state) => state.filters.type_id

export default filtersSlice.reducer