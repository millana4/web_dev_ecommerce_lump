import { useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/product/${product.good_id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation() // Чтобы не сработал переход на страницу товара
    addToCart(product)
  }

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <h3>{product.title}</h3>
      <p className="price">{product.price} ₽</p>
      <p className="quantity">В наличии: {product.quantity} шт.</p>
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
      >
        В корзину
      </button>
    </div>
  )
}

export default ProductCard