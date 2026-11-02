import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart')
      setCart(res.data)
      setCartCount(res.data.items?.reduce((s, i) => s + i.quantity, 0) || 0)
    } catch {
      setCart(null)
      setCartCount(0)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/api/cart/items', { productId, quantity })
    setCart(res.data)
    setCartCount(res.data.items?.reduce((s, i) => s + i.quantity, 0) || 0)
    return res.data
  }

  const updateCartItem = async (cartItemId, quantity) => {
    const res = await api.put(`/api/cart/items/${cartItemId}`, { quantity })
    setCart(res.data)
    setCartCount(res.data.items?.reduce((s, i) => s + i.quantity, 0) || 0)
  }

  const removeCartItem = async (cartItemId) => {
    const res = await api.delete(`/api/cart/items/${cartItemId}`)
    setCart(res.data)
    setCartCount(res.data.items?.reduce((s, i) => s + i.quantity, 0) || 0)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchCart()
  }, [])

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateCartItem, removeCartItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
