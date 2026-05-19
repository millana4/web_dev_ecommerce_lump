import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../store/slices/authSlice'
import { api } from '../../services/api'
import styles from './AdminOrdersPage.module.css'

const STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED']

function AdminOrdersPage() {
  const token = useSelector(selectToken)
  const [orders, setOrders] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    try {
      const data = await api.getOrders(token)
      setOrders(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const handleSelect = async (id) => {
    setSelectedId(id)
    try {
      const data = await api.getOrder(id, token)
      setDetails(data)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status, token)
      loadOrders()
      if (selectedId === id) handleSelect(id)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h3>Заказы</h3>
      {error && <div className={styles.error}>{error}</div>}

      {orders.length === 0 ? (
        <p className={styles.empty}>Заказов пока нет.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Клиент</th><th>Телефон</th>
              <th>Сумма</th><th>Статус</th><th>Создан</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td>
                <td>{o.customer_name}</td>
                <td>{o.customer_phone}</td>
                <td>{o.total_price} ₽</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleSelect(o.order_id)} className={styles.btnDetails}>
                    Детали
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {details && (
        <div className={styles.details}>
          <h4>Заказ #{details.order_id}</h4>
          <p><strong>Имя:</strong> {details.customer_name}</p>
          <p><strong>Телефон:</strong> {details.customer_phone}</p>
          <p><strong>Email:</strong> {details.customer_email}</p>
          {details.order_comment && <p><strong>Комментарий:</strong> {details.order_comment}</p>}
          <h5>Позиции:</h5>
          <ul>
            {details.items.map(item => (
              <li key={item.order_item_id}>
                Товар #{item.good_id} — {item.quantity} шт. × {item.price} ₽
              </li>
            ))}
          </ul>
          <button onClick={() => { setDetails(null); setSelectedId(null) }} className={styles.btnClose}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage