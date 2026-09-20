import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * CheckoutSummary Component
 * 
 * Requirement:
 * "Add a checkout summary that reads the cart via useContext—no prop may carry cart data anywhere in the tree."
 * 
 * Zero props passed! Reads all values directly from CartContext & AuthContext.
 */
export function CheckoutSummary() {
  const { totalQuantity, subtotal, tax, shipping, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleCheckout = () => {
    if (totalQuantity === 0) return;
    setIsOrdered(true);
    clearCart();
    setTimeout(() => {
      setIsOrdered(false);
    }, 4500);
  };

  return (
    <div className="summary-card" id="checkout-summary-section">
      <div className="card-header-bar">
        <h3 className="card-title">
          <CreditCard size={18} color="#6366f1" />
          <span>Checkout Summary</span>
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          useContext Powered
        </span>
      </div>

      {isOrdered ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }} id="order-success-banner">
          <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
            Order Placed Successfully!
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {isAuthenticated && user
              ? `Receipt confirmation sent to ${user.email}.`
              : 'Thank you for testing our architecture!'}
          </p>
        </div>
      ) : (
        <>
          <div className="summary-line">
            <span>Total Units</span>
            <span id="summary-total-units" style={{ fontFamily: 'var(--font-mono)' }}>
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <span id="summary-subtotal" style={{ fontFamily: 'var(--font-mono)' }}>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-line">
            <span>Estimated Tax (8%)</span>
            <span id="summary-tax" style={{ fontFamily: 'var(--font-mono)' }}>
              ${tax.toFixed(2)}
            </span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span id="summary-shipping" style={{ fontFamily: 'var(--font-mono)' }}>
              {subtotal === 0 ? '$0.00' : shipping === 0 ? 'FREE (Over $100)' : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="summary-line total">
            <span>Grand Total</span>
            <span id="summary-grand-total" style={{ color: '#818cf8', fontSize: '1.25rem' }}>
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} />
            <span>Pure useReducer state • Zero prop drilling</span>
          </div>

          <button
            type="button"
            className="btn-checkout"
            id="btn-place-order"
            onClick={handleCheckout}
            disabled={totalQuantity === 0}
          >
            {totalQuantity === 0 ? 'Add items to checkout' : `Place Order ($${grandTotal.toFixed(2)})`}
          </button>
        </>
      )}
    </div>
  );
}
