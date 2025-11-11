import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export type CartItem = {
  id: string;
  title: string;
  image?: string;
  price: number; // base price
  discountValue?: number; // percentage (e.g., 20 for 20%)
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

type AddItemPayload = Omit<CartItem, 'quantity'> & { quantity?: number };

type CartAction =
  | { type: 'ADD_ITEM'; payload: AddItemPayload }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR' };

const STORAGE_KEY = 'cart';

const initialState: CartState = {
  items: []
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, title, image, price, discountValue, quantity = 1 } = action.payload;
      console.log("STATE", state)
      console.log("Payload", action.payload)
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i))
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
      return { ...state, items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function getInitialState(): CartState {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw) as CartState;
  } catch {}
  return initialState;
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(cartReducer, undefined as unknown as CartState, getInitialState);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {}
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return React.createElement(CartContext.Provider, { value }, children as any);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  const { state, dispatch } = ctx;

  function addItem(item: AddItemPayload) {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }
  function removeItem(id: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }
  function updateQuantity(id: string, quantity: number) {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  }
  function clear() {
    dispatch({ type: 'CLEAR' });
  }
  function getSubtotal(item: CartItem) {
    const discount = item.discountValue ? (item.price * item.discountValue) / 100 : 0;
    const finalUnit = item.price - discount;
    return finalUnit * item.quantity;
  }

  const total = state.items.reduce((sum: number, it: CartItem) => sum + getSubtotal(it), 0);

  return { items: state.items, addItem, removeItem, updateQuantity, clear, total };
}
