import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api/v1'
const ORDERS_API_URL = 'http://localhost:8002/api/v1'

export const api = {
  // Товары
  getGoods: async () => {
    const response = await axios.get(`${API_BASE_URL}/goods`)
    return response.data
  },
  
  getGood: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/goods/${id}`)
    return response.data
  },

  // Заказы
  createOrder: async (orderData) => {
    const response = await axios.post(`${ORDERS_API_URL}/orders`, orderData)
    return response.data
  },

  // Отзывы
  getReviews: async (goodId) => {
    const response = await axios.get(`${ORDERS_API_URL}/reviews`, {
      params: { good_id: goodId }
    })
    return response.data
  },

  // ========== НОВЫЕ МЕТОДЫ ДЛЯ СПРАВОЧНИКОВ ==========
  getSocles: async () => {
    const response = await axios.get(`${API_BASE_URL}/socles`)
    return response.data
  },

  getShapes: async () => {
    const response = await axios.get(`${API_BASE_URL}/shapes`)
    return response.data
  },

  getTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/types`)
    return response.data
  }
}
