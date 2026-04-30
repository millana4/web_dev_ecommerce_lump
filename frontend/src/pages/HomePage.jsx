import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function HomePage({ products, loading }) {
  const navigate = useNavigate()
  
  const popularProducts = products.slice(0, 4)

  return (
    <div className="home-page">
      {/* Hero блок */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>COOL LUMP - самые крутые лампочки</h1>
          <p className="hero-tagline">Быстро, недорого, с доставкой по всей России</p>
          <button 
            className="hero-button"
            onClick={() => navigate('/catalog')}
          >
            Смотреть каталог
          </button>
        </div>
        <div className="hero-image">
          <img src="/images/hero.jpg" alt="Лампочки" />
        </div>
      </div>

      {/* Блок популярных лампочек */}
      <div className="popular-section">
        <h2>Популярные лампочки</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="products-grid">
            {popularProducts.map(product => (
              <ProductCard key={product.good_id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Блок акции */}
      <div className="sale-section">
        <div className="sale-content">
          <h2>🔥 Акция! 🔥</h2>
          <p className="sale-text">Только сегодня скидка на все лампочки 10%</p>
          <p className="sale-dates">Спешите, предложение ограничено!</p>
          <button 
            className="sale-button"
            onClick={() => navigate('/catalog')}
          >
            Выбрать лампочки
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
