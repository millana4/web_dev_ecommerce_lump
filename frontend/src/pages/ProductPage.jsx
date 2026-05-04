import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { api } from '../services/api'

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [socles, setSocles] = useState([])
  const [shapes, setShapes] = useState([])
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    // Загружаем товар
    api.getGood(parseInt(id))
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Ошибка загрузки товара:', err)
        setError('Товар не найден')
        setLoading(false)
      })

    // Загружаем отзывы
    api.getReviews(parseInt(id))
      .then(data => setReviews(data))
      .catch(err => console.error('Ошибка загрузки отзывов:', err))

    // Загружаем справочники
    Promise.all([
      api.getSocles(),
      api.getShapes(),
      api.getTypes()
    ]).then(([soclesData, shapesData, typesData]) => {
      setSocles(soclesData)
      setShapes(shapesData)
      setTypes(typesData)
    }).catch(err => console.error('Ошибка загрузки справочников:', err))
  }, [id])

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  if (loading) return <p className="loading">Загрузка...</p>
  if (error) return <p className="error">{error}</p>
  if (!product) return null

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate('/catalog')}>← Назад в каталог</button>
      
      <div className="product-details">
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="product-price">{product.price} ₽</p>
          <p className="product-stock">В наличии: {product.quantity} шт.</p>
          <p className="product-description">{product.description || 'Описание отсутствует'}</p>
          
          {product.quantity > 0 ? (
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className="out-of-stock-btn" disabled>Нет в наличии</button>
          )}
        </div>

        <div className="product-specs">
          <h3>Характеристики</h3>
          <table>
            <tbody>
              <tr>
                <td>Мощность:</td>
                <td>{product.power || '—'} Вт</td>
              </tr>
              <tr>
                <td>Световой поток:</td>
                <td>{product.illumination || '—'} лм</td>
              </tr>
              <tr>
                <td>Размер:</td>
                <td>{product.size || '—'} см</td>
              </tr>
              <tr>
                <td>Цоколь:</td>
                <td>{socles.find(s => s.socle_id === product.socle_id)?.title || '—'}</td>
              </tr>
              <tr>
                <td>Форма:</td>
                <td>{shapes.find(s => s.shape_id === product.shape_id)?.title || '—'}</td>
              </tr>
              <tr>
                <td>Тип:</td>
                <td>{types.find(t => t.type_id === product.type_id)?.title || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Отзывы</h2>
        {reviews.length === 0 ? (
          <p>Пока нет отзывов. Будьте первым!</p>
        ) : (
          reviews.map(review => (
            <div key={review.review_id} className="review-card">
              <div className="review-rating">
                {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="review-comment">{review.comment}</p>
              <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductPage