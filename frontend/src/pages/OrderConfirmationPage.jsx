import { Link, useParams } from 'react-router-dom'

function OrderConfirmationPage() {
  const { orderId } = useParams()

  return (
    <div className="confirmation-page">
      <h2>Заказ оформлен!</h2>
      <div className="confirmation-card">
        <p>Номер вашего заказа: <strong>#{orderId}</strong></p>
        <p>Статус: <strong>NEW</strong></p>
        <p>Мы свяжемся с вами в ближайшее время.</p>
        <Link to="/" className="continue-btn">Продолжить покупки</Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage