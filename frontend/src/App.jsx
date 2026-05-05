import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { fetchProducts } from './store/slices/productsSlice'
import { selectFilters } from './store/slices/filtersSlice'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomePage from './pages/home_page/HomePage'
import CatalogPage from './pages/catalog_page/CatalogPage'
import CartPage from './pages/card_page/CartPage'
import CheckoutPage from './pages/checkout_page/CheckoutPage'
import OrderConfirmationPage from './pages/order_confirmation_page/OrderConfirmationPage'
import ProductPage from './pages/product_page/ProductPage'
import ContactsPage from './pages/contacts_page/ContactsPage'

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
            <Route path="/" element={<HomePage products={products} loading={loading} />} />
            <Route path="/catalog" element={<CatalogPage products={filteredProducts} loading={loading} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
