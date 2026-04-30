import Sidebar from '../components/Sidebar'
import ProductCard from '../components/ProductCard'

function CatalogPage({ 
  products, 
  loading, 
  filters, 
  onFilterChange, 
  socles, 
  shapes, 
  types 
}) {
  return (
    <div className="catalog-container">
      <Sidebar 
        filters={filters}
        onFilterChange={onFilterChange}
        socles={socles}
        shapes={shapes}
        types={types}
      />
      <div className="products-container">
        <h2>Каталог лампочек</h2>
        {loading ? (
          <p>Загрузка товаров...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.good_id} product={product} />
            ))}
          </div>
        )}
        {!loading && products.length === 0 && (
          <p>Товары не найдены</p>
        )}
      </div>
    </div>
  )
}

export default CatalogPage