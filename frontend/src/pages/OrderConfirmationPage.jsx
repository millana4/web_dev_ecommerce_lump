import { Link, useParams } from 'react-router-dom'

function OrderConfirmationPage() {
  const { orderId } = useParams()

  return (
    <div className="confirmation-page">
      <h2>Спасибо за заказ! 🎉</h2>
      <div className="confirmation-card">
        <p className="confirmation-message">
          Номер вашего заказа: <strong>#{orderId}</strong>
        </p>
        <p>Оператор свяжется с вами в ближайшее время.</p>
        <Link to="/" className="continue-btn">
          На главную
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage