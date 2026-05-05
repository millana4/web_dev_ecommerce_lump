import { Link, useParams } from 'react-router-dom'
import styles from './OrderConfirmationPage.module.css'

function OrderConfirmationPage() {
  const { orderId } = useParams()

  return (
    <div className={styles.confirmationPage}>
      <h2>Спасибо за заказ! 🎉</h2>
      <div className={styles.confirmationCard}>
        <p className={styles.confirmationMessage}>
          Номер вашего заказа: <strong>#{orderId}</strong>
        </p>
        <p>Оператор свяжется с вами в ближайшее время.</p>
        <Link to="/" className={styles.continueBtn}>
          На главную
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage