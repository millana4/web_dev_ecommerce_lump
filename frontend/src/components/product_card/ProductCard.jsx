import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/product/${product.good_id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    dispatch(addToCart(product))
  }

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.price}>{product.price} ₽</p>
      <p className={styles.quantity}>В наличии: {product.quantity} шт.</p>
      <button className={styles.addToCartBtn} onClick={handleAddToCart}>
        В корзину
      </button>
    </div>
  )
}

export default ProductCard