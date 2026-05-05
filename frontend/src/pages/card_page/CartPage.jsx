import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  selectCartItems, 
  selectCartTotalItems, 
  selectCartTotalWithoutDiscount, 
  removeFromCart, 
  updateQuantity 
} from '../../store/slices/cartSlice'
import { api } from '../../services/api'
import styles from './CartPage.module.css'

function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const cartItems = useSelector(selectCartItems)
  const getTotalItems = useSelector(selectCartTotalItems)
  const totalWithoutDiscount = useSelector(selectCartTotalWithoutDiscount)
  
  const [discount, setDiscount] = useState(null)

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

  const handleRemoveFromCart = (good_id) => {
    dispatch(removeFromCart(good_id))
  }
  
  const handleUpdateQuantity = (good_id, quantity) => {
    dispatch(updateQuantity({ good_id, quantity }))
  }

  const totalWithDiscount = discount && discount.is_active
    ? totalWithoutDiscount * (100 - discount.discount_percent) / 100
    : totalWithoutDiscount

  if (cartItems.length === 0) {
    return (
      <div>
        <h2>Корзина</h2>
        <p>Корзина пуста</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Корзина ({getTotalItems} товаров)</h2>
      <div className={styles.cartItems}>
        {cartItems.map(item => (
          <div key={item.good_id} className={styles.cartItem}>
            <div className={styles.cartItemInfo}>
              <h3>{item.title}</h3>
              <p>{item.price} ₽</p>
            </div>
            <div className={styles.cartItemControls}>
              <input
                type="number"
                min="1"
                max={item.maxStock}
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.good_id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveFromCart(item.good_id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.cartTotal}>
        {discount && discount.is_active && totalWithoutDiscount !== totalWithDiscount ? (
          <>
            <p className={styles.oldTotal}>
              Без скидки: <span className={styles.oldPrice}>{totalWithoutDiscount.toFixed(2)} ₽</span>
            </p>
            <p className={styles.discountInfo}>
              Скидка: {discount.discount_percent}%
            </p>
            <h3>
              Итого со скидкой: {totalWithDiscount.toFixed(2)} ₽
            </h3>
            <br></br>
          </>
        ) : (
          <h3>Итого: {totalWithoutDiscount.toFixed(2)} ₽</h3>
        )}
        <button 
          className={styles.checkoutBtn}
          onClick={() => navigate('/checkout')}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  )
}

export default CartPage