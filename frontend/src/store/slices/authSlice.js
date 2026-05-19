import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,  // { id, username, role }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout: (state) => {
      state.token = null
      state.user = null
    },
  },
})

export const { setAuth, logout } = authSlice.actions

export const selectToken = (state) => state.auth.token
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.token !== null
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin'

export default authSlice.reducer