const API_BASE_URL = 'http://localhost:8001/api/v1'
const ORDERS_API_URL = 'http://localhost:8002/api/v1'
const DISCOUNT_API_URL = 'http://localhost:8003/api/v1'

export const api = {
  // Товары
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

  // Заказы
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

  // Отзывы
  getReviews: async (goodId) => {
    const response = await fetch(`${ORDERS_API_URL}/reviews?good_id=${goodId}`)
    if (!response.ok) throw new Error('Ошибка загрузки отзывов')
    return response.json()
  },

  // Справочники
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

  // Акции
  getActiveDiscount: async () => {
    const response = await fetch(`${DISCOUNT_API_URL}/discount/active`)
    if (!response.ok) throw new Error('Ошибка загрузки акции')
    return response.json()
  }
}