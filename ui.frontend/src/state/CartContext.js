import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'cart';

const initialState = {
  items: []
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, title, image, price, discountValue, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { id, title, image, price, discountValue, quantity }]
      };
    }
    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return initialState;
}

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  const { state, dispatch } = ctx;

  function addItem(item) {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }
  function removeItem(id) {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }
  function updateQuantity(id, quantity) {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  }
  function clear() {
    dispatch({ type: 'CLEAR' });
  }

  function getSubtotal(item) {
    const discount = item.discountValue ? (item.price * item.discountValue) / 100 : 0;
    const finalUnit = item.price - discount;
    return finalUnit * item.quantity;
  }

  const total = state.items.reduce((sum, it) => sum + getSubtotal(it), 0);

  return { items: state.items, addItem, removeItem, updateQuantity, clear, total };
}
