import { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Добавить товар в корзину
    const addToCart = (product) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.good_id === product.good_id)
        
        console.log('product.quantity (склад):', product.quantity)
        console.log('existingItem?.quantity (в корзине):', existingItem?.quantity)
        
        if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        console.log('newQuantity:', newQuantity)
        
        if (newQuantity > product.quantity) {
            alert(`Нельзя добавить больше ${product.quantity} шт. (остаток на складе)`)
            return prevItems
        }
        return prevItems.map(item =>
            item.good_id === product.good_id
            ? { ...item, quantity: newQuantity }
            : item
        )
        } else {
        return [...prevItems, { 
            ...product, 
            quantity: 1,
            maxStock: product.quantity
        }]
        }
    })
    }

  // Удалить товар из корзины
  const removeFromCart = (good_id) => {
    setCartItems(prevItems => prevItems.filter(item => item.good_id !== good_id))
  }

  // Обновить количество товара
  const updateQuantity = (good_id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(good_id)
      return
    }
    
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.good_id === good_id)
      if (!item) return prevItems
      
      // Проверяем, не превышает ли новое количество остаток на складе
      if (quantity > item.maxStock) {
        alert(`Нельзя добавить больше ${item.maxStock} шт. (остаток на складе)`)
        return prevItems
      }
      
      return prevItems.map(item =>
        item.good_id === good_id ? { ...item, quantity } : item
      )
    })
  }

  // Очистить корзину
  const clearCart = () => {
    setCartItems([])
  }

  // Подсчитать общую сумму
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Подсчитать количество товаров
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}