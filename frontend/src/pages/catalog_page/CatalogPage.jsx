import { useSelector } from 'react-redux'
import Sidebar from '../../components/sidebar/Sidebar'
import ProductCard from '../../components/product_card/ProductCard'
import { selectFilters } from '../../store/slices/filtersSlice'
import styles from './CatalogPage.module.css'

function CatalogPage({ products, loading }) {
  const filters = useSelector(selectFilters)

  const filteredProducts = products.filter(product => {
    if (filters.socle_id && product.socle_id !== parseInt(filters.socle_id)) return false
    if (filters.shape_id && product.shape_id !== parseInt(filters.shape_id)) return false
    if (filters.type_id && product.type_id !== parseInt(filters.type_id)) return false
    return true
  })

  return (
    <div className={styles.catalogContainer}>
      <Sidebar />
      <div className={styles.productsContainer}>
        <h2>Каталог лампочек</h2>
        {loading ? (
          <p>Загрузка товаров...</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.good_id} product={product} />
            ))}
          </div>
        )}
        {!loading && filteredProducts.length === 0 && (
          <p>Товары не найдены</p>
        )}
      </div>
    </div>
  )
}

export default CatalogPage