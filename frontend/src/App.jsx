import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import { api } from './services/api'
import { useCart } from './store/CartContext'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ProductPage from './pages/ProductPage'

function App() {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [socles, setSocles] = useState([])
  const [shapes, setShapes] = useState([])
  const [types, setTypes] = useState([])
  const [filters, setFilters] = useState({
    socle_id: '',
    shape_id: '',
    type_id: ''
  })
  
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  // Загружаем данные
  useEffect(() => {
    Promise.all([
      api.getGoods(),
      api.getSocles(),
      api.getShapes(),
      api.getTypes()
    ]).then(([goodsData, soclesData, shapesData, typesData]) => {
      setAllProducts(goodsData)
      setFilteredProducts(goodsData)
      setSocles(soclesData)
      setShapes(shapesData)
      setTypes(typesData)
      setLoading(false)
    }).catch(error => {
      console.error('Ошибка загрузки данных:', error)
      setLoading(false)
    })
  }, [])

  // Применяем фильтры для каталога
  useEffect(() => {
    let filtered = [...allProducts]
    
    if (filters.socle_id) {
      filtered = filtered.filter(p => p.socle_id === parseInt(filters.socle_id))
    }
    if (filters.shape_id) {
      filtered = filtered.filter(p => p.shape_id === parseInt(filters.shape_id))
    }
    if (filters.type_id) {
      filtered = filtered.filter(p => p.type_id === parseInt(filters.type_id))
    }
    
    setFilteredProducts(filtered)
  }, [filters, allProducts])

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const CartPage = () => {
    const navigate = useNavigate()
    
    if (cartItems.length === 0) {
      return (
        <div>
          <h2>Корзина</h2>
          <p>Корзина пуста</p>
        </div>
      )
    }

    return (
      <div>
        <h2>Корзина ({getTotalItems()} товаров)</h2>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.good_id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>{item.price} ₽</p>
              </div>
              <div className="cart-item-controls">
                <input
                  type="number"
                  min="1"
                  max={item.maxStock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.good_id, parseInt(e.target.value))}
                />
                <button onClick={() => removeFromCart(item.good_id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <h3>Итого: {getTotalPrice()} ₽</h3>
          <button 
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <nav>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/cart">Корзина</Link>
          </nav>
          <h1>COOL LUMP SHOP</h1>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={
              <HomePage products={allProducts} loading={loading} />
            } />
            <Route path="/catalog" element={
              <CatalogPage 
                products={filteredProducts}
                loading={loading}
                filters={filters}
                onFilterChange={handleFilterChange}
                socles={socles}
                shapes={shapes}
                types={types}
              />
            } />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
