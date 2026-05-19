import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartTotalWithoutDiscount, clearCart } from "../../store/slices/cartSlice";
import { api } from "../../services/api";
import styles from "./CheckoutPage.module.css";

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(selectCartItems)
  const totalWithoutDiscount = useSelector(selectCartTotalWithoutDiscount)
  const [discount, setDiscount] = useState(null)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    order_comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderCompleted, setOrderCompleted] = useState(false)

  useEffect(() => {
    if (cartItems.length === 0 && !orderCompleted) {
      navigate('/')
    }
  }, [cartItems, navigate, orderCompleted])

  useEffect(() => {
    api.getActiveDiscount()
      .then(data => setDiscount(data))
      .catch(err => {
        if (err.response?.status !== 404) {
          console.error('Ошибка загрузки акции:', err)
        }
        setDiscount(null)
      })
  }, [])

  const totalWithDiscount = discount && discount.is_active
    ? totalWithoutDiscount * (100 - discount.discount_percent) / 100
    : totalWithoutDiscount

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
        quantity: item.quantity
      }))
    }

    try {
      const response = await api.createOrder(orderData)
      dispatch(clearCart())
      setOrderCompleted(true)
      navigate(`/order-confirmation/${response.order_id}`)
    } catch (err) {
      console.error('Ошибка при создании заказа:', err)
      setError('Не удалось оформить заказ. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return null
  }

  return (
    <div className={styles.checkoutPage}>
      <h2>Оформление заказа</h2>
      
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Имя *</label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Телефон *</label>
              <input
                type="tel"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Комментарий к заказу</label>
              <textarea
                name="order_comment"
                rows="3"
                value={formData.order_comment}
                onChange={handleChange}
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </form>
        </div>

        <div className={styles.checkoutSummary}>
          <h3>Ваш заказ</h3>
          {cartItems.map(item => (
            <div key={item.good_id} className={styles.summaryItem}>
              <span>{item.title} x {item.quantity}</span>
              <span>{item.price * item.quantity} ₽</span>
            </div>
          ))}
          
          {discount && discount.is_active && totalWithoutDiscount !== totalWithDiscount ? (
            <>
              <div className={`${styles.summaryItem} ${styles.oldTotal}`}>
                <span>Без скидки:</span>
                <span className={styles.oldPrice}>{totalWithoutDiscount.toFixed(2)} ₽</span>
              </div>
              <div className={`${styles.summaryItem} ${styles.discountInfo}`}>
                <span>Скидка ({discount.discount_percent}%):</span>
                <span>-{(totalWithoutDiscount - totalWithDiscount).toFixed(2)} ₽</span>
              </div>
              <div className={styles.summaryTotal}>
                <strong>Итого со скидкой:</strong>
                <strong>{totalWithDiscount.toFixed(2)} ₽</strong>
              </div>
            </>
          ) : (
            <div className={styles.summaryTotal}>
              <strong>Итого:</strong>
              <strong>{totalWithoutDiscount.toFixed(2)} ₽</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage