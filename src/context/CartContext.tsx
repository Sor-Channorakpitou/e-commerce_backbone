import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CartState, CartAction, CartContextType, CartItem } from '../types';

/**
 * PURE REDUCER FUNCTION
 * 
 * Audit Checklist Enforced:
 * 1. PURE: Zero side effects (no fetch, no localStorage, no console.log).
 * 2. DEFAULT BRANCH: Returns state strictly untouched.
 * 3. BUSINESS RULE: Quantity <= 0 removes the item line completely from state.
 * 4. IMMUTABLE: Returns brand-new state references without mutating previous state.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Item exists in cart: increment its quantity by 1
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

        return {
          ...state,
          items: updatedItems,
        };
      }

      // New item: append with initial quantity of 1
      const newItem: CartItem = {
        ...action.payload,
        quantity: 1,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      // RULE: Quantity 0 (or negative) removes the line from the cart
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      // Otherwise, update quantity for the targeted item
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === id) {
            return { ...item, quantity };
          }
          return item;
        }),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    // Default branch strictly returns state untouched
    default:
      return state;
  }
}

// Context creation
export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialState?: CartState;
}

const DEFAULT_INITIAL_STATE: CartState = {
  items: [],
};

// Hand-written CartProvider wrapping useReducer with useLocalStorage persistence
export function CartProvider({ children, initialState = DEFAULT_INITIAL_STATE }: CartProviderProps) {
  const [persistedItems, setPersistedItems] = useLocalStorage<CartItem[]>('shopping-cart-items', () => {
    return initialState.items.length > 0 ? initialState.items : [];
  });

  const [state, dispatch] = useReducer(cartReducer, {
    items: initialState.items.length > 0 ? initialState.items : persistedItems,
  });

  // Sync reducer state back to localStorage
  useEffect(() => {
    setPersistedItems(state.items);
  }, [state.items, setPersistedItems]);

  // Pure derived state computations (memoized per render cycle)
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const grandTotal = parseFloat((subtotal + tax + shipping).toFixed(2));

  // Action dispatchers
  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    items: state.items,
    totalQuantity,
    subtotal,
    tax,
    shipping,
    grandTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    dispatch,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook with consumer guard
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
