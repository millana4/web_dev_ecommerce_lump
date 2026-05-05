import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from "../../components/product_card/ProductCard";
import { api } from "../../services/api";
import styles from "./HomePage.module.css";

function HomePage({ products, loading }) {
  const navigate = useNavigate()
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
  
  const popularProducts = products.slice(0, 4)

  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Самые крутые лампочки</h1>
          <p className={styles.heroTagline}>Быстро, недорого, с доставкой по всей России</p>
          <button 
            className={styles.heroButton}
            onClick={() => navigate('/catalog')}
          >
            Смотреть каталог
          </button>
        </div>
        <div className={styles.heroImage}>
          <img src="/images/hero.jpg" alt="Лампочки" />
        </div>
      </div>

      <div className={styles.popularSection}>
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

      {discount && discount.is_active && (
        <div className={styles.saleSection}>
          <div className={styles.saleContent}>
            <h2>🔥 Акция! 🔥</h2>
            <p className={styles.saleText}>{discount.description}</p>
            <p className={styles.saleDates}>
              {discount.ends_at 
                ? `До ${new Date(discount.ends_at).toLocaleDateString()}` 
                : 'Спешите, предложение ограничено!'}
            </p>
            <button 
              className={styles.saleButton}
              onClick={() => navigate('/catalog')}
            >
              Выбрать лампочки
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage