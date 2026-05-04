import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { fetchProducts } from './store/slices/productsSlice'
import { selectFilters } from './store/slices/filtersSlice'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ProductPage from './pages/ProductPage'

function App() {
  const dispatch = useDispatch()
  
  // Получаем данные из Redux
  const { items: products, loading, error } = useSelector((state) => state.products)
  const filters = useSelector(selectFilters)
  
  // Загружаем товары при монтировании
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Применяем фильтры к товарам
  const filteredProducts = products.filter(product => {
    if (filters.socle_id && product.socle_id !== parseInt(filters.socle_id)) return false
    if (filters.shape_id && product.shape_id !== parseInt(filters.shape_id)) return false
    if (filters.type_id && product.type_id !== parseInt(filters.type_id)) return false
    return true
  })

  if (error) {
    return <div className="error">Ошибка: {error}</div>
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        
        <main className="main">
          <Routes>
            <Route path="/" element={
              <HomePage products={products} loading={loading} />
            } />
            <Route path="/catalog" element={
              <CatalogPage 
                products={filteredProducts}
                loading={loading}
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
