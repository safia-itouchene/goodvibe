import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  cartItems: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incoming = action.payload
      const incomingKey = incoming.itemKey || `${incoming.id}-default`
      const existing = state.cartItems.find(item => item.itemKey === incomingKey)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.itemKey === incomingKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...incoming, itemKey: incomingKey, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.itemKey !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.itemKey !== action.payload.itemKey),
        }
      }
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.itemKey === action.payload.itemKey
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }
    default:
      return state
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('goodvibe-cart')
    if (!saved) return initialState
    const parsed = JSON.parse(saved)
    return {
      ...parsed,
      cartItems: (parsed.cartItems || []).map((item) => ({
        ...item,
        itemKey: item.itemKey || `${item.id}-${item.customization?.signature || 'default'}`,
      })),
    }
  } catch {
    return initialState
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem('goodvibe-cart', JSON.stringify(state))
  }, [state])

  const cartTotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeFromCart = (itemKey) => dispatch({ type: 'REMOVE_ITEM', payload: itemKey })
  const updateQuantity = (itemKey, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { itemKey, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{
      cartItems: state.cartItems,
      cartTotal,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
