import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

/**
 * CartList Component
 * 
 * Architecture Guarantee:
 * Consumes CartContext directly via useCart().
 * Receives NO props carrying cart data anywhere from the parent tree.
 */
export function CartList() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="empty-cart-state" id="empty-cart-message">
        <ShoppingBag className="empty-cart-icon" />
        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Your cart is empty</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Select an item from the catalog to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="cart-items-list" id="cart-items-container">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="cart-item-row" 
          id={`cart-row-${item.id}`}
        >
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
            />
          )}

          <div className="cart-item-info">
            <h4 className="cart-item-name" title={item.name}>
              {item.name}
            </h4>
            <div className="cart-item-price">
              ${item.price.toFixed(2)} &times; {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>

          {/* Stepper with real dispatch buttons */}
          <div className="quantity-control-group">
            <button
              type="button"
              className={`qty-btn ${item.quantity === 1 ? 'danger' : ''}`}
              id={`qty-decrease-${item.id}`}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
              title={item.quantity === 1 ? 'Decreasing to 0 removes the line' : 'Decrease quantity'}
            >
              <Minus size={13} />
            </button>

            <span 
              className="qty-number" 
              id={`qty-display-${item.id}`}
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>

            <button
              type="button"
              className="qty-btn"
              id={`qty-increase-${item.id}`}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              title="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Trash Button */}
          <button
            type="button"
            className="btn-remove-item"
            id={`btn-remove-${item.id}`}
            onClick={() => removeItem(item.id)}
            aria-label="Delete line item"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
