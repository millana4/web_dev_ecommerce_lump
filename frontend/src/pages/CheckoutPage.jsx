import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { api } from '../services/api'

function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    order_comment: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Если корзина пуста, перенаправляем на каталог
  if (cartItems.length === 0) {
    navigate('/')
    return null
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const orderData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      order_comment: formData.order_comment,
      items: cartItems.map(item => ({
        good_id: item.good_id,
        quantity: item.quantity,
        price: item.price
      }))
    }

    try {
      const response = await api.createOrder(orderData)
      console.log('Заказ создан:', response)
      clearCart()
      navigate(`/order-confirmation/${response.order_id}`)
    } catch (err) {
      console.error('Ошибка при создании заказа:', err)
      setError('Не удалось оформить заказ. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h2>Оформление заказа</h2>
      
      <div className="checkout-container">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя *</label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Телефон *</label>
              <input
                type="tel"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Комментарий к заказу</label>
              <textarea
                name="order_comment"
                rows="3"
                value={formData.order_comment}
                onChange={handleChange}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Ваш заказ</h3>
          {cartItems.map(item => (
            <div key={item.good_id} className="summary-item">
              <span>{item.title} x {item.quantity}</span>
              <span>{item.price * item.quantity} ₽</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Итого:</strong>
            <strong>{getTotalPrice()} ₽</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage