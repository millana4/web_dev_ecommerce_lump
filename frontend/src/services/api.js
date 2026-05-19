const API_BASE_URL = 'http://localhost:8001/api/v1'
const ORDERS_API_URL = 'http://localhost:8002/api/v1'
const DISCOUNT_API_URL = 'http://localhost:8003/api/v1'
const AUTH_API_URL = 'http://localhost:8004/api/v1'

// Универсальная обёртка для запросов с авторизацией
const authFetch = async (url, options = {}, token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return fetch(url, { ...options, headers })
}

export const api = {
  // ========== AUTH ==========
  login: async (username, password) => {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.detail || 'Ошибка входа')
    }
    return response.json()
  },

  getMe: async (token) => {
    const response = await authFetch(`${AUTH_API_URL}/auth/me`, {}, token)
    if (!response.ok) throw new Error('Не удалось получить данные пользователя')
    return response.json()
  },

  // ========== ТОВАРЫ (публичные) ==========
  getGoods: async () => {
    const response = await fetch(`${API_BASE_URL}/goods`)
    if (!response.ok) throw new Error('Ошибка загрузки товаров')
    return response.json()
  },

  getGood: async (id) => {
    const response = await fetch(`${API_BASE_URL}/goods/${id}`)
    if (!response.ok) throw new Error('Товар не найден')
    return response.json()
  },

  // ========== ТОВАРЫ (админские) ==========
  createGood: async (data, token) => {
    const response = await authFetch(`${API_BASE_URL}/goods`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token)
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.detail || 'Не удалось создать товар')
    }
    return response.json()
  },

  updateGood: async (id, data, token) => {
    const response = await authFetch(`${API_BASE_URL}/goods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token)
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.detail || 'Не удалось обновить товар')
    }
    return response.json()
  },

  deleteGood: async (id, token) => {
    const response = await authFetch(`${API_BASE_URL}/goods/${id}`, {
      method: 'DELETE',
    }, token)
    if (!response.ok) throw new Error('Не удалось удалить товар')
  },

  // ========== ЗАКАЗЫ ==========
  createOrder: async (orderData) => {
    const response = await fetch(`${ORDERS_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ошибка ответа:', response.status, errorText)
      throw new Error('Ошибка создания заказа')
    }
    return response.json()
  },

  getOrders: async (token) => {
    const response = await authFetch(`${ORDERS_API_URL}/orders`, {}, token)
    if (!response.ok) throw new Error('Не удалось загрузить заказы')
    return response.json()
  },

  getOrder: async (id, token) => {
    const response = await authFetch(`${ORDERS_API_URL}/orders/${id}`, {}, token)
    if (!response.ok) throw new Error('Заказ не найден')
    return response.json()
  },

  updateOrderStatus: async (id, status, token) => {
    const response = await authFetch(`${ORDERS_API_URL}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }, token)
    if (!response.ok) throw new Error('Не удалось обновить статус')
    return response.json()
  },

  getReviews: async (goodId) => {
    const response = await fetch(`${ORDERS_API_URL}/reviews?good_id=${goodId}`)
    if (!response.ok) throw new Error('Ошибка загрузки отзывов')
    return response.json()
  },

  // ========== СПРАВОЧНИКИ ==========
  getSocles: async () => {
    const response = await fetch(`${API_BASE_URL}/socles`)
    return response.json()
  },
  getShapes: async () => {
    const response = await fetch(`${API_BASE_URL}/shapes`)
    return response.json()
  },
  getTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/types`)
    return response.json()
  },

  // ========== АКЦИЯ ==========
  getActiveDiscount: async () => {
    const response = await fetch(`${DISCOUNT_API_URL}/discount/active`)
    if (!response.ok) throw new Error('Ошибка загрузки акции')
    return response.json()
  },
}